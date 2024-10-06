/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

const octokit = new Octokit({
  auth: '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',
});

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
      per_page: 100,
    });

    return response.data.workflow_runs;
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    throw new Error('Failed to fetch workflow runs');
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
      const workflowRuns = await getAllWorkflowRuns(
        repo.owner.login,
        repo.name
      );

      const builds = workflowRuns.map((run: any) => {
        const timeTaken =
          new Date(run.updated_at).getTime() -
          new Date(run.created_at).getTime(); // Time in ms
        return {
          'parent-org': org,
          repo: repo.name,
          'build-status': run.conclusion,
          'time-taken-ms': timeTaken,
          'last-commit-message': run.head_commit?.message,
          run_id: run.id, // Run ID for fetching logs
        };
      });

      allBuilds.push(...builds); // Combine all builds into a single array
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
// }
// }
