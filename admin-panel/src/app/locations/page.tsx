'use client';

import React, { useState } from 'react';
import {
    Plus,
    MapPin,
    Search,
    Trash2,
    Edit3,
    ExternalLink,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_LOCATIONS = [
    { id: '1', name: 'Delegacia da Mulher - Centro', address: 'Rua das Flores, 123', type: 'Segurança', status: 'Aberto' },
    { id: '2', name: 'Conselho Tutelar Norte', address: 'Av. Paulista, 900', type: 'Proteção', status: 'Aberto' },
    { id: '3', name: 'Hospital Infantil Sabará', address: 'Rua Piauí, 450', type: 'Saúde', status: '24h' },
];

export default function LocationsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Base de Apoio Nacional</h2>
                    <p className="text-zinc-400">Gerenciamento de Pontos de Refúgio e Atendimento</p>
                </div>

                <button className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 shadow-lg shadow-white/5 active:scale-95">
                    <Plus size={18} />
                    Novo Ponto de Apoio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/20">
                        <Info className="text-white" size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-400 uppercase font-black tracking-widest">Atualização</p>
                        <h4 className="text-white font-bold">Base Sincronizada</h4>
                        <p className="text-[10px] text-zinc-500 italic mt-0.5">Última atualização: 2h atrás</p>
                    </div>
                </div>
                {/* More summary cards if needed */}
            </div>

            <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" size={18} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filtrar por nome, cidade ou tipo de serviço..."
                            className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all duration-300"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-zinc-900 border border-white/5 text-sm px-4 py-3 rounded-xl text-zinc-300 focus:outline-none cursor-pointer">
                            <option>Todos os Estados</option>
                            <option>São Paulo</option>
                            <option>Rio de Janeiro</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-wider border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Ponto de Apoio</th>
                                <th className="px-6 py-4">Endereço</th>
                                <th className="px-6 py-4">Disponibilidade</th>
                                <th className="px-6 py-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {MOCK_LOCATIONS.map((loc) => (
                                <tr key={loc.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border",
                                            loc.type === 'Segurança' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                loc.type === 'Saúde' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        )}>
                                            {loc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-zinc-100 group-hover:text-white transition-colors">{loc.name}</td>
                                    <td className="px-6 py-5 text-zinc-400 flex items-center gap-2">
                                        <MapPin size={14} />
                                        {loc.address}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-zinc-300 font-medium">{loc.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button className="p-2 border border-white/5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all"><Edit3 size={16} /></button>
                                            <button className="p-2 border border-white/5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                            <button className="p-2 border border-white/5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-indigo-400 transition-all"><ExternalLink size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
