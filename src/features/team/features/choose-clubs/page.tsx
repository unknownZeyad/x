"use client";

import EnterExit from "@/core/components/derived/enter-exit";
import Image from "next/image";
import { useEffect, useState } from "react";
import backgroundImg from '@public/assets/images/background_Img.png'
import person from '@public/assets/images/person.png'
import chooseYourTeamImg from '@public/assets/images/choose_your_team.jpg'
import logo from '@public/assets/images/Sobi-Fantasy-Game-Logo.webp'
import { useTeamInfo } from "../../providers/info-provider";
import { useTeamSocket } from "../../providers/socket-provider";

import realMadridLogo from '@public/assets/images/real-madrid-logo.png'
import alNassrLogo from '@public/assets/images/al-nassr-logo.png'
import barcelonaLogo from '@public/assets/images/barcelona-logo.png'
import alHilalLogo from '@public/assets/images/al-hilal-logo.png'
import holdPopupImg from "@public/assets/images/SFG-Pop up Msg's-webp_Artboard 3.webp"
import { cn, parse } from "@/core/lib/utils";

const teams = [
    { id: 1, name: "REAL MADRID", logo: realMadridLogo },
    { id: 2, name: "AL NASSR", logo: alNassrLogo },
    { id: 3, name: "BARCELONA", logo: barcelonaLogo },
    { id: 4, name: "AL HILAL", logo: alHilalLogo },
];

const logoMap: Record<string, any> = {
    "REAL MADRID": realMadridLogo,
    "AL NASSR": alNassrLogo,
    "BARCELONA": barcelonaLogo,
    "AL HILAL": alHilalLogo,
};

