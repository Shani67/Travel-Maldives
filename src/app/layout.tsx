import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Maldives",
  description: "Plan a trip to the Maldives: islands, atolls and dive sites.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
