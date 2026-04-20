import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ModalProvider } from "@/components/ModalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteMeet | Premium Meeting Assistant",
  description: "Capture, Transcribe, and Organize your meetings with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} flex h-full bg-[#09090b] text-foreground antialiased overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto relative">
           {/* Gray/Glassy Overlay for modern feel */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] -z-10 rounded-full" />
           
           <div className="p-8 max-w-6xl mx-auto min-h-full">
            {children}
           </div>
           <ModalProvider />
        </main>
      </body>
    </html>
  );
}
