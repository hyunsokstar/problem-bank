// src/widgets/header/ui/MenuItem.tsx
"use client";

import { LucideIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItemData {
  href: string;
  label: string;
  icon: LucideIcon;
  subMenus?: MenuItemData[];
}

interface MenuItemProps {
  item: MenuItemData;
  currentPath: string;
  isOpen?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MenuItem({
  item,
  currentPath,
  isOpen = false,
  onMouseEnter,
  onMouseLeave,
}: MenuItemProps) {
  const { icon: Icon, label, href, subMenus } = item;
  const hasSubMenus = Boolean(subMenus?.length);
  const isActive = currentPath.startsWith(href);

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Main menu item */}
      <div
        className={cn(
          "flex items-center px-4 py-3 cursor-pointer",
          "transition-colors duration-200",
          isActive 
            ? "text-blue-600 bg-blue-50" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          isOpen && !isActive && "bg-gray-100 text-gray-900"
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
        {hasSubMenus && (
          <ChevronDown 
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} 
          />
        )}
      </div>

      {/* Invisible bridge between menu and submenu */}
      {hasSubMenus && isOpen && (
        <>
          <div className="absolute left-0 w-full h-2 -bottom-2 bg-transparent" />
          <div className="absolute left-0 top-full z-50 w-56">
            {/* Visual gap maintained by padding */}
            <div className="pt-1">
              {/* Submenu content */}
              <div className="bg-white border rounded-md shadow-lg">
                {subMenus?.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = currentPath === subItem.href;
                  
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center w-full px-4 py-2.5",
                        "transition-colors duration-200",
                        isSubActive 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-700 hover:bg-gray-100",
                        "hover:text-gray-900"
                      )}
                    >
                      <SubIcon className={cn(
                        "h-4 w-4 mr-2 flex-shrink-0",
                        isSubActive ? "text-blue-600" : "text-gray-500"
                      )} />
                      <span className="text-sm">{subItem.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}