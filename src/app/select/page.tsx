/* eslint-disable @typescript-eslint/no-explicit-any */
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SelectTable from '@/components/shared/SelectTable';

export default async function SelectPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  // Retrieve the session (which contains the access token)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let finalData;

  if (!session) {
    // Redirect to authentication if the session is not available
    redirect('/auth');
  } else {
    const accessToken = session.provider_token; // This is the GitHub access token

    // Fetch user organizations
    const githubOrganizationsResponse = await fetch(
      'https://api.github.com/user/orgs',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const organizations = await githubOrganizationsResponse.json();

    // Combine both repositories and organizations into a single array
    finalData = [
      // Map organizations to the required format
      ...organizations.map((org: any) => ({
        id: org.id, // The organization ID
        owner: org.login, // The organization username
        type: 'Organization', // The type of entity (Organization)
        link: org.url, // The organization's link
        repos: org.repos_url, // The organization's repo link
      })),
    ];
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={data?.user} />

      <SelectTable data={finalData ?? []} />
    </div>
  );
}
