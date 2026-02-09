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
              <div className="py-8 space-y-10 bg-black/50 px-16">
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
                      onAnswer={() => {
                        setAnswered(true);
                      }}
                    />
                  ))}
                </div>
              </div>

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
                    300
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