export default function ChooseClubs({ hold, otherTeamClub, clubs }: { hold: boolean, otherTeamClub: number | null, clubs: Club[] | null }) {
    const { teamInfo } = useTeamInfo();
    const { socket } = useTeamSocket();
    const [localSelection, setLocalSelection] = useState<number | null>(null);

    const selectedClub = localSelection ?? teamInfo.choosen_club?.id ?? null;

    const handleSelectClub = (clubId: number) => {
        setLocalSelection(clubId);
    };

    const [isSending, setIsSending] = useState(false);

    const isConfirmed = teamInfo?.choosen_club?.id === selectedClub;

    // Use the clubs from props or fallback to hardcoded if null
    const displayedClubs = clubs ? clubs.map(c => ({
        ...c,
        logo: c.img_url || logoMap[c.name.toUpperCase()] || realMadridLogo
    })) : teams;

    // Reset isSending when teamInfo updates to match our selection or if it's different
    useEffect(() => {
        setIsSending(false);
    }, [teamInfo?.choosen_club?.id]);

    const handleConfirm = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        const socketReady = socket?.readyState === WebSocket.OPEN;
        console.log('>>> CONFIRM CLICKED', {
            selectedClub,
            hasSocket: !!socket,
            socketReady,
            isConfirmed,
            hold,
            isSending
        });

        // ONLY block if mandatory things are missing (socket or selection)
        // We remove 'isConfirmed' and 'hold' from this guard to allow re-sending if it feels stuck.
        if (!selectedClub || !socket || !socketReady || isSending) {
            console.warn('>>> CONFIRM BLOCKED - Essential missing:', {
                noClubSelected: !selectedClub,
                noSocketObject: !socket,
                socketNotOpen: !socketReady,
                currentlySending: isSending
            });
            return;
        }

        try {
            setIsSending(true);
            const message = JSON.stringify({
                event: 'choose_club',
                data: { club_id: selectedClub }
            });
            console.log('>>> SENDING TO SOCKET:', message);
            socket.send(message);
            console.log('>>> MESSAGE DISPATCHED');

            // Safety timeout: reset sending state after 2 seconds no matter what
            setTimeout(() => {
                setIsSending(false);
                console.log('>>> SENDING TIMEOUT - State reset');
            }, 2000);
        } catch (error) {
            console.error('>>> SEND ERROR:', error);
            setIsSending(false);
        }
    };

    return (
        <EnterExit>
            <div
                className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${backgroundImg.src})` }}
            >
                <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-8">
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                        <div className={cn(
                            "w-3 h-3 rounded-full animate-pulse",
                            socket?.readyState === WebSocket.OPEN ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                        )} />
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                            {socket?.readyState === WebSocket.OPEN ? "Online" : "Disconnected"}
                        </span>
                    </div>

                    <Image
                        src={logo || ""}
                        width={120}
                        height={120}
                        alt='logo image'
                        className='absolute top-6 right-6 z-10'
                    />

                    <div className='w-full flex items-center justify-around gap-4'>
                        <div className='shrink-0'>
                            <div className='relative'>
                                {/* Card background for person */}
                                <div className="rounded-2xl shadow-xl">
                                    <Image
                                        src={person || ""}
                                        width={180}
                                        height={300}
                                        alt='person image'
                                        className='object-contain'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative flex-1 max-w-4xl">

                            <div className='relative p-20 rounded-b-xl bg-cover bg-no-repeat' style={{ backgroundImage: `url(${chooseYourTeamImg.src})` }}>
                                <div className='grid grid-cols-4 gap-6 mb-8'>
                                    {displayedClubs.map((team) => {
                                        const isLocked = otherTeamClub === team.id && teamInfo.choosen_club?.id !== team.id;
                                        return (
                                            <div
                                                key={team.id}
                                                onClick={() => !isLocked && !isConfirmed && !hold && handleSelectClub(team.id)}
                                                className={cn(
                                                    "relative cursor-pointer transition-all duration-300 transform",
                                                    selectedClub === team.id && "scale-105",
                                                    isLocked && "opacity-40 grayscale blur-[1px] pointer-events-none scale-95",
                                                    hold && "opacity-40 grayscale brightness-50 pointer-events-none",
                                                    !isLocked && !isConfirmed && !hold && "hover:scale-105"
                                                )}
                                            >
                                                <div className='rounded-xl  mb-3'>
                                                    <Image
                                                        src={team.logo}
                                                        width={120}
                                                        height={120}
                                                        alt={`${team.name} logo`}
                                                        className='object-contain rounded-2xl w-full'
                                                    />
                                                </div>

                                                {selectedClub === team.id && (
                                                    <div className='absolute -top-6 left-1/2 transform rotate-180 -translate-x-1/2 z-10 animate-bounce'>
                                                        <div className='w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-b-16 border-b-green-500 drop-shadow-xl'></div>
                                                    </div>
                                                )}

                                                {isLocked && (
                                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                                        <div className="bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-tighter border border-white/20 backdrop-blur-sm">
                                                            TAKEN
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {hold && (
                                    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 pointer-events-none animate-in fade-in zoom-in duration-300">
                                        <Image
                                            src={holdPopupImg}
                                            width={500}
                                            height={300}
                                            alt="Waiting for turn"
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                )}

                                <div className='flex justify-center'>
                                    <button
                                        type="button"
                                        disabled={!selectedClub || isSending || socket?.readyState !== WebSocket.OPEN}
                                        onClick={handleConfirm}
                                        className={cn(
                                            "relative z-50 px-20 py-3 rounded-full text-white font-bold text-lg cursor-pointer border-2 border-amber-400 transition-all duration-300 transform active:scale-95",
                                            selectedClub
                                                ? isConfirmed
                                                    ? "bg-amber-600 border-amber-300 opacity-80 cursor-default"
                                                    : (hold || isSending)
                                                        ? "bg-gray-600 border-gray-500 opacity-50 font-normal italic cursor-wait"
                                                        : socket?.readyState === WebSocket.OPEN
                                                            ? "bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-xl hover:shadow-green-500/50"
                                                            : "bg-gray-600 cursor-not-allowed opacity-50 font-normal italic"
                                                : "bg-gray-600 cursor-not-allowed opacity-50"
                                        )}
                                    >
                                        <span className="relative z-10">
                                            {isConfirmed
                                                ? "✓ CONFIRMED"
                                                : isSending
                                                    ? "SENDING..."
                                                    : hold
                                                        ? "WAITING FOR TURN"
                                                        : socket?.readyState === WebSocket.OPEN
                                                            ? "CONFIRM CHOICE"
                                                            : "CONNECTING..."}
                                        </span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EnterExit>
    );
}
