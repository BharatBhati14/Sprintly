import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ToastProvider } from "@/components/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-sprintly.vercel.app"),

  title: {
    default: "Sprintly",
    template: "%s | Sprintly",
  },
  description:
    "Sprintly is a multi-tenant project management system for managing projects, teams, tasks, and workflows.",

  applicationName: "Sprintly",

  openGraph: {
    type: "website",
    siteName: "Sprintly",
    title: "Sprintly",
    description:
      "A multi-tenant project management system for managing projects, teams, tasks, and workflows.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Sprintly - Multi-tenant Project Management System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sprintly",
    description:
      "A multi-tenant project management system for managing projects, teams, tasks, and workflows.",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
