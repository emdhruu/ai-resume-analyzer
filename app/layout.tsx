import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Ai Resume Analyzer",
  description: "Generate your resume with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-white relative">
         {children}
      </body>
    </html>
  );
}
