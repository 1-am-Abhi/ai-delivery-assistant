import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_SECRET || process.env.API_KEY 
});

export interface ConversationContext {
  deliveryInstructions: string;
  allowCod: boolean;
  requireOtp: boolean;
  packageId?: string;
  callerInput: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export class OpenAIService {
  static async generateResponse(context: ConversationContext): Promise<{
    response: string;
    shouldEscalate: boolean;
    extractedInfo: {
      packageId?: string;
      codAmount?: number;
      otpProvided?: string;
      isCompleted: boolean;
    };
  }> {
    try {
      const systemPrompt = `You are an AI assistant handling delivery calls in India. You can speak both Hindi and English fluently, understanding code-mixed conversations.

Your role:
- Help delivery agents with package delivery
- Provide clear delivery instructions
- Handle COD and OTP verification if needed
- Escalate complex issues to humans

Current delivery settings:
- Instructions: ${context.deliveryInstructions}
- COD allowed: ${context.allowCod}
- OTP required: ${context.requireOtp}
- Package ID: ${context.packageId || 'Not provided'}

Guidelines:
- Be polite and helpful
- Use simple Hindi-English mix that delivery agents understand
- Keep responses concise (max 2-3 sentences)
- If you cannot resolve the issue, suggest escalation
- Extract important information like package ID, COD amount, OTP

Respond with JSON in this format:
{
  "response": "Your spoken response to the delivery agent",
  "shouldEscalate": false,
  "extractedInfo": {
    "packageId": "extracted package ID if mentioned",
    "codAmount": number if COD amount mentioned,
    "otpProvided": "OTP if provided",
    "isCompleted": true if delivery seems completed
  }
}`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...context.conversationHistory,
        { role: 'user' as const, content: context.callerInput }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        response: result.response || "I understand. Please hold on while I check.",
        shouldEscalate: result.shouldEscalate || false,
        extractedInfo: {
          packageId: result.extractedInfo?.packageId,
          codAmount: result.extractedInfo?.codAmount,
          otpProvided: result.extractedInfo?.otpProvided,
          isCompleted: result.extractedInfo?.isCompleted || false,
        }
      };
    } catch (error) {
      console.error('OpenAI service error:', error);
      return {
        response: "I'm having some technical difficulties. Please hold on while I connect you to a human agent.",
        shouldEscalate: true,
        extractedInfo: {
          isCompleted: false,
        }
      };
    }
  }

  static async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.wav', { type: 'audio/wav' }),
        model: 'whisper-1',
        language: 'hi', // Hindi with English fallback
      });

      return transcription.text;
    } catch (error) {
      console.error('Audio transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  static async generateSpeech(text: string): Promise<Buffer> {
    try {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
        response_format: 'wav',
      });

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      console.error('Speech generation error:', error);
      throw new Error('Failed to generate speech');
    }
  }
}
