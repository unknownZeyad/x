import EnterExit from "@/core/components/derived/enter-exit";
import GameButton from "@/core/components/derived/game-button";
import ContentLayout from "@/core/components/layout/content-layout";
import {
  PhaseCard,
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";
import {
  AdminTeamInfo,
  useAdminData,
} from "../../providers/admin-data-provider";
import { TeamLogo } from "@/core/components/ui/team-logo";
import { useAdminSocket } from "../../providers/admin-socket-provider";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAdminPhases } from "../../providers/admin-phases-provider";
import { motion } from "motion/react";
import { useAudio } from "@/core/providers/audio-provider";
import person from '@public/assets/images/person.png'

export function ChoosingClub() {
  const { team1, team2 } = useAdminData();
  const { socket } = useAdminSocket();
  const { setPhase } = useAdminPhases();
  const { playAudio, stopAudio } = useAudio()

  useLayoutEffect(() => {
    playAudio('/assets/audios/Team Selection/Team Name Selection.mp3')
  }, []);

  useLayoutEffect(() => {
    if (!socket) return;
  }, [socket]);

  function handleNext() {
    socket?.send(
      JSON.stringify({
        event: "start_main_questions",
      })
    );
    setPhase("main_questions");
    stopAudio()
  }
  const [clubs, setClubs] = useState<{
    team1: Club | null,
    team2: Club | null
  } | null>(null)

  useEffect(() => {
    socket?.addEventListener('message', (msg) => {
      const parsed = JSON.parse(msg.data) as ServerAdminMessage;
      if (parsed.event === 'view_all_choosen_clubs') {
        setClubs({
          team1: parsed.data.team1_club,
          team2: parsed.data.team2_club
        });
      }
    });
  }, [socket]);

  useEffect(() => {
    console.log("clubs ", clubs?.team1?.name)
  }, [clubs])

  return (
    <EnterExit>
      <ContentLayout personSrc={person.src}>
        <div className="flex flex-col items-end gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
          >
            <PhaseCard>
              <PhaseCardHeader className="flex items-center justify-center">
                <motion.h1
                  className="text-4xl font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 150, delay: 0.5 }}
                >
                  CHOOSING CLUBS
                </motion.h1>
              </PhaseCardHeader>
              <PhaseCardContent className="flex gap-6 items-center justify-evenly">
                <TeamCard team={team1} index={0} confirmedClub={clubs?.team1} />
                <motion.div
                  className="h-2/5 rounded-full w-1 bg-yellow-500"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
                />
                <TeamCard team={team2} index={1} confirmedClub={clubs?.team2} />
              </PhaseCardContent>
              <PhaseCardFooter></PhaseCardFooter>
            </PhaseCard>
          </motion.div>

          {
            clubs &&
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 120, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GameButton
                className="h-10 text-xl px-24 py-0 font-extrabold"
                onClick={handleNext}
              >
                NEXT
              </GameButton>
            </motion.div>
          }
        </div>
      </ContentLayout>
    </EnterExit>
  );
}

function TeamCard({ team, index, confirmedClub }: { team: AdminTeamInfo; index: number; confirmedClub?: Club | null }) {
  const isLeft = index === 0;

  const clubToShow = confirmedClub || team.club;

  if (!clubToShow) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-amber-400 text-lg font-semibold"
      >
        Choosing a club...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col w-1/6 space-y-4 items-center"
      initial={{ opacity: 0, x: isLeft ? -80 : 80, scale: 0.5, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 12,
        delay: 0.6 + index * 0.2
      }}
      whileHover={{
        scale: 1.08,
        transition: { type: 'spring', stiffness: 300 }
      }}
    >
      <motion.div
        initial={{ rotate: isLeft ? -10 : 10 }}
        animate={{ rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.8 + index * 0.2 }}
      >
        <TeamLogo name={clubToShow.name} src={clubToShow.name_img_url} />
      </motion.div>
      <motion.img
        className="rounded-4xl shadow-xl"
        src={clubToShow.logo_img_url}
        alt=""
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.9 + index * 0.2 }}
        whileHover={{
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
          transition: { duration: 0.2 }
        }}
      />
    </motion.div>
  );
}
