import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wepesi | African fintech compliance command center",
  description: "Investor-ready MVP for AI-assisted African fintech licensing, market entry, and compliance planning."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
