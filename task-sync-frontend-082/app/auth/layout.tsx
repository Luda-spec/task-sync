import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}

      <Toaster richColors position="top-center" />
    </div>
  );
}