"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_LINKS } from "@/constants/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useEarlyAccess } from "@/context/EarlyAccessContext";

const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className="h-6 w-6"
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className="h-6 w-6"
  >
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

export const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { openEarlyAccess } = useEarlyAccess();

  const isHiddenPage =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/login/") && pathname !== "/login");
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setIsOpen(false);
  }
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (isHiddenPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Sisi Kiri: Logo (Vertikal Tengah) */}
        <div className="flex items-center flex-1 justify-start">
          <Link href="/" className="inline-flex items-center flex-shrink-0" aria-label="Toentoen home">
            <Logo variant="light" showText={false} size={42} />
          </Link>
        </div>

        {/* Sisi Tengah: Desktop nav (Vertikal Tengah) */}
        <nav className="hidden md:flex items-center justify-center flex-shrink-0">
          <ul className="flex items-center gap-6 lg:gap-9 m-0 p-0">
            {HEADER_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label} className="inline-flex items-center">
                  <Link
                    href={link.href}
                    className={`inline-flex items-center py-2 text-sm transition-colors hover:text-[#00c2a8] focus:outline-none ${
                      isActive
                        ? "font-bold text-[#00c2a8]"
                        : "font-medium text-gray-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sisi Kanan: Desktop CTA (Vertikal Tengah) */}
        <div className="hidden md:flex items-center justify-end flex-1">
          <button
            type="button"
            onClick={() => openEarlyAccess("user")}
            className="inline-flex items-center justify-center rounded-full bg-[#00c2a8] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#00a892] lg:px-6 shadow-sm cursor-pointer leading-none"
          >
            Daftar Akses Awal
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Buka menu navigasi"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          id="mobile-nav"
          className={`absolute right-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
            <Logo variant="light" showText={false} size={36} />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
              aria-label="Tutup menu navigasi"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-1">
              {HEADER_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-lg px-3 py-3 text-base transition-colors ${
                        isActive
                          ? "bg-[#00c2a8]/10 font-bold text-[#00c2a8]"
                          : "font-medium text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-100 p-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openEarlyAccess("user");
              }}
              className="block w-full py-3 text-center text-sm font-bold rounded-full bg-[#00c2a8] text-white transition hover:bg-[#00a892] cursor-pointer"
            >
              Daftar Akses Awal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
