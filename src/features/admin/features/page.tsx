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

  useEffect(() => {
    if (!socket) return;

    const onMessage = ({ data }: MessageEvent) => {
      const parsed = parse<any>(data)

      const event = parsed.event;
      if (event === "experience_started") setPhase("speed_question")
      if (event === "choosing_clubs") setPhase('choosing_clubs');
      if (event === "start_main_questions") setPhase('main_questions');
    }

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);

  }, [socket, setPhase]);

  useEffect(() => {
    console.log("phase", phase)
  }, [phase]);

  return (
    <div className="w-full h-screen bg-black">
      <AnimatePresence mode="wait">
        {phase === "start_experience" && (
          <StartExperince key="start_experience" />
        )}
        {/* {phase === "intro" && <Welcome key="welcome" />} */}
        {phase === "speed_question" && <SpeedQuestion key="speed_question" />}
        {phase === "choosing_clubs" && (
          <ChoosingClub key="choosing_clubs" />
        )}
        {/* {phase === "choosing_clubs" && <ChoosingClub />} */}
        {phase === "main_questions" && <AdminMainQuestions />}
      </AnimatePresence>
    </div>
  );
}
