import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
	const auth = Buffer.from(
		`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
	).toString("base64");
	const jiraUrl = `https://${process.env.JIRA_DOMAIN}/rest/api/3/issue`;

	// Constructing the issueData payload for the Jira task, with ADF format for the description
	const issueData = {
		fields: {
			project: {
				key: process.env.JIRA_PROJECT_KEY, // Ensure this is correct
			},
			summary: "New Task from Next.js", // Task title
			description: {
				type: "doc",
				version: 1,
				content: [
					{
						type: "paragraph",
						content: [
							{
								text: "This task was created via the Jira API using Next.js.",
								type: "text",
							},
						],
					},
				],
			},
			issuetype: {
				name: "Task", // Ensure this is a valid issue type for your Jira project
			},
		},
	};

	try {
		const response = await axios.post(jiraUrl, issueData, {
			headers: {
				Authorization: `Basic ${auth}`,
				"Content-Type": "application/json",
			},
		});

		console.log("Task created successfully:", response.data);
		return NextResponse.json({
			message: "Task created successfully",
			data: response.data,
		});
	} catch (error: any) {
		console.error(
			"Error creating Jira task:",
			error.response?.data || error.message
		);
		return NextResponse.json(
			{
				error: "Failed to create task",
				details: error.response?.data || error.message,
			},
			{ status: 500 }
		);
	}
}
