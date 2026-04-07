import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import PricingPageContent from '@/components/pricing/page';

export default function PricingPage() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <PricingPageContent />
    </DashboardLayout>
  );
}
