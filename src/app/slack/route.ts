import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';

export async function POST(request: Request) {
  const body = await request.json();
  const message = body.message;
  const channel = body.channel;
  const slack_bot_token = body.slack_bot_token;

  try {
    // Send message to Slack channel
    // Load environment variables (Next.js automatically does this)
    const slackClient = new WebClient(slack_bot_token);
    const result = await slackClient.chat.postMessage({
      channel: channel,
      text: message,
    });
    return NextResponse.json({ status: 'Message sent', timestamp: result.ts });
  } catch (error) {
    console.error('Error sending message to Slack: ', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
