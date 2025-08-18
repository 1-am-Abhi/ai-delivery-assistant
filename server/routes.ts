import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { TwilioService } from "./services/twilio";
import { OpenAIService } from "./services/openai";
import { insertCallLogSchema, insertDeliverySettingsSchema, insertAiConfigurationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Call logs endpoints
  app.get("/api/call-logs", async (req, res) => {
    try {
      const callLogs = await storage.getCallLogs();
      res.json(callLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch call logs" });
    }
  });

  app.post("/api/call-logs", async (req, res) => {
    try {
      const callLogData = insertCallLogSchema.parse(req.body);
      const callLog = await storage.createCallLog(callLogData);
      res.json(callLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid call log data" });
    }
  });

  app.patch("/api/call-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const callLog = await storage.updateCallLog(id, updates);
      if (!callLog) {
        return res.status(404).json({ message: "Call log not found" });
      }
      res.json(callLog);
    } catch (error) {
      res.status(400).json({ message: "Failed to update call log" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getCallStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Delivery settings endpoints
  app.get("/api/delivery-settings", async (req, res) => {
    try {
      const settings = await storage.getDeliverySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery settings" });
    }
  });

  app.put("/api/delivery-settings", async (req, res) => {
    try {
      const settingsData = insertDeliverySettingsSchema.parse(req.body);
      const settings = await storage.updateDeliverySettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid delivery settings data" });
    }
  });

  // AI configuration endpoints
  app.get("/api/ai-configuration", async (req, res) => {
    try {
      const config = await storage.getAiConfiguration();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI configuration" });
    }
  });

  app.put("/api/ai-configuration", async (req, res) => {
    try {
      const configData = insertAiConfigurationSchema.parse(req.body);
      const config = await storage.updateAiConfiguration(configData);
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: "Invalid AI configuration data" });
    }
  });

  // Twilio webhook for incoming calls
  app.post("/api/twilio/voice", async (req, res) => {
    try {
      const { From: phoneNumber, CallSid: callSid } = req.body;
      
      // Create call log
      const callLog = await storage.createCallLog({
        phoneNumber,
        callerName: null,
        status: 'in_progress',
        duration: null,
        transcript: '',
        deliveryInstructions: null,
        verificationRequired: false,
        otpProvided: null,
        codAmount: null,
        packageId: null,
      });

      // Get delivery settings
      const settings = await storage.getDeliverySettings();
      const defaultMessage = `Namaste! Main aapka AI assistant hun. ${settings?.defaultInstructions || 'Please tell me about your delivery.'}`;
      
      const twiml = TwilioService.generateTwiML(
        defaultMessage,
        `/api/twilio/gather/${callLog.id}`
      );

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Twilio voice webhook error:', error);
      res.status(500).send('Error processing call');
    }
  });

  // Handle speech input from caller
  app.post("/api/twilio/gather/:callId", async (req, res) => {
    try {
      const { callId } = req.params;
      const { SpeechResult: speechText, CallSid: callSid } = req.body;

      if (!speechText) {
        const twiml = TwilioService.generateTwiML(
          "Sorry, main aapki baat samajh nahi payi. Kripya phir se boliye.",
          `/api/twilio/gather/${callId}`
        );
        res.set('Content-Type', 'text/xml');
        res.send(twiml);
        return;
      }

      // Get call log and settings
      const callLog = await storage.getCallLog(callId);
      const settings = await storage.getDeliverySettings();
      
      if (!callLog || !settings) {
        res.status(404).send('Call not found');
        return;
      }

      // Process with OpenAI
      const conversationHistory = callLog.transcript 
        ? JSON.parse(callLog.transcript) 
        : [];

      const aiResponse = await OpenAIService.generateResponse({
        deliveryInstructions: settings.defaultInstructions,
        allowCod: settings.allowCod ?? true,
        requireOtp: settings.requireOtp ?? false,
        packageId: callLog.packageId || undefined,
        callerInput: speechText,
        conversationHistory,
      });

      // Update conversation history
      conversationHistory.push(
        { role: 'user', content: speechText },
        { role: 'assistant', content: aiResponse.response }
      );

      // Update call log
      await storage.updateCallLog(callId, {
        transcript: JSON.stringify(conversationHistory),
        packageId: aiResponse.extractedInfo.packageId || callLog.packageId,
        codAmount: aiResponse.extractedInfo.codAmount || callLog.codAmount,
        otpProvided: aiResponse.extractedInfo.otpProvided || callLog.otpProvided,
        status: aiResponse.extractedInfo.isCompleted ? 'completed' : 
               aiResponse.shouldEscalate ? 'escalated' : 'in_progress',
        endedAt: aiResponse.extractedInfo.isCompleted || aiResponse.shouldEscalate ? new Date() : null,
      });

      // Generate response
      if (aiResponse.shouldEscalate || aiResponse.extractedInfo.isCompleted) {
        const twiml = TwilioService.generateTwiML(aiResponse.response);
        res.set('Content-Type', 'text/xml');
        res.send(twiml);
      } else {
        const twiml = TwilioService.generateTwiML(
          aiResponse.response,
          `/api/twilio/gather/${callId}`
        );
        res.set('Content-Type', 'text/xml');
        res.send(twiml);
      }
    } catch (error) {
      console.error('Twilio gather webhook error:', error);
      const twiml = TwilioService.generateTwiML(
        "Technical problem ho rahi hai. Kripya thodi der baad call kariye."
      );
      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    }
  });

  // Test call endpoint
  app.post("/api/test-call", async (req, res) => {
    try {
      const { phoneNumber, scenario } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      const callbackUrl = `${req.protocol}://${req.get('host')}/api/twilio/voice`;
      const callResult = await TwilioService.initiateCall({
        to: phoneNumber,
        callbackUrl,
      });

      res.json({
        success: true,
        callSid: callResult.callSid,
        status: callResult.status,
      });
    } catch (error) {
      console.error('Test call error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to initiate test call" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
