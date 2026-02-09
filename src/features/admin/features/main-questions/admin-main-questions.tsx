import EnterExit from "@/core/components/derived/enter-exit";
import {
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";
import ContentLayout from "@/core/components/layout/content-layout";
import { PhaseCard } from "@/core/components/ui/phase-card";
import { useState } from "react";
import { Answer } from "@/core/components/ui/answer";
import CountdownTimer from "@/core/components/ui/counter";
import { TeamLogo } from "@/core/components/ui/team-logo";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

const dummyAnswers = [
  {
    id: "A",
    answer: "Blood transfusion",
    isCorrect: true,
  },
  {
    id: "B",
    answer: "Hormone replacement therapy",
    isCorrect: false,
  },
  {
    id: "C",
    answer: "Genetic engineering",
    isCorrect: false,
  },
  {
    id: "D",
    answer: "Gene therapy",
    isCorrect: false,
  },
];

export function AdminMainQuestions() {
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(300);
  const scoreChange = isCorrect ? 250 : -250;

  const handleAnswer = (answerId: string) => {
    const selectedAnswer = dummyAnswers.find((a) => a.id === answerId);
    const correct = selectedAnswer?.isCorrect ?? false;
    setIsCorrect(correct);
    setAnswered(true);
    setScore((prev) => prev + (correct ? 250 : -250));
  };

  return (
    <EnterExit>
      <ContentLayout>
        <div className="flex flex-col items-end gap-4">
          <PhaseCard>
            <PhaseCardHeader
              className="flex items-center justify-center"
              containerProps={{
                className: "h-6 overflow-hidden",
              }}
            />
            <PhaseCardContent
              className="space-y-3 relative"
              imageProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "bg-transparent",
              }}
            >
              <AnimatePresence mode="wait">
                {!answered ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 space-y-10 bg-black/50 px-16"
                  >
                    <div className="flex justify-between gap-6">
                      <div className="size-28 shrink-0">
                        <img
                          className="w-full h-full object-contain"
                          src="/assets/images/icons/golden-trophy.webp"
                          alt=""
                        />
                      </div>
                      <h1 className="text-5xl font-bold text-center uppercase">
                        What is the primary treatment for hemophilia?
                      </h1>
                      <div className="size-24 shrink-0">
                        <CountdownTimer />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 gap-x-20 w-6/8 mx-auto">
                      {dummyAnswers.map((answer) => (
                        <Answer
                          key={answer.id}
                          answer={answer}
                          answered={answered}
                          disabled={answered}
                          onAnswer={handleAnswer}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className=" bg-black/50 px-16 flex items-center justify-center gap-16"
                  >
                    <h1
                      className={`text-8xl font-black italic text-white`}
                    >
                      {isCorrect ? "GOAL!" : "MISS!"}
                    </h1>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-bold text-white">SCORE</div>
                      <div
                        className={`text-7xl px-5 font-bold italic bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300 text-transparent bg-clip-text`}
                      >
                        {isCorrect ? "+" : ""}
                        {scoreChange}
                      </div>
                    </div>
                    <Image
                      src={isCorrect ? "/assets/images/Goal.png" : "/assets/images/missGoal.png"}
                      alt={isCorrect ? "Goal" : "Miss"}
                      width={250}
                      height={350}
                      className="object-contain"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center bg-black/50 px-20 border-l border-yellow-500 py-8 border-r border-t">
                <div className="flex-1">
                  <TeamLogo
                    src="/assets/images/barcelona-small-logo.webp"
                    name="Barcelona"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">SCORE</div>
                  <div className="text-7xl px-5 font-bold italic bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300 text-transparent bg-clip-text">
                    {score}
                  </div>
                  <div className="text-sm font-bold">TOTAL POINTS</div>
                </div>
                <div className="flex-1">
                  <img
                    className="rounded-2xl ml-auto w-40 aspect-4/5"
                    src="/assets/images/barcelona-logo.png"
                    alt="Footer"
                  />
                </div>
              </div>
            </PhaseCardContent>
            <PhaseCardFooter />
          </PhaseCard>
        </div>
      </ContentLayout>
    </EnterExit>
  );
}
