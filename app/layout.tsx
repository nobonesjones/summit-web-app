import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summit - AI-Powered Business Planning Tools",
  description:
    "Generate comprehensive business plans, growth strategies, and more in minutes with Summit's AI-powered mini-apps.",
  metadataBase: new URL("https://summit.ai"),
  openGraph: {
    title: "Summit - AI-Powered Business Planning Tools",
    description:
      "Generate comprehensive business plans, growth strategies, and more in minutes with Summit's AI-powered mini-apps.",
    url: "https://summit.ai",
    siteName: "Summit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Summit - AI-Powered Business Planning Tools",
    description:
      "Generate comprehensive business plans, growth strategies, and more in minutes with Summit's AI-powered mini-apps.",
    card: "summary_large_image",
    creator: "@summit",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster position="top-center" />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
