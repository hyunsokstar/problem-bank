// src/widgets/breadcrumb/lib/types.ts
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  subMenus?: MenuItem[];
}

export interface BreadcrumbItem {
  href: string;
  label: string;
  defaultPath?: string;
  key: string;  // 각 항목의 고유 식별자
}