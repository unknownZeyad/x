"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAdminPhases } from "@/features/admin/providers/admin-phases-provider";
import Welcome from "@/features/admin/features/welcome/welcome";
import StartExperince from "./start-experience/start-experience";
import { useEffect } from "react";
import { useAdminSocket } from "../providers/admin-socket-provider";
import { parse } from "@/core/lib/utils";
import SpeedQuestion from "./speed-question/speed-question";

export default function Admin() {
  const { phase, setPhase } = useAdminPhases();
  const { socket } = useAdminSocket()

  useEffect(() => {
    socket?.addEventListener('message', ({ data }) => {
      const parsed = parse<ServerAdminMessage>(data)
      if (parsed.event === 'experience_started')
        setPhase('intro')
    })
  }, [socket])

  return (
    <div className="w-full h-screen bg-black">
      <AnimatePresence mode="wait">
        {phase === "start_experience" && (
          <StartExperince key="start_experience" />
        )}
        {phase === "intro" && <Welcome key="welcome" />}
        {phase === "speed_question" && (
          <SpeedQuestion key="speed_question" />
        )}

      </AnimatePresence>
    </div>
  );
}
