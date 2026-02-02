"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Base path for GitHub Pages - should match next.config.ts
const BASE_PATH = process.env.NODE_ENV === "production" ? "/nubrakes-fleet-portal" : "";

export function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/service-request", label: "Request Service", isPrimary: true },
    { href: "/vehicles", label: "Vehicle Roster", isPrimary: false },
    { href: "/approvals", label: "Approvals", isPrimary: false },
  ];

  return (
    <nav className="bg-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={`${BASE_PATH}/logo.png`}
              alt="NuBrakes"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
              Fleet Portal
            </span>
          </Link>
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              if (link.isPrimary) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#34BB4B] text-white hover:bg-[#2da83f]"
                        : "bg-[#34BB4B] text-white hover:bg-[#2da83f]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border-2 ${
                    isActive
                      ? "bg-white text-navy border-white"
                      : "bg-transparent text-white border-white/30 hover:border-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd5dHn9ikstknvV5Gb14DIZgzL8qoC5hlGDH-ttTiIO9QF47w/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm font-semibold transition-colors bg-transparent text-white border-2 border-white/30 hover:border-white hover:bg-white/10"
            >
              Suggest Improvement
            </a>
            <a
              href="tel:+18555513227"
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors bg-transparent text-white border-2 border-white/30 hover:border-white hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>(855) 551-3227</span>
            </a>
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-600">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium">J</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">City of Houston</span>
                <span className="text-xs text-gray-400">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

