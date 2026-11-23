"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { EarlyAccessProvider } from "@/context/EarlyAccessContext";
import { EarlyAccessModal } from "@/components/common/EarlyAccessModal";

export const LayoutChrome = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  // /login menampilkan Header website resmi
  // Sub-rute internal admin (/login/admin, /login/sales, dll) dan /customer-service tetap menyembunyikan chrome
  const isInternalAdmin = pathname.startsWith("/login/") && pathname !== "/login";
  const hideChrome = pathname.startsWith("/customer-service") || isInternalAdmin;

  return (
    <AuthProvider>
      <EarlyAccessProvider>
        {hideChrome ? (
          <main className="min-h-screen bg-white">{children}</main>
        ) : (
          <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1 flex flex-col bg-white">{children}</main>
            <Footer />
            <EarlyAccessModal />
          </div>
        )}
      </EarlyAccessProvider>
    </AuthProvider>
  );
};
