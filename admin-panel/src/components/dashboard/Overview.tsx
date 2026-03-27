'use client';

import React from 'react';
import {
    Users,
    MessageSquare,
    AlertTriangle,
    TrendingUp,
    MapPin,
    ArrowRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { cn } from '@/lib/utils';


const StatCard = ({ title, value, sub, icon: Icon, trend, color }: any) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
        <div className={cn("absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500", color)}>
            <Icon size={120} />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className={cn("p-2 rounded-lg bg-zinc-900 border border-white/5", color)}>
                    <Icon size={20} className="text-white" />
                </div>
                <span className="text-zinc-400 text-sm font-medium">{title}</span>
            </div>

            <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mb-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp size={12} />
                        <span>+{trend}%</span>
                    </div>
                )}
            </div>
            <p className="text-zinc-500 text-xs mt-2">{sub}</p>
        </div>
    </div>
);

const MOCK_DATA = [
    { day: 'Seg', users: 45, alerts: 12 },
    { day: 'Ter', users: 32, alerts: 5 },
    { day: 'Qua', users: 67, alerts: 23 },
    { day: 'Qui', users: 89, alerts: 15 },
    { day: 'Sex', users: 120, alerts: 42 },
    { day: 'Sáb', users: 54, alerts: 20 },
    { day: 'Dom', users: 44, alerts: 8 },
];

export function DashboardOverview() {
    return (
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Painel de Monitoramento</h2>
                    <p className="text-zinc-400">Visão Geral do Ecossistema em Tempo Real</p>
                </div>

                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>Última Sincronização: Hoje às 14:02:11</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Crianças Online"
                    value="1,204"
                    sub="Média de 124 por hora"
                    icon={Users}
                    trend={12}
                    color="text-blue-500"
                />
                <StatCard
                    title="Conversas Ativas"
                    value="342"
                    sub="32 respondidas recentemente"
                    icon={MessageSquare}
                    trend={8}
                    color="text-indigo-500"
                />
                <StatCard
                    title="Alertas de Emergência"
                    value="18"
                    sub="4 aguardando ação imediata"
                    icon={AlertTriangle}
                    trend={2}
                    color="text-red-500"
                />
                <StatCard
                    title="Pontos de Apoio"
                    value="4,567"
                    sub="Locais ativos no Brasil"
                    icon={MapPin}
                    color="text-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white tracking-tight">Tráfego e Alertas (Semanal)</h3>
                        <select className="bg-zinc-900 border border-white/10 text-xs px-3 py-1.5 rounded-lg text-zinc-300 focus:outline-none hover:bg-zinc-800 transition-colors cursor-pointer">
                            <option>Últimos 7 dias</option>
                            <option>Últimos 30 dias</option>
                        </select>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_DATA}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#ef4444" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white tracking-tight mb-6">Alertas Críticos Recentes</h3>

                    <div className="space-y-4 flex-1">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="group p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] uppercase font-black text-red-500 tracking-tighter bg-red-500/10 px-2 py-0.5 rounded">Prioridade Máxima</span>
                                    <span className="text-xs text-zinc-500">há 4 min</span>
                                </div>
                                <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">Protocolo de Socorro Ativado</p>
                                <p className="text-xs text-zinc-400 mt-1">Localização: São Paulo, SP (Raio 2km)</p>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_10px_30px_rgba(220,38,38,0.3)] group">
                        <span>Ver Todos Alertas</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
