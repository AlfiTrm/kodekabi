import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "../shared/styles/globals.css";

const clashDisplay = localFont({
  src: [
    { path: "../../public/font/ClashDisplay-Regular.otf", weight: "400" },
    { path: "../../public/font/ClashDisplay-Medium.otf", weight: "500" },
    { path: "../../public/font/ClashDisplay-Semibold.otf", weight: "600" },
    { path: "../../public/font/ClashDisplay-Bold.otf", weight: "700" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

const jetMono = JetBrains_Mono({
  variable: "--font-jet-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KODEKABI - Jejak Algoritma",
  description: "Bongkar, selidiki, dan jaga Kota Nusa tetap waras.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${jetMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
