"use client";

// src\widgets\header\ui\Header.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navItems } from '../model/navigation';

interface HeaderProps {
    className?: string;
}

const Header = ({ className }: HeaderProps) => {
    const pathname = usePathname();

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            className
        )}>
            <div className="container flex h-14 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold">Problem Bank</span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center space-x-4">
                    {/* Add any right-side actions like auth buttons later */}
                </div>
            </div>
        </header>
    );
};

export default Header;