import KeyContent from '@/components/shared/KeyContent';
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function page() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={data.user} />
      <KeyContent />
    </div>
  );
}
