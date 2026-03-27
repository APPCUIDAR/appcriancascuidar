'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    AlertCircle,
    MapPin,
    BarChart3,
    Settings,
    Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Visão Geral', icon: LayoutDashboard, href: '/' },
    { name: 'Gestão de Chats', icon: MessageSquare, href: '/chats' },
    { name: 'Central de Alertas', icon: AlertCircle, href: '/alerts' },
    { name: 'Base de Apoio', icon: MapPin, href: '/locations' },
    { name: 'Relatórios', icon: BarChart3, href: '/reports' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-72 flex-col bg-zinc-950 text-white border-r border-zinc-800">
            <div className="p-8 flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-900/20">
                    <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">App Cuidar</h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                            pathname === item.href
                                ? "bg-red-600/10 text-red-500 font-medium shadow-[inset_0_0_0_1px_rgba(220,38,38,0.2)]"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                        )}
                    >
                        {pathname === item.href && (
                            <div className="absolute left-[-1rem] w-1 h-6 bg-red-600 rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
                        )}
                        <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-red-500" : "group-hover:text-white")} />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200"
                >
                    <Settings className="w-5 h-5" />
                    <span>Configurações</span>
                </Link>

                <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-xs text-zinc-400 font-medium">Sistema Online</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-tight">
                        Protocolo de Proteção Ativo v1.0.2
                    </p>
                </div>
            </div>
        </div>
    );
}
