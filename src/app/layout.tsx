import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const peyda = localFont({
  src: [
    {
      path: "../../public/fonts/peyda/peyda-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/peyda/Peyda-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/peyda/Peyda-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/peyda/Peyda-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/peyda/Peyda-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-peyda",
});

export const metadata: Metadata = {
  title: "Proposal MVP",
  description: "Interactive proposal experience for ROSS Creative Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${peyda.variable} antialiased`}>{children}</body>
    </html>
  );
}
