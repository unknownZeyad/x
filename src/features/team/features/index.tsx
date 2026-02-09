"use client";

import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { useTeamSocket } from "../providers/socket-provider";
import { useTeamPhases } from "../providers/phases-provider";
import Wating from "./wating/wating";
import Welcomes from "./welcomes/welcomes";
import { parse } from "@/core/lib/utils";

export default function Team() {
    const { phase, setPhase } = useTeamPhases();
    const { socket } = useTeamSocket();

    useEffect(() => {
        socket?.addEventListener('message', ({ data }) => {
            const parsed = parse<ServerTeamMessage>(data)
            if (parsed.event === 'experience_started')
                setPhase('welcome')
            if(parsed.event === 'view_speed_question')
                setPhase('speed_question')
        })
    }, [socket])

    return (
        <div className="w-full h-screen bg-black">
            <AnimatePresence mode="wait">
                {phase === "wating" && <Wating key="wating" />}
                {phase === "welcome" && <Welcomes key="welcomes" />}
                {/* {phase === "speed_question" && <SpeedQuestion key="speed-question" />} */}
            </AnimatePresence>
        </div>
    );
}
