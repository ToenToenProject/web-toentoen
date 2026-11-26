"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { EarlyAccessProvider } from "@/context/EarlyAccessContext";
import { EarlyAccessModal } from "@/components/common/EarlyAccessModal";

const INTERNAL_PREFIXES = ["/admin", "/sales", "/cmo", "/social-media"];

export const LayoutChrome = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  // Suppress marketing chrome on internal operational dashboards and customer-service
  const isInternalAdmin = INTERNAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
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
