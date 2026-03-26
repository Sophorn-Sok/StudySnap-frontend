'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <p className="text-gray-600">Configure your account preferences here.</p>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
