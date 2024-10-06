/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import JSZip from 'jszip';

const octokit = new Octokit({
  auth: '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',
});

const openai = new OpenAI({
  apiKey:
    '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',
});

// Function to fetch the build logs
async function getBuildLogDirectly(owner: string, repo: string, runId: number) {
  try {
    // Get logs for the workflow run
    const logResponse = await octokit.rest.actions.downloadWorkflowRunLogs({
      owner,
      repo,
      run_id: runId,
    });

    return logResponse.data;
  } catch (error: any) {
    console.error('Error fetching build log directly:', error);
    throw new Error(
      `Failed to fetch build log for run ID ${runId}: ${error.message}`
    );
  }
}

// Function to extract logs from a zipped file
async function extractDynamicBuildLog(arrayBuffer: ArrayBuffer) {
  try {
    const zip = new JSZip();
    const unzipped = await zip.loadAsync(arrayBuffer);
    const logFile = unzipped.file(/.*Build\.txt$/)[0];

    if (!logFile) {
      throw new Error('No build log file found in the zip archive.');
    }

    const logContent = await logFile.async('text');
    return logContent;
  } catch (error: any) {
    console.error('Error extracting logs:', error);
    throw new Error(`Failed to extract logs: ${error.message}`);
  }
}

// Function to call OpenAI with the log content
async function getOpenAIResponse(logContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Analyze this build log and identify the cause of failure.',
        },
        { role: 'user', content: logContent },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    throw new Error('Failed to generate OpenAI response.');
  }
}

// Function to get all repositories for a given org
async function getAllRepositories(org: string) {
  try {
    const response = await octokit.rest.repos.listForOrg({
      org,
      type: 'all',
      per_page: 100,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories');
  }
}

// Function to get workflow runs for a repo
async function getAllWorkflowRuns(owner: string, repo: string) {
  try {
    const response = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 2, // Fetch only the latest two workflow runs
    });

    return response.data.workflow_runs;
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    throw new Error('Failed to fetch workflow runs');
  }
}

// Main POST handler
export async function POST(request: Request) {
  const body = await request.json();
  const org = body.org;

  try {
    const allBuilds: any[] = []; // Array to hold all builds
    const repositories = await getAllRepositories(org);

    for (const repo of repositories) {
      const workflowRuns = await getAllWorkflowRuns(
        repo.owner.login,
        repo.name
      );

      // Map through the workflow runs
      for (const [index, run] of workflowRuns.entries()) {
        const timeTaken =
          new Date(run.updated_at).getTime() -
          new Date(run.created_at).getTime(); // Time in ms
        const build = {
          parent_org: org,
          repo: repo.name,
          build_status: run.conclusion,
          time_taken_ms: timeTaken,
          last_commit_message: run.head_commit?.message,
          run_id: run.id, // Run ID for fetching logs
          identifier: index + 1, // 1 for latest, 2 for second latest
          log: 'place', // Placeholder for log content
          openairesponse: 'place', // Placeholder for OpenAI response
        };

        // Check if build has failed and it's the latest
        if (build['build_status'] === 'failure' && build['identifier'] === 1) {
          // Fetch logs and generate OpenAI response
          const logZip = await getBuildLogDirectly(
            repo.owner.login,
            repo.name,
            run.id
          );
          const logContent = await extractDynamicBuildLog(
            logZip as ArrayBuffer
          ); // Explicitly typecast logZip to ArrayBuffer
          const openaiResponse = await getOpenAIResponse(logContent);

          // Add log and OpenAI response to the build object
          build['log'] = logContent;
          build['openairesponse'] =
            openaiResponse !== null ? openaiResponse : ''; // Check if openaiResponse is null and provide a default value
        }

        allBuilds.push(build); // Push the build object to the result array
      }
    }

    if (allBuilds.length === 0) {
      throw new Error(
        'No builds found for any repositories in this organization'
      );
    }

    return NextResponse.json(allBuilds, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching builds:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// if (latestBuild["build-status"] === "failure") {
//   console.log("The latest build was a failure.");
//   const data1 = await getBuildLogDirectly(owner, repo, latestBuild["run_id"]);
//   const logContent = await extractDynamicBuildLog(data1 as ArrayBuffer);

//   const prompt = logContent;

//   const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//           {
//               role: 'user',
//               content: `${prompt} Explain whats wrong with the build`,
//           },
//       ],
//   });
//   OpenAIResponse = response.choices[0].message.content ?? '';
