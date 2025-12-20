import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlayerWrapper from "./components/PlayerWrapper";
import { PlayerProvider } from "./context/PlayerContext";
import { Analytics } from "@vercel/analytics/react"; // Added Vercel Analytics
import InstallPrompt from "./components/InstallPrompt"; // Added PWA Install Prompt

export const metadata = {
  title: "Early Music",
  description: "Music Streaming App",
  manifest: "/manifest.json",
  themeColor: "#dc2626",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Early Music",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <PlayerProvider>
          {/* Main App Shell */}
          {/* Maintained min-h-[90vh] per your instructions */}
          <div className="flex flex-col md:flex-row min-h-[90vh] h-screen overflow-hidden">
            <Sidebar />

            <main className="flex-1 bg-neutral-50 md:rounded-2xl md:m-2 md:border border-neutral-200 overflow-y-auto relative flex flex-col">
              <Header />
              <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {children}
              </div>
            </main>
          </div>

          {/* THE FIX: Player stays mounted across navigation */}
          <PlayerWrapper />

          {/* VERCEL ANALYTICS: Tracks users across the site */}
          <Analytics />

          {/* PWA INSTALL PROMPT: Shows the pop-up to add to home screen */}
          <InstallPrompt />
        </PlayerProvider>
      </body>
    </html>
  );
}
