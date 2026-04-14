import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import SharingPage from '@/components/shared/page';

export default function Page() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <SharingPage />
      </DashboardLayout>
    </>
  );
}
