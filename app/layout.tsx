import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ToastProvider } from "@/components/ToastProvider";
import { VehicleProvider } from "@/context/VehicleContext";

export const metadata: Metadata = {
  title: "NuBrakes Fleet Portal",
  description: "Manage your fleet and request services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <VehicleProvider>
            <Navigation />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </VehicleProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
