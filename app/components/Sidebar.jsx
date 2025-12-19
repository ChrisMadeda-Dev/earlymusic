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
    <aside className="hidden md:flex flex-col bg-[#fcfcfc] h-full w-[260px] lg:w-[280px] p-4 gap-y-3 sticky top-0">
      {/* Top Navigation Block */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
        <nav className="flex flex-col gap-y-5">
          {routes.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-x-4 transition-all cursor-pointer group
                ${
                  item.active
                    ? "text-red-600"
                    : "text-neutral-500 hover:text-neutral-900"
                }
              `}
            >
              <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
              <span className="text-[14px] font-semibold tracking-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Library & Liked Songs Block */}
      <div className="bg-white rounded-2xl p-5 flex-1 shadow-sm border border-neutral-100 overflow-hidden flex flex-col">
        <Link
          href="/library"
          className={`
            flex items-center gap-x-4 mb-6 transition-all cursor-pointer group
            ${
              pathname === "/library"
                ? "text-red-600"
                : "text-neutral-500 hover:text-neutral-900"
            }
          `}
        >
          <Library size={20} strokeWidth={pathname === "/library" ? 2.5 : 2} />
          <span className="text-[14px] font-semibold tracking-tight">
            Your Library
          </span>
        </Link>

        {/* Simple Section Label */}
        <p className="text-[11px] font-medium text-neutral-400 mb-4 px-1">
          Pinned Collection
        </p>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <LikedSongs />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
