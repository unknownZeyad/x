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

// Team logo imports
import realMadridLogo from '@public/assets/images/real-madrid-logo.png'
import alNassrLogo from '@public/assets/images/al-nassr-logo.png'
import barcelonaLogo from '@public/assets/images/barcelona-logo.png'
import alHilalLogo from '@public/assets/images/al-hilal-logo.png'
import { parse } from "@/core/lib/utils";

const teams = [
    { id: 1, name: "REAL MADRID", logo: realMadridLogo },
    { id: 2, name: "AL NASSR", logo: alNassrLogo },
    { id: 3, name: "BARCELONA", logo: barcelonaLogo },
    { id: 4, name: "AL HILAL", logo: alHilalLogo },
];

export default function ChooseClubs() {
    const { teamInfo } = useTeamInfo();
    const { socket } = useTeamSocket();
    const [localSelection, setLocalSelection] = useState<number | null>(null);

    const selectedClub = localSelection ?? teamInfo.choosen_club?.id ?? null;

    const handleSelectClub = (clubId: number) => {
        setLocalSelection(clubId);
    };

    const handleConfirm = () => {
        if (selectedClub && socket) {
            socket.send(JSON.stringify({
                event: 'choose_club',
                data: { club_id: selectedClub }
            }));
        }
    };
    
    const [_choosenClub, setchoosenClub] = useState<number | null>(null)
    useEffect(() => {
        socket?.addEventListener('message', (msg) => {
            const parsed = parse<ServerTeamMessage>(msg.data)
            if (parsed.event === 'unhold_choosing_club') {
                setchoosenClub(parsed.data.choosen_club_id)
            }
        })
    }, [])

    return (
        <EnterExit>
            <div
                className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${backgroundImg.src})` }}
            >
                <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-8">
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

                            <div className='p-20 rounded-b-xl bg-cover bg-no-repeat' style={{ backgroundImage: `url(${chooseYourTeamImg.src})` }}>
                                <div className='grid grid-cols-4 gap-6 mb-8'>
                                    {teams.map((team) => (
                                        <div
                                            key={team.id}
                                            onClick={() => handleSelectClub(team.id)}
                                            className={`
                                                relative cursor-pointer transition-all duration-300 transform hover:scale-105
                                                ${selectedClub === team.id ? 'scale-105' : ''}
                                            `}
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
                                        </div>
                                    ))}
                                </div>

                                <div className='flex justify-center'>
                                    <button
                                        disabled={!selectedClub}
                                        onClick={handleConfirm}
                                        className={`
                                            px-20 py-2 rounded-full text-white font-bold text-lg cursor-pointer border-2 border-amber-400
                                            transition-all duration-300 transform hover:scale-105
                                            ${selectedClub
                                                ? 'bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg hover:shadow-green-500/50'
                                                : 'bg-gray-600 cursor-not-allowed opacity-50'
                                            }
                                        `}
                                    >
                                        CONFIRM
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