// src/widgets/breadcrumb/ui/Breadcrumb.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBreadcrumbs } from "../lib/getBreadcrumbs";

export default function Breadcrumb() {
    const pathname = usePathname();
    const router = useRouter();

    const handleClick = (href: string, defaultPath: string | undefined, isLast: boolean) => {
        if (isLast || href === "/") {
            router.push(href);
        } else if (defaultPath) {
            router.push(defaultPath);
        }
    };

    const breadcrumbs = getBreadcrumbs(pathname);

    if (breadcrumbs.length === 0) return null;

    return (
        <nav className="bg-gray-50 border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-10 text-sm">
                    <button
                        onClick={() => handleClick("/", undefined, false)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        홈
                    </button>

                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <div key={`${item.href}-${index}`} className="flex items-center">
                                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                                <button
                                    onClick={() => handleClick(item.href, item.defaultPath, isLast)}
                                    className={cn(
                                        "hover:text-gray-900 cursor-pointer",
                                        isLast ? "text-gray-900 font-medium" : "text-gray-600"
                                    )}
                                >
                                    {item.label}
                                </button>
                            </div>
                        );
                    })}

                </div>
            </div>
        </nav>
    );
}