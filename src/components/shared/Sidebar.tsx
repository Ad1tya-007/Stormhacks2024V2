'use client';

import { logout } from '@/utils/supabase/actions';

export default function Sidebar() {
  const onLogoutClick = async () => {
    try {
      await logout()
        .then(() => {
          console.log('Successfully logged out');
        })
        .catch((error) => {
          console.error('Error logging out', error);
        });
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">DevOps Monitor</h1>
      </div>
      <nav className="mt-4 ">
        <a
          href="/dashboard"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-300">
          Dashboard
        </a>
        <a
          href="/overview"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Pipeline Overview
        </a>
        <a
          href="/insights"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Insights
        </a>
        <a
          href="/logs"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Logs
        </a>
        <div
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200 cursor-pointer"
          onClick={onLogoutClick}>
          Logout
        </div>
      </nav>
    </div>
  );
}
