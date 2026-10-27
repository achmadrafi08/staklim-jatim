"use client";

import { PpidHeader } from "@/components/layout/ppid-header";
import { Footer } from "@/components/layout/footer";

export default function PelayananPublikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      <PpidHeader />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}