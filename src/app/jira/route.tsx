/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const body = await request.json();
  const title = body.title;
  const description = body.description;
  const jiraEmail = body.jiraEmail;
  const jiraApiToken = body.jiraApiToken;
  const jiraProjectKey = body.jiraProjectKey;
  const jiraDomain = body.jiraDomain;
  const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64');
  const jiraUrl = `https://${jiraDomain}/rest/api/3/issue`;

  // Constructing the issueData payload for the Jira task, with ADF format for the description
  const issueData = {
    fields: {
      project: {
        key: jiraProjectKey, // Ensure this is correct
      },
      summary: `Fix Build Issues of ${title}`, // Task title
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                text: `${description}`,
                type: 'text',
              },
            ],
          },
        ],
      },
      issuetype: {
        name: 'Task', // Ensure this is a valid issue type for your Jira project
      },
    },
  };

  try {
    const response = await axios.post(jiraUrl, issueData, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Task created successfully:', response.data);
    return NextResponse.json({
      message: 'Task created successfully',
      data: response.data,
    });
  } catch (error: any) {
    console.error(
      'Error creating Jira task:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: 'Failed to create task',
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
