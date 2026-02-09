"use client";

import { AnimatePresence } from "motion/react";
import { useAdminPhases } from "@/features/admin/providers/admin-phases-provider";
import StartExperince from "./start-experience/start-experience";
import { useEffect, useState } from "react";
import { useAdminSocket } from "../providers/admin-socket-provider";
import { parse } from "@/core/lib/utils";
import SpeedQuestion from "./speed-question/speed-question";
import ChosenClubs from "./chosen-clubs/chosen-clubs";
import { AdminMainQuestions } from "./main-questions/admin-main-questions";
import { ChoosingClub } from "./choosing-club/choosing-club";

export default function Admin() {
  const { phase, setPhase } = useAdminPhases();
  const { socket } = useAdminSocket();
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    if (!socket) return;

    const onMessage = ({ data }: MessageEvent) => {
      const parsed = parse<any>(data);
      console.log("ADMIN SOCKET MESSAGE RECEIVED:", {
        event: parsed.event,
        hasTeam1: !!parsed.team1,
        hasTeam2: !!parsed.team2,
        team1ClubId: parsed.team1?.choosen_club?.id,
        team2ClubId: parsed.team2?.choosen_club?.id,
      });

      const event = parsed.event;
      if (event === "experience_started") setPhase("speed_question");

      // Capture game state if it looks like the full state (with or without event)
      if (parsed.team1 && parsed.team2) {
        setGameState(parsed);

        // Auto-transition if both have clubs (checking for .id specifically)
        if (parsed.team1.choosen_club?.id && parsed.team2.choosen_club?.id) {
          console.log(
            "DETECTED BOTH CLUBS IN STATE - AUTO-TRANSITIONING TO RESULTS"
          );
          setPhase("chosen_clubs");
        }
      }

      if (event === "clubs_chosen") {
        console.log("EXPLICIT clubs_chosen EVENT RECEIVED");
        setPhase("chosen_clubs");
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket, setPhase]);

  return (
    <div className="w-full h-screen bg-black">
      <AnimatePresence mode="wait">
        {phase === "start_experience" && (
          <StartExperince key="start_experience" />
        )}
        {/* {phase === "intro" && <Welcome key="welcome" />} */}
        {phase === "speed_question" && <SpeedQuestion key="speed_question" />}
        {phase === "chosen_clubs" && (
          <ChosenClubs key="chosen_clubs" state={gameState} />
        )}
        {phase === "choosing_clubs" && <ChoosingClub />}
        {phase === "main_questions" && <AdminMainQuestions />}
      </AnimatePresence>
    </div>
  );
}
