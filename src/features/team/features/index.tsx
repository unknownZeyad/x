"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useTeamSocket } from "../providers/socket-provider";
import { useTeamPhases } from "../providers/phases-provider";
import Wating from "./wating/wating";
import Welcomes from "./welcomes/welcomes";
import ChooseClubs from "./choose-clubs/page";
import { parse } from "@/core/lib/utils";
import SpeedQuestion from "@/features/admin/features/speed-question/speed-question";
import EnterExit from "@/core/components/derived/enter-exit";
import SpeedCard from "@/core/components/derived/speed-card";

export default function Team() {
    const [question, setQuestion] = useState<SpeedQuestion | null>(null)
    const [deliveryDate, setDeliveryDate] = useState<number>(0)
    const { phase, setPhase } = useTeamPhases();
    const { socket } = useTeamSocket();

    useEffect(() => {
        socket?.addEventListener('message', ({ data }) => {
            const parsed = parse<ServerTeamMessage>(data)
            if (parsed.event === 'experience_started')
                setPhase('welcome')
            if (parsed.event === 'view_speed_question') {
                setPhase('speed_question')
                setQuestion(parsed.data.question)
                setDeliveryDate(parsed.data.date)
            }
        })
    }, [socket])

    return (
        <div className="w-full h-screen bg-black">
            <AnimatePresence mode="wait">
                {phase === "wating" && <Wating key="wating" />}
                {phase === "welcome" && <Welcomes key="welcomes" />}
                {(phase === "speed_question" && question) && (
                    <EnterExit key='speed_question'>
                        <SpeedCard
                            deliveryDate={deliveryDate}
                            answers={question!.answers}
                            question={question!.question}
                            interactive={false}
                        />
                    </EnterExit>
                )}
                {phase === "choose_clubs" && <ChooseClubs key="choose-clubs" />}
            </AnimatePresence>
        </div>
    );
}
