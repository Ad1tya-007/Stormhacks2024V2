import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';

// Load environment variables (Next.js automatically does this)
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function POST(request: Request) {
  const body = await request.json();
  const message = body.message;
  const channel = process.env.SLACK_CHANNEL as string;

  try {
    // Send message to Slack channel
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
