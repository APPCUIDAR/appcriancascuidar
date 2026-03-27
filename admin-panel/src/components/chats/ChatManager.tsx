'use client';

import React, { useState } from 'react';
import {
    Search,
    Send,
    Paperclip,
    User,
    MoreVertical,
    Flag,
    Calendar,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';


const MOCK_CHATS = [
    { id: '1', name: 'Usuário #102', lastMsg: 'Oi, estou com medo...', time: '14:05', unread: 2, status: 'online' },
    { id: '2', name: 'Canal Socorro #SP', lastMsg: 'Localização Recebida', time: 'Ontem', unread: 0, status: 'offline' },
    { id: '3', name: 'Usuário #087', lastMsg: 'Obrigado pela ajuda!', time: 'Ontem', unread: 0, status: 'offline' },
];

const MOCK_MESSAGES = [
    { id: 'm1', text: 'Olá, tem alguém aí?', sender: 'child', time: '14:02' },
    { id: 'm2', text: 'Oi! Sim, estou aqui. Pode falar, você está em um lugar seguro?', sender: 'admin', time: '14:03' },
    { id: 'm3', text: 'Estou no meu quarto, mas ouvi um barulho na sala...', sender: 'child', time: '14:05' },
];

export function ChatManager() {
    const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0]);
    const [msg, setMsg] = useState('');

    return (
        <div className="h-screen flex flex-col animate-in fade-in duration-1000">
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar - Chat List */}
                <div className="w-96 flex flex-col bg-zinc-950 border-r border-white/5">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white mb-4">Conversas</h2>
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" size={16} />
                            <input
                                placeholder="Buscar por ID ou Local..."
                                className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {MOCK_CHATS.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "p-4 border-b border-white/5 cursor-pointer transition-all duration-200 hover:bg-white/[0.02]",
                                    selectedChat.id === chat.id ? "bg-white/[0.04] border-l-4 border-l-red-600" : ""
                                )}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/10">
                                            <User size={24} />
                                        </div>
                                        {chat.status === 'online' && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm text-zinc-200 truncate">{chat.name}</span>
                                            <span className="text-[10px] text-zinc-500">{chat.time}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 truncate pr-6">{chat.lastMsg}</p>
                                    </div>
                                    {chat.unread > 0 && (
                                        <div className="bg-red-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">

                    {/* Header Area */}
                    <div className="p-4 border-b border-white/5 bg-zinc-900/40 backdrop-blur-xl flex justify-between items-center z-20">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                                    {selectedChat.name}
                                    <div className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-black tracking-tighter">Ativo Agora</div>
                                </h3>
                                <p className="text-xs text-zinc-500 font-medium">Histórico de Alerta: #88321-SP</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400">
                            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border border-white/5"><Flag size={18} /></button>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border border-white/5"><ShieldCheck size={18} /></button>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border border-white/5"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Content Window */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth z-10 flex flex-col">
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-zinc-900/50 border border-white/5 px-4 py-1 rounded-full text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={10} />
                                Início do Atendimento: Hoje, 14:02
                            </div>
                        </div>

                        {MOCK_MESSAGES.map((m) => (
                            <div
                                key={m.id}
                                className={cn(
                                    "max-w-[70%] flex flex-col",
                                    m.sender === 'admin' ? "self-end items-end" : "self-start items-start"
                                )}
                            >
                                <div className={cn(
                                    "p-4 rounded-2xl relative shadow-lg group",
                                    m.sender === 'admin'
                                        ? "bg-zinc-100 text-zinc-950 rounded-tr-none font-medium selection:text-white"
                                        : "bg-red-600 text-white rounded-tl-none font-medium shadow-red-900/20"
                                )}>
                                    {m.text}
                                    <div className={cn(
                                        "text-[9px] mt-2 opacity-50 font-bold",
                                        m.sender === 'admin' ? "text-zinc-600" : "text-white/80"
                                    )}>
                                        {m.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-zinc-950 border-t border-white/5 z-20">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-2 flex items-center gap-2 focus-within:border-red-600/50 transition-all shadow-xl shadow-black/50 overflow-hidden">
                            <button className="p-3 text-zinc-500 hover:text-white transition-colors"><Paperclip size={20} /></button>
                            <input
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Digite uma mensagem reconfortante..."
                                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none py-3"
                            />
                            <button
                                className={cn(
                                    "p-3 rounded-xl transition-all flex items-center gap-2",
                                    msg.length > 0 ? "bg-red-600 text-white shadow-lg shadow-red-900/30 font-bold px-6 scale-100 opacity-100" : "text-zinc-500 scale-90 opacity-50"
                                )}
                            >
                                {msg.length > 0 && <span>Enviar Mensagem</span>}
                                <Send size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Glass Effect Background */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] opacity-20" />
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] opacity-10" />
                    </div>
                </div>

            </div>
        </div>
    );
}
