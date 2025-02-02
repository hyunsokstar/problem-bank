// src/widgets/header/ui/Header.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { headerMenus } from "../model/header-menus";
import MenuItem from "./components/MenuItem";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className={cn("sticky top-0 z-40 w-full bg-white border-b", className)}>
      {/* Menu bar */}
      <div className="relative bg-white">
        <nav className="container mx-auto flex items-center px-4">
          {headerMenus.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              currentPath={pathname}
              isOpen={activeMenu === item.href}
              onMouseEnter={() => setActiveMenu(item.href)}
              onMouseLeave={() => setActiveMenu(null)}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}