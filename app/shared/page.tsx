import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import SharingPage from '@/components/shared/page';

export default function Page() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <SharingPage />
    </DashboardLayout>
  );
}
