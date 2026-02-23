import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteConfig();
  return {
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      description: site.description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
