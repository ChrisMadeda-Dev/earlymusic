"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";
import LikedSongs from "./LikedSongs";

const Sidebar = () => {
  const pathname = usePathname();

  const routes = [
    {
      icon: Home,
      label: "Home",
      active: pathname === "/",
      href: "/",
    },
    {
      icon: Search,
      label: "Search",
      active: pathname === "/search",
      href: "/search",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col bg-[#f9f9f9] h-full w-[260px] lg:w-[300px] p-4 gap-y-4 sticky top-0">
      {/* Top Navigation Block */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100/50">
        <nav className="flex flex-col gap-y-6">
          {routes.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-x-4 text-sm font-bold transition cursor-pointer hover:text-red-600
                ${item.active ? "text-red-600" : "text-neutral-500"}
              `}
            >
              <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Library & Liked Songs Block */}
      <div className="bg-white rounded-xl p-6 flex-1 shadow-sm border border-neutral-100/50 overflow-hidden flex flex-col">
        <Link
          href="/library"
          className={`
            flex items-center gap-x-4 text-sm font-bold mb-8 transition cursor-pointer hover:text-red-600
            ${pathname === "/library" ? "text-red-600" : "text-neutral-400"}
          `}
        >
          <Library size={20} strokeWidth={pathname === "/library" ? 2.5 : 2} />
          <span className="uppercase tracking-[0.2em] text-[11px]">
            Library
          </span>
        </Link>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <LikedSongs />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
