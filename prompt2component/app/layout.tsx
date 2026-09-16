import type { Metadata } from "next";
import "./globals.css"; // Imports your Tailwind CSS configuration

export const metadata: Metadata = {
  title: "Prompt2Component",
  description: "Generate UI components from text prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}