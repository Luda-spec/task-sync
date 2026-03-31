import { DesktopNavigation } from '@/components/shared/DesktopNavigation';
import { BottomNavigation } from '@/components/shared/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DesktopNavigation />
      {children}
      <BottomNavigation />
      <Toaster richColors position="top-center" />
    </div>
  );
}