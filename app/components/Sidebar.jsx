"use client";

import Link from "next/link";
import { Home, Search, Library, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const routes = [
    { icon: Home, label: "Home", href: "/", active: pathname === "/" },
    {
      icon: Search,
      label: "Search",
      href: "/search",
      active: pathname === "/search",
    },
  ];

  return (
    <div className="hidden md:flex flex-col gap-y-2 h-full w-[260px] bg-neutral-50 p-3 border-r border-neutral-100">
      <div className="bg-white rounded-2xl flex flex-col gap-y-4 px-5 py-6 shadow-sm">
        {routes.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center w-full gap-x-4 text-sm font-bold cursor-pointer hover:text-red-600 transition-all ${
              item.active ? "text-red-600" : "text-neutral-500"
            }`}
          >
            <item.icon size={22} />
            <p className="truncate w-full">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl flex-1 px-5 py-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-x-2 text-neutral-400 mb-4">
          <Library size={20} />
          <p className="font-bold text-xs uppercase tracking-widest">Library</p>
        </div>

        {/* This is the hidden Admin link at the bottom */}
        <div className="mt-auto pt-4 border-t border-neutral-50">
          <Link
            href="/admin"
            className="flex items-center gap-x-3 text-neutral-200 hover:text-neutral-400 transition-colors group"
            title="Admin Dashboard"
          >
            <Settings
              size={16}
              className="group-hover:rotate-45 transition-transform"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
              System
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
