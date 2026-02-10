"use client";

import { AnimatePresence } from "motion/react";
import { useAdminPhases } from "@/features/admin/providers/admin-phases-provider";
import StartExperince from "./start-experience/start-experience";
import { useEffect } from "react";
import { useAdminSocket } from "../providers/admin-socket-provider";
import { parse } from "@/core/lib/utils";
import SpeedQuestion from "./speed-question/speed-question";
import { AdminMainQuestions } from "./main-questions/admin-main-questions";
import { ChoosingClub } from "./choosing-club/choosing-club";
import { WinnerScreen } from "./winner/winner-screen";

import Welcome from "./welcome/welcome";

export default function Admin() {
  const { phase, setPhase } = useAdminPhases();
  const { socket } = useAdminSocket();

  useEffect(() => {
    if (!socket) return;

    const onMessage = ({ data }: MessageEvent) => {
      const parsed = parse<ServerAdminMessage>(data)

      const event = parsed.event;

      if (event === "experience_started") setPhase("intro")
      if (event === "clubs_chosen") setPhase('choosing_clubs');
      if (event === "view_speed_question") setPhase('speed_question');
      if (event === "choosen_main_question") setPhase('main_questions');
    }

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);

  }, [socket, setPhase]);

  return (
    <div className="w-full h-screen bg-black">
      <AnimatePresence mode="wait">
        {phase === "start_experience" && (
          <StartExperince key="start_experience" />
        )}
        {phase === "intro" && <Welcome key="welcome" />}
        {phase === "speed_question" && <SpeedQuestion key="speed_question" />}
        {phase === "choosing_clubs" && (
          <ChoosingClub key="choosing_clubs" />
        )}
        {phase === "main_questions" && <AdminMainQuestions />}
        {phase === "winner" && <WinnerScreen />}
      </AnimatePresence>
    </div>
  );
}
