import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import PricingPageContent from '@/components/pricing/page';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        <PricingPageContent />
      </DashboardLayout>
    </>
  );
}
