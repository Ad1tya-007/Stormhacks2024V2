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
      throw new Error(`Failed to fetch build log for run ID ${runId}: ${error.message}`);
    }
  }
  
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
async function getAllRepositories(org: string) {
    try {
      const response = await octokit.rest.repos.listForOrg({
        org,
        type: 'all', // You can adjust this based on the type of repos you want
        per_page: 100,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  }
  
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
  async function getOpenAIResponse(logContent: string) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Analyze this build log and identify the cause of failure.' },
          { role: 'user', content: logContent },
        ],
      });
  
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating OpenAI response:', error);
      throw new Error('Failed to generate OpenAI response.');
    }
  }
  
  export async function POST(request: Request) {
    const body = await request.json(); // Read the JSON body
    console.log('Fetching builds for organization:', body);
    const org = body.org;
  
    console.log('Fetching builds for organization:', org);
    try {
      const allBuilds: any[] = []; // Array to hold all builds
  
      const repositories = await getAllRepositories(org);
  
      for (const repo of repositories) {
        const workflowRuns = await getAllWorkflowRuns(repo.owner.login, repo.name);
  
        // Limit to the latest 2 builds with identifiers
        const builds = workflowRuns.map((run, index) => {
          const timeTaken = new Date(run.updated_at).getTime() - new Date(run.created_at).getTime(); // Time in ms
          return {
            "parent-org": org,
            "repo": repo.name,
            "build-status": run.conclusion,
            "time-taken-ms": timeTaken,
            "last-commit-message": run.head_commit?.message,
            "run_id": run.id, // Run ID for fetching logs
            "identifier": index + 1 // 1 for latest, 2 for second latest
          };
          if (build["build-status"] === 'failure' && build["identifier"] === 1) {
            // Fetch logs and generate OpenAI response
            const logZip = await getBuildLogDirectly(repo.owner.login, repo.name, run.id);
            const logContent = await extractDynamicBuildLog(logZip);
            const openaiResponse = await getOpenAIResponse(logContent);
  
            // Add log and OpenAI response to the build object
            build['log'] = logContent;
            build['openairesponse'] = openaiResponse;
          }
  
          allBuilds.push(build);
        });
  
        allBuilds.push(...builds); // Combine all builds into a single array
      }
  
      if (allBuilds.length === 0) {
        throw new Error('No builds found for any repositories in this organization');
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