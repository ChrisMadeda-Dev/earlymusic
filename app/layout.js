import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlayerWrapper from "./components/PlayerWrapper";
import { PlayerProvider } from "./context/PlayerContext";

export const metadata = {
  title: "earlymusic",
  description: "Pure Scarlet Sound",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        <PlayerProvider>
          {/* The 90vh Shell */}
          <div className="flex flex-col md:flex-row min-h-[90vh] h-screen overflow-hidden">
            <Sidebar />

            <main className="flex-1 bg-neutral-50 md:rounded-2xl md:m-2 md:border border-neutral-200 overflow-y-auto relative flex flex-col">
              <Header />
              <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {children}
              </div>

              {/* PlayerWrapper handles the portal logic globally */}
              <PlayerWrapper />
            </main>
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
