import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
  console.warn('Twilio credentials not found. Voice functionality will be limited.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export interface TwilioCallParams {
  to: string;
  callbackUrl: string;
}

export class TwilioService {
  static async initiateCall(params: TwilioCallParams) {
    if (!client || !phoneNumber) {
      throw new Error('Twilio not configured');
    }

    try {
      const call = await client.calls.create({
        to: params.to,
        from: phoneNumber,
        url: params.callbackUrl,
        method: 'POST',
      });

      return {
        callSid: call.sid,
        status: call.status,
      };
    } catch (error) {
      throw new Error(`Failed to initiate call: ${error}`);
    }
  }

  static async endCall(callSid: string) {
    if (!client) {
      throw new Error('Twilio not configured');
    }

    try {
      const call = await client.calls(callSid).update({
        status: 'completed',
      });

      return {
        callSid: call.sid,
        status: call.status,
      };
    } catch (error) {
      throw new Error(`Failed to end call: ${error}`);
    }
  }

  static generateTwiML(message: string, continueUrl?: string) {
    const twiml = new twilio.twiml.VoiceResponse();
    
    twiml.say({
      voice: 'Polly.Aditi', // Hindi-English supporting voice
      language: 'hi-IN',
    }, message);

    if (continueUrl) {
      twiml.gather({
        input: ['speech'],
        speechTimeout: '5',
        action: continueUrl,
        method: 'POST',
      });
    }

    return twiml.toString();
  }

  static async getCallDetails(callSid: string) {
    if (!client) {
      throw new Error('Twilio not configured');
    }

    try {
      const call = await client.calls(callSid).fetch();
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime,
        endTime: call.endTime,
      };
    } catch (error) {
      throw new Error(`Failed to get call details: ${error}`);
    }
  }
}
