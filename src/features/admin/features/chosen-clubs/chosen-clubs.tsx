"use client";

import { useAdminSocket } from "../../providers/admin-socket-provider";
import { useEffect, useState } from "react";
import { parse } from "@/core/lib/utils";
import Image from "next/image";
import backgroundImg from '@public/assets/images/background_Img.png';

export default function ChosenClubs({ state }: { state: any }) {
    if (!state) return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <p className="text-white/50 animate-pulse text-2xl font-bold uppercase italic tracking-widest">
                Waiting for final results...
            </p>
        </div>
    );

    const team1Club = state.team1?.choosen_club;
    const team2Club = state.team2?.choosen_club;

    if (!team1Club || !team2Club) return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <p className="text-white/50 font-bold">Waiting for team choices...</p>
        </div>
    );

    return (
        <div
            className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center gap-12 text-white"
            style={{ backgroundImage: `url(${backgroundImg.src})` }}
        >
            <h1 className="text-6xl font-black text-amber-400 drop-shadow-2xl italic tracking-tighter">
                CHOSEN CLUBS
            </h1>

            <div className="flex items-center justify-center gap-24 w-full px-20">
                {/* Team 1 Club */}
                <div className="flex flex-col items-center gap-6 group scale-110">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-amber-400/30 p-8 flex items-center justify-center shadow-2xl overflow-hidden">
                            {team1Club.img_url ? (
                                <Image
                                    src={team1Club.img_url}
                                    alt={team1Club.name}
                                    width={180}
                                    height={180}
                                    className="object-contain"
                                />
                            ) : (
                                <div className="text-white/20 text-8xl font-black uppercase italic -rotate-12 select-none">
                                    {team1Club.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-1">{state.team1.name}</p>
                        <h2 className="text-4xl font-black italic uppercase">{team1Club.name}</h2>
                    </div>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center">
                    <div className="w-px h-32 bg-linear-to-b from-transparent via-amber-400 to-transparent opacity-50" />
                    <span className="text-6xl font-black text-white/20 italic my-4">VS</span>
                    <div className="w-px h-32 bg-linear-to-b from-transparent via-amber-400 to-transparent opacity-50" />
                </div>

                {/* Team 2 Club */}
                <div className="flex flex-col items-center gap-6 group scale-110">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-amber-400/30 p-8 flex items-center justify-center shadow-2xl overflow-hidden">
                            {team2Club.img_url ? (
                                <Image
                                    src={team2Club.img_url}
                                    alt={team2Club.name}
                                    width={180}
                                    height={180}
                                    className="object-contain"
                                />
                            ) : (
                                <div className="text-white/20 text-8xl font-black uppercase italic -rotate-12 select-none">
                                    {team2Club.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-1">{state.team2.name}</p>
                        <h2 className="text-4xl font-black italic uppercase">{team2Club.name}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
