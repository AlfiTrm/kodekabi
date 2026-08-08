import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { PUBLIC_ENTRANCE_STORAGE_KEY } from "@/src/features/public-site/_shared/constants/entrance";
import "../shared/styles/globals.css";

const entranceBootstrap = `try{document.documentElement.dataset.kodekabiEntrance=localStorage.getItem('${PUBLIC_ENTRANCE_STORAGE_KEY}')==='true'?'seen':'new'}catch{document.documentElement.dataset.kodekabiEntrance='new'}`;

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
      suppressHydrationWarning
      className={`${clashDisplay.variable} ${jetMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="kodekabi-entrance-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: entranceBootstrap }}
        />
        {children}
      </body>
    </html>
  );
}
