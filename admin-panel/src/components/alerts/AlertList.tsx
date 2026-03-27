'use client';

import React, { useState, useEffect } from 'react';
import {
    AlertCircle,
    MapPin,
    PhoneCall,
    Clock,
    CheckCircle,
    ExternalLink,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Alert {
    id: string;
    child_id: string;
    latitude: number;
    longitude: number;
    status: 'active' | 'resolved';
    created_at: string;
    child_name?: string;
}

const MOCK_ALERTS: Alert[] = [
    { id: '1', child_id: 'c1', latitude: -23.5, longitude: -46.6, status: 'active', created_at: new Date().toISOString(), child_name: 'Usuário #102' },
    { id: '2', child_id: 'c2', latitude: -23.51, longitude: -46.62, status: 'resolved', created_at: new Date(Date.now() - 3600000).toISOString(), child_name: 'Usuário #087' },
];

export function AlertCenter() {
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

    useEffect(() => {
        // Escuta Realtime do Supabase nos Alerts
        // const channel = supabase.channel('emergency_alerts')
        //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emergency_alerts' }, payload => {
        //      setAlerts(prev => [payload.new as Alert, ...prev]);
        //      // Emite Alerta Sonoro aqui
        //   })
        //   .subscribe();

        // return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
                        <AlertCircle className="text-red-600 animate-pulse" size={32} />
                        Central de Alertas Críticos
                    </h2>
                    <p className="text-zinc-400">Monitoramento Ativo de Protocolos de Socorro</p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200">
                        Sistema de Webhook Ativo
                    </button>
                </div>
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Protocolo ID</th>
                                <th className="px-6 py-4">Criança / Ref</th>
                                <th className="px-6 py-4">Localização (GPS)</th>
                                <th className="px-6 py-4">Tempo Decorrido</th>
                                <th className="px-6 py-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {alerts.map((alert) => (
                                <tr key={alert.id} className={cn(
                                    "group hover:bg-white/[0.02] transition-colors",
                                    alert.status === 'active' ? "bg-red-500/[0.03]" : ""
                                )}>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {alert.status === 'active' ? (
                                            <div className="flex items-center gap-2 text-red-500 font-bold bg-red-500/10 w-fit px-3 py-1 rounded-full border border-red-500/20 text-xs">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                                SOCORRO ATIVO
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-500 font-medium bg-zinc-900 w-fit px-3 py-1 rounded-full border border-zinc-800 text-xs">
                                                <CheckCircle size={12} />
                                                Resolvido
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 font-mono text-zinc-400 text-sm">
                                        {alert.id.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-5 font-bold text-white">
                                        {alert.child_name}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <a
                                            href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                                            target="_blank"
                                            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium group/map"
                                        >
                                            <MapPin size={16} />
                                            {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                                            <ExternalLink size={12} className="opacity-0 group-hover/map:opacity-100 transition-opacity" />
                                        </a>
                                    </td>
                                    <td className="px-6 py-5 text-zinc-500 text-xs font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            {alert.status === 'active' ? 'Ocorrendo Agora' : 'Finalizado'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105">
                                                <MessageSquare size={16} />
                                            </button>
                                            <button className="p-2.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-red-500/50 text-red-500 hover:bg-zinc-800 transition-all hover:scale-105">
                                                <PhoneCall size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {alerts.length === 0 && (
                    <div className="p-20 text-center">
                        <AlertCircle size={48} className="mx-auto text-zinc-800 mb-4" />
                        <p className="text-zinc-500 font-medium">Nenhum alerta crítico ativo no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
