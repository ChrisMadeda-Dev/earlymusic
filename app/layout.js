import "./globals.css";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";

export const metadata = {
  title: "earlymusic",
  description: "Pure Scarlet Sound",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        {/* The 90vh Shell */}
        <div className="flex flex-col md:flex-row min-h-[90vh] h-screen overflow-hidden">
          {/* Desktop & Tablet Sidebar */}
          <Sidebar />

          {/* Main Content - Subtle contrast background */}
          <main className="flex-1 bg-neutral-50 md:rounded-2xl md:m-2 md:border border-neutral-200 overflow-y-auto pb-24 md:pb-2">
            {children}
          </main>

          {/* Mobile Bottom Bar */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
