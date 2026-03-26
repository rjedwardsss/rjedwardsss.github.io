import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RJ Edwards | Data Science & Software Engineering Portfolio",
  description:
    "RJ Edwards — Data Science and Computer Science student at UW-Madison. Portfolio, projects, experience, and contact.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "RJ Edwards | Portfolio",
    description:
      "Data Science • Computer Science • Leadership. Projects, experience, and contact.",
    type: "website",
  },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%2300d1b2'/%3E%3Ctext x='32' y='41' font-size='28' text-anchor='middle' fill='white' font-family='Segoe UI, Roboto, Arial, sans-serif'%3ER%3C/text%3E%3C/svg%3E",
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
