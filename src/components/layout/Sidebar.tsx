"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { mainNavigation, secondaryNavigation } from "./navigation";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-5">
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight text-zinc-950"
        >
          Sprintly
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col px-3 py-4">
        {/* Workspace */}
        <div>
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm transition-colors",
                    active
                      ? "bg-zinc-100 font-medium text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Projects */}
        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Projects
            </p>
          </div>

          <div className="px-2 py-2">
            <p className="text-xs text-zinc-400">Projects will appear here.</p>
          </div>
        </div>

        {/* Secondary navigation */}
        <div className="mt-auto">
          <nav className="space-y-1 border-t border-zinc-100 pt-3">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm transition-colors",
                    active
                      ? "bg-zinc-100 font-medium text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
