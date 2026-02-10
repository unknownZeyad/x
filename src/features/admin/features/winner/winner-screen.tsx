import { motion } from "motion/react";
import EnterExit from "@/core/components/derived/enter-exit";
import { useAdminData } from "../../providers/admin-data-provider";
import ContentLayout from "@/core/components/layout/content-layout";
import {
  PhaseCard,
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";
import { TeamLogo } from "@/core/components/ui/team-logo";

export function WinnerScreen() {
  const { winner } = useAdminData();
  if (!winner) return null;

  return (
    <EnterExit>
      <ContentLayout backgroundVideoSrc="/assets/videos/FinalWinner.mp4">
        <div className="flex flex-col items-end gap-4">
          <PhaseCard>
            <PhaseCardHeader
              className="flex items-center justify-center"
              containerProps={{
                className: "h-6 overflow-hidden",
              }}
            />
            <PhaseCardContent
              className="space-y-6 relative"
              imageProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "bg-transparent",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-black/50 px-16 py-12 flex flex-col items-center justify-center gap-8"
              >
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-6xl px-10 font-black italic text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-200 to-yellow-400"
                  style={{
                    textShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  WINNER!
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-8"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-xl font-bold">CHAMPION</div>
                    <div className="text-6xl px-5 font-bold italic text-transparent bg-clip-text bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300">
                      {winner.name}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-between items-center bg-black/50 px-20 border-l border-yellow-500 py-10 border-r border-t"
              >
                <div className="flex-1 flex justify-center">
                  <TeamLogo src={winner.club.img_url} name={winner.club.name} />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl font-bold text-white">
                    FINAL SCORE
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    className="text-8xl px-8 font-bold italic text-transparent bg-clip-text bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300"
                  >
                    {winner.score}
                  </motion.div>
                  <div className="text-lg font-bold text-yellow-400">
                    TOTAL POINTS
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <motion.img
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="rounded-2xl w-48 aspect-4/5 object-cover border-4 border-yellow-500 shadow-lg shadow-yellow-500/50"
                    src={winner.club.img_url}
                    alt={winner.club.name}
                  />
                </div>
              </motion.div>
            </PhaseCardContent>
            <PhaseCardFooter />
          </PhaseCard>
        </div>
      </ContentLayout>
    </EnterExit>
  );
}
