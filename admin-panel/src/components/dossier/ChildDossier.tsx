'use client';

import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    BookOpen,
    Gamepad2,
    Activity,
    MessageSquare,
    MapPin,
    Calendar,
    ChevronDown,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChildDossier({ childId }: { childId: string }) {
    const [activeTab, setActiveTab] = useState<'emergency' | 'diary' | 'games' | 'access'>('emergency');

    const MOCK_DOSSIER = {
        name: 'Herói das Estrelas (Nickname)',
        id: childId,
        alerts: [
            { id: '1', date: '27/03/2026', type: 'SOS_TRIGGER', status: 'resolved', lat: -23.55, lng: -46.63 },
        ],
        diary: [
            { id: '1', date: '26/03/2026', content: 'Hoje me senti um pouco triste no quarto...', mood: 'sad' },
            { id: '2', date: '25/03/2026', content: 'Brinquei muito no app hoje!', mood: 'happy' },
        ],
        games: [
            { id: '1', game: 'Mapa do Carinho', flags: 2, summary: 'Input vermelho em zonas sensíveis.' },
            { id: '2', game: 'Show de Cores', summary: 'Nível 10 completo. Sem anomalias.' },
        ],
        access: [
            { date: '27/03/2026 14:02', action: 'PIN_ENTRY_SUCCESS' },
            { date: '27/03/2026 12:10', action: 'APP_OPEN' },
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 animate-in fade-in duration-500">
            {/* Dossier Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-black shadow-xl ring-2 ring-white/10">
                        <Lock size={40} className="text-white fill-white/20" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white mb-2">{MOCK_DOSSIER.name}</h1>
                        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500" />
                            MASTER ID: {childId}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-red-600/10 border border-red-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <ShieldAlert size={20} className="text-red-500" />
                        <span className="text-red-500 font-black text-xs uppercase letter-spacing-2">Risco: Médio</span>
                    </div>
                    <div className="bg-emerald-600/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <Calendar size={20} className="text-emerald-500" />
                        <span className="text-emerald-500 font-black text-xs uppercase letter-spacing-2">Monitoramento Ativo</span>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Tabs Sidebar */}
                <div className="lg:col-span-3 space-y-3">
                    {[
                        { id: 'emergency', label: ' SOS e Urgências', icon: ShieldAlert, color: 'text-red-500' },
                        { id: 'diary', label: ' Diário e Emoções', icon: BookOpen, color: 'text-indigo-500' },
                        { id: 'games', label: ' Relatórios de Jogos', icon: Gamepad2, color: 'text-amber-500' },
                        { id: 'access', label: ' Logs de Acesso', icon: Activity, color: 'text-zinc-400' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-bold transition-all duration-300 border border-transparent text-sm",
                                activeTab === tab.id
                                    ? "bg-white text-black translate-x-3 shadow-2xl shadow-white/10"
                                    : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            )}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 bg-zinc-900/30 rounded-[40px] border border-white/5 p-8 min-h-[600px] backdrop-blur-md">

                    {activeTab === 'emergency' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <ShieldAlert className="text-red-500" />
                                Histórico de Acionamentos
                            </h2>
                            {MOCK_DOSSIER.alerts.map(alert => (
                                <div key={alert.id} className="bg-black/40 border border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:border-red-500/30 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-red-600/10 p-4 rounded-2xl text-red-500">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{alert.date}</p>
                                            <p className="text-xs text-zinc-500 font-mono tracking-tighter">LAT: {alert.lat} | LNG: {alert.lng}</p>
                                        </div>
                                    </div>
                                    <button className="bg-white/5 hover:bg-white text-white hover:text-black px-6 py-2 rounded-xl text-xs font-black transition-all">
                                        VER EVIDÊNCIAS
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'diary' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-indigo-500">
                                <BookOpen />
                                Diário Secreto
                            </h2>
                            {MOCK_DOSSIER.diary.map(entry => (
                                <div key={entry.id} className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 bg-indigo-500/10 text-indigo-500 rounded-bl-3xl">
                                        {entry.mood === 'sad' ? '😢 Triste' : '😊 Feliz'}
                                    </div>
                                    <p className="text-zinc-400 text-sm mb-4">{entry.date}</p>
                                    <p className="text-zinc-200 leading-relaxed italic">"{entry.content}"</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'games' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {MOCK_DOSSIER.games.map(game => (
                                <div key={game.id} className="bg-zinc-950/80 p-6 rounded-3xl border border-white/5 hover:border-amber-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-amber-600/10 p-3 rounded-xl text-amber-500">
                                            <Gamepad2 size={24} />
                                        </div>
                                        {game.flags && game.flags > 0 && (
                                            <span className="bg-red-600 text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">
                                                {game.flags} FLAGS
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{game.game}</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{game.summary}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'access' && (
                        <div className="space-y-4">
                            {MOCK_DOSSIER.access.map((log, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                                    <Activity size={14} className="text-zinc-500" />
                                    <span className="text-zinc-500 font-mono">{log.date}</span>
                                    <span className="font-bold text-zinc-300">Action: {log.action}</span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
