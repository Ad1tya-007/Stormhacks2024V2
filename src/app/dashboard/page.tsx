import DashboardContent from '@/components/shared/DashboardContent';
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={data.user} />

      <DashboardContent />
    </div>
  );
}
