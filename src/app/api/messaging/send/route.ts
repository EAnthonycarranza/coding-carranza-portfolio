import { NextRequest, NextResponse } from 'next/server';
import { twilioClient, TWILIO_PHONE_NUMBER } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { to, message, useWhatsApp = false, contentSid, contentVariables, mediaUrl, persistentAction } = await request.json();

    if (!to || (!message && !contentSid && !mediaUrl && !persistentAction)) {
      return NextResponse.json(
        { error: 'Missing recipient, message content, media, or template SID' },
        { status: 400 }
      );
    }

    // If no real credentials, or if it's an SMS message (Twilio doesn't have an SMS sandbox), simulate a successful send for the demo
    if (!twilioClient || !useWhatsApp) {
      console.log('--- MOCK TWILIO SEND ---');
      const mockSid = (contentSid ? 'MM' : (mediaUrl ? 'MM' : 'SM')) + Math.random().toString(36).substring(2, 15);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockPayload: any = {
        account_sid: '******',
        direction: 'outbound-api',
        from: '******',
        to: '******',
      };

      if (message) mockPayload.body = message;
      if (mediaUrl) mockPayload.media_url = [mediaUrl];
      if (persistentAction) mockPayload.persistent_action = persistentAction;
      if (contentSid) mockPayload.content_sid = contentSid;

      return NextResponse.json({
        success: true,
        sid: mockSid,
        status: 'queued',
        mock: true,
        details: mockPayload
      });
    }

    const from = useWhatsApp ? `whatsapp:${TWILIO_PHONE_NUMBER}` : TWILIO_PHONE_NUMBER;
    const toFormatted = useWhatsApp ? `whatsapp:${to}` : to;

    const messageOptions: any = {
      from: from,
      to: toFormatted,
    };

    if (contentSid) {
      messageOptions.contentSid = contentSid;
      if (contentVariables) {
        messageOptions.contentVariables = typeof contentVariables === 'string' 
          ? contentVariables 
          : JSON.stringify(contentVariables);
      }
    } else {
      if (message) messageOptions.body = message;
      if (mediaUrl) messageOptions.mediaUrl = [mediaUrl];
      if (persistentAction) messageOptions.persistentAction = persistentAction;
    }

    const response = await twilioClient.messages.create(messageOptions);

    const safeDetails = JSON.parse(JSON.stringify(response));
    safeDetails.account_sid = '******';
    safeDetails.accountSid = '******';
    safeDetails.from = '******';
    safeDetails.to = '******';

    return NextResponse.json({
      success: true,
      sid: response.sid,
      status: response.status,
      details: safeDetails // Return masked object for the "Live Console" demo
    });
  } catch (error: any) {
    console.error('Twilio API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
