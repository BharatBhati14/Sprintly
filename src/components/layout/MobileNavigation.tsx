"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { mainNavigation, secondaryNavigation } from "./navigation";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 lg:hidden"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white lg:hidden">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="text-lg font-semibold tracking-tight text-zinc-950"
          >
            Sprintly
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col px-3 py-4">
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
                    onClick={onClose}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-2.5 text-sm transition-colors",
                      active
                        ? "bg-zinc-100 font-medium text-zinc-950"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-7">
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Projects
            </p>

            <p className="px-2 py-2 text-xs text-zinc-400">
              Projects will appear here.
            </p>
          </div>

          <div className="mt-auto">
            <nav className="border-t border-zinc-100 pt-3">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-2.5 text-sm transition-colors",
                      active
                        ? "bg-zinc-100 font-medium text-zinc-950"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
