// app/root-layout.tsx
import type { Metadata } from "next";

// Components

// Styles
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Your Name",
    default: "Your Name - Portfolio",
  },
  description: "Personal portfolio showcasing my projects and experience",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    images: "/og-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
