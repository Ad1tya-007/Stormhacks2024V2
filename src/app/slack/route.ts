import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";

// Load environment variables (Next.js automatically does this)
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const message = searchParams.get("message") || "```HAIII```";
	const channel = process.env.SLACK_CHANNEL as string;

	try {
		// Send message to Slack channel
		const result = await slackClient.chat.postMessage({
			channel: channel,
			text: message,
		});

		console.log("Message sent: ", result.ts);
		return NextResponse.json({ status: "Message sent", timestamp: result.ts });
	} catch (error) {
		console.error("Error sending message to Slack: ", error);
		return NextResponse.json(
			{ error: "Failed to send message" },
			{ status: 500 }
		);
	}
}
