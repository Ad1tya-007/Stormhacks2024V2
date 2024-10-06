/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { logout } from '@/utils/supabase/actions';
import Image from 'next/image';

export default function Sidebar({ user }: { user: any }) {
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
      <h1 className="text-2xl font-bold text-gray-800 p-4">CI/CDfy</h1>

      <div className="p-4 flex flex-rows items-center space-x-2">
        <Image
          src={user?.user_metadata?.avatar_url}
          height={40}
          width={40}
          className="rounded-full"
          alt="avatar"
        />
        <h1 className="text-xl font-bold text-gray-800">
          {user?.user_metadata?.user_name}
        </h1>
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
        <a
          href="/select"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Select
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
