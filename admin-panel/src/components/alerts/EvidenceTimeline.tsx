'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    MapPin,
    Clock,
    Download,
    Eye,
    FileCheck,
    Zap,
    ChevronRight,
    Maximize2,
    FileText,
    PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateJudicialDossie } from '@/lib/dossieGenerator';
import { supabase } from '@/lib/supabase';


const MOCK_EVIDENCE = [
    { id: '1', time: '14:02:11', type: 'photo', lat: -23.5505, lng: -46.6333, hash: 'sha256:7f8a...9b2c', status: 'verified' },
    { id: '2', time: '14:02:21', type: 'photo', lat: -23.5507, lng: -46.6335, hash: 'sha256:3d1f...1a4e', status: 'verified' },
    { id: '3', time: '14:02:31', type: 'audio', lat: -23.5510, lng: -46.6338, hash: 'sha256:e9c2...0d8f', status: 'verified' },
];

export function EvidenceTimeline({ caseId }: { caseId: string }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">

            {/* Left Column: Timeline & Map */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <ShieldCheck className="text-emerald-500" size={32} />
                            Custódia de Provas: #{caseId}
                        </h2>
                        <p className="text-zinc-500 font-medium">Linha do Tempo de Evidências Criptográficas e Georreferenciadas</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2">
                            <FileCheck size={14} />
                            Hash Verified
                        </button>
                    </div>
                </div>

                {/* GPS Trail Map (Mock) */}
                <div className="h-[400px] bg-zinc-900 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-46.63, -23.55,12/1200x600?access_token=pk.placeholder')] bg-cover opacity-60 mix-blend-luminosity grayscale" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="w-8 h-8 bg-red-600 rounded-full animate-ping opacity-40" />
                            <div className="absolute inset-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-2xl">
                                <Zap size={16} className="text-white fill-white" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-6 left-6 bg-zinc-950/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-black">Coordenada Atual</p>
                            <p className="text-white font-mono text-sm">23.5505 S, 46.6333 W</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <button className="text-red-500 hover:text-red-400 transition-colors">
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Evidence Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {MOCK_EVIDENCE.map(ev => (
                        <div key={ev.id} className="group aspect-video bg-zinc-900 rounded-2xl border border-white/5 relative overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all duration-300">
                            {/* This would be the real content (Image/Audio visualizer) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

                            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                {ev.type === 'photo' ? (
                                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300')] bg-cover opacity-40" />
                                ) : (
                                    <Zap className="text-indigo-500 opacity-40" size={48} />
                                )}
                            </div>

                            <div className="absolute top-3 left-3 z-20">
                                <div className="bg-emerald-500/90 text-[8px] font-black text-white px-2 py-0.5 rounded shadow-lg uppercase tracking-tight">Verified</div>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                                <div>
                                    <p className="text-white font-bold text-xs">{ev.time}</p>
                                    <p className="text-[9px] text-zinc-400 font-mono truncate max-w-[100px]">{ev.hash}</p>
                                </div>
                                <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/10 text-white transition-all">
                                    <Eye size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Information & Export */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">Relatório Judicial (Forense)</h3>

                    <div className="space-y-4">
                        <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="bg-emerald-600/10 p-3 rounded-xl text-emerald-500 underline underline-offset-4 decoration-emerald-500/20">
                                <PlayCircle size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">Status Streaming</p>
                                <p className="text-white font-bold text-sm">Sequência HLS Ativa (5s chunks)</p>
                            </div>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-2xl border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.4)] flex items-center gap-4">
                            <div className="bg-indigo-600/10 p-3 rounded-xl text-indigo-500">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-black">Escuta Ativa</p>
                                <p className="text-white font-bold">12:45 min (Fragmentado)</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-3">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Este dossiê contém evidências coletadas sob o sistema de **Resiliência Offline**. Chunks residuais sincronizados automaticamente.
                        </p>

                        <button
                            onClick={async () => {
                                // 1. Judicial Audit Log
                                await supabase.from('access_audit_logs').insert({
                                    admin_id: 'admin-001-placeholder', // In real app use session.user.id
                                    resource_id: caseId,
                                    action_type: 'export_dossie',
                                    reason: 'Geração de Dossiê para Delegacia'
                                });

                                generateJudicialDossie({
                                    id: caseId,
                                    date: '27/03/2026',
                                    duration: '12:45 min',
                                    accuracy: '2km',
                                    chunks: MOCK_EVIDENCE,
                                    proofUrl: 'https://cuidar-app-proof.com/s/' + caseId
                                });
                            }}
                            className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95 group"
                        >
                            <FileText size={20} className="group-hover:translate-x-0.5 transition-transform" />
                            Gerar Dossiê Jurídico (PDF)
                        </button>

                        <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-red-900/20 active:scale-95 group">
                            <Download size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                            Baixar Pacote Forense Completo
                        </button>
                    </div>
                </div>

                {/* Chain of Custody (Legal Info) */}
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <h4 className="text-emerald-500 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldCheck size={14} />
                        Cadeia de Custódia Ativa
                    </h4>
                    <ul className="space-y-3 text-[11px] text-zinc-400 font-medium">
                        <li className="flex items-start gap-2">
                            <ChevronRight size={12} className="text-emerald-500 mt-1 shrink-0" />
                            Hash gerado no momento zero da captura.
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight size={12} className="text-emerald-500 mt-1 shrink-0" />
                            Transmissão segura via canal TLS-1.3.
                        </li>
                        <li className="flex items-start gap-2">
                            <ChevronRight size={12} className="text-emerald-500 mt-1 shrink-0" />
                            Imutabilidade garantida no Supabase Storage.
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
}
