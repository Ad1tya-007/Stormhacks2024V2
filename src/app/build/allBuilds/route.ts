/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import OpenAI from 'openai';

const octokit = new Octokit({
  auth: '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',
});

const openai = new OpenAI({
  apiKey:
    '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',
});

const url = "https://github.com/SFU-Surge-Projects-Team-Yellow/backend"; // Static URL

async function getBuildLogDirectly(owner: string, repo: string, runId: number) {
  try {
    // Directly use octokit to get the logs
    const logResponse = await octokit.rest.actions.downloadWorkflowRunLogs({
      owner,
      repo,
      run_id: runId,
    });

    return logResponse.data; 
  } catch (error) {
    console.error('Error fetching build log directly:', error);
    throw new Error('Failed to fetch build log');
  }
}


async function extractDynamicBuildLog(arrayBuffer: ArrayBuffer) {
  try {
    const zip = new JSZip();
    const unzipped = await zip.loadAsync(arrayBuffer);

    const logFile = unzipped.file(/.*Build\.txt$/)[0];
    if (!logFile) {
      throw new Error('No build log file found.');
    }
    const logContent = await logFile.async('text');
    return logContent;
  } catch (error) {
    console.error('Error extracting logs:', error);
    throw new Error('Failed to extract logs');
  }
}


async function getAllWorkflowRuns(owner: string, repo: string) {
  try {
    const response = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 100, 
      // status: 'completed', // Only fetch completed runs
    });

    if (response.data.workflow_runs.length === 0) {
      throw new Error('No workflow runs found for this repository');
    }

    return response.data.workflow_runs;
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    throw new Error('Failed to fetch workflow runs');
  }
}

export async function GET() {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 });
  }

  const owner = match[1];
  const repo = match[2];

  try {
    let OpenAIResponse = "No response from OpenAI";
    const workflowRuns = await getAllWorkflowRuns(owner, repo);

    const builds = workflowRuns.map((run) => {
      const timeTaken = new Date(run.updated_at).getTime() - new Date(run.created_at).getTime(); // Time in ms
      return {
        "parent-org": owner,
        "build-status": run.conclusion, 
        "time-taken-ms": timeTaken,
        "last-commit-message": run.head_commit?.message, 
        "run_id": run.id, // Run ID for fetching logs
        "repo": repo,
      };
    });

    if (builds.length === 0) {
      throw new Error('No builds found for this repository');
    }
    else if (builds.length > 0) {
      const latestBuild = builds[0];
      if (latestBuild["build-status"] === "failure") {
        console.log("The latest build was a failure.");
        const data1 = await getBuildLogDirectly(owner, repo, latestBuild["run_id"]); 
        const logContent = await extractDynamicBuildLog(data1 as ArrayBuffer);

        const prompt = logContent;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `${prompt} Explain whats wrong with the build`,
                },
            ],
        });
        OpenAIResponse = response.choices[0].message.content ?? '';
      }
    }

    return NextResponse.json({builds, OpenAIResponse}, { status: 200 });
} catch (error: any) {
    console.error('Error fetching workflow runs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
}
}
