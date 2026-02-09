"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTeamSocket } from "../providers/socket-provider";
import { useTeamPhases } from "../providers/phases-provider";
import Wating from "./wating/wating";
import Welcomes from "./welcomes/welcomes";
import ChooseClubs from "./choose-clubs/page";
import { parse } from "@/core/lib/utils";
import EnterExit from "@/core/components/derived/enter-exit";
import SpeedCard from "@/core/components/derived/speed-card";
import SpeedQuestion from "./speed-question/speed-question";

export default function Team() {
    const [question, setQuestion] = useState<SpeedQuestion | null>(null)
    const [deliveryDate, setDeliveryDate] = useState<number>(0)
    const [winner, setWinner] = useState<string | null>(null)
    const [clubs, setClubs] = useState<Club[] | null>(null)
    const [hold, setHold] = useState(false)
    const [otherTeamClub, setOtherTeamClub] = useState<number | null>(null)
    const { phase, setPhase } = useTeamPhases();
    const { socket } = useTeamSocket();
    const { team: teamId } = useParams<{ team: string }>();

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
            if (parsed.event === 'speed_question_winner') {
                setWinner(parsed.data.team_name)
            }
            if (parsed.event === 'view_clubs') {
                setPhase('choose_clubs')
                setClubs(parsed.data.clubs)
                setHold(parsed.data.hold)
            }
            if (parsed.event === 'unhold_choosing_club') {
                setOtherTeamClub(parsed.data.choosen_club_id)
                setHold(false)
            }

            if (parsed.team1 && parsed.team2) {
                if (teamId === 'team1') {
                    setOtherTeamClub(parsed.team2.choosen_club?.id || null);
                } else if (teamId === 'team2') {
                    setOtherTeamClub(parsed.team1.choosen_club?.id || null);
                }
            }
        })
    }, [socket, teamId])

    return (
        <div className="w-full h-screen bg-black">
            <AnimatePresence mode="wait">
                {phase === "wating" && <Wating key="wating" />}
                {phase === "welcome" && <Welcomes key="welcomes" />}
                {(phase === "speed_question" && (question)) && <SpeedQuestion winner={winner} key="speed_question" deliveryDate={deliveryDate} answers={question.answers} question={question.question} interactive={true} />}
                {phase === "choose_clubs" && <ChooseClubs key="choose-clubs" hold={hold} otherTeamClub={otherTeamClub} clubs={clubs} />}
            </AnimatePresence>
        </div>
    );
}
