import AnalyticsContent from '@/components/shared/AnalyticsContent';
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Insights() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={data.user} />

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h2>
        <AnalyticsContent />
      </div>
    </div>
  );
}
