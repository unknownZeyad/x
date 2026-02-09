import EnterExit from "@/core/components/derived/enter-exit";
import ContentLayout from "@/core/components/layout/content-layout";
import { Answer } from "@/core/components/ui/answer";
import CountdownTimer from "@/core/components/ui/counter";
import {
  PhaseCard,
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";
import { TeamLogo } from "@/core/components/ui/team-logo";
import { useState } from "react";
import { cn } from "@/core/lib/utils";
import useEmblaCarousel from "embla-carousel-react";

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

const players = [
  {
    id: "1",
    img: "/assets/images/players/1.webp",
  },
  {
    id: "2",
    img: "/assets/images/players/2.webp",
  },
  {
    id: "3",
    img: "/assets/images/players/3.webp",
  },
  {
    id: "4",
    img: "/assets/images/players/4.webp",
  },
  {
    id: "5",
    img: "/assets/images/players/2.webp",
  },
  {
    id: "6",
    img: "/assets/images/players/3.webp",
  },
  {
    id: "7",
    img: "/assets/images/players/4.webp",
  },
];

export function TeamMainQuestions() {
  const [answered, setAnswered] = useState<boolean>(false);
  const [canScroll, setCanScroll] = useState<{ prev: boolean; next: boolean }>({
    prev: false,
    next: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    watchDrag: false,
  });

  function handleScroll() {
    if (!emblaApi) return;

    console.log("SCROLLED");

    console.log(emblaApi.canScrollPrev(), emblaApi.canScrollNext());

    setCanScroll({
      prev: emblaApi.canScrollPrev(),
      next: emblaApi.canScrollNext(),
    });
  }

  function handleNext() {
    emblaApi?.scrollNext();
    handleScroll();
  }

  function handlePrevious() {
    emblaApi?.scrollPrev();
    handleScroll();
  }

  return (
    <EnterExit>
      <ContentLayout>
        <div className="flex flex-col items-end gap-4">
          <PhaseCard>
            <PhaseCardHeader className="flex items-center justify-between">
              <TeamLogo
                src="/assets/images/barcelona-small-logo.webp"
                name="Barcelona"
                className="text-black flex-1"
              />
              <div className="flex items-end">
                <Score score={300} className="text-shadow-sm" />
                <span className="text-sm font-bold">POINTS</span>
              </div>
              <div className="flex-1"></div>
            </PhaseCardHeader>
            <PhaseCardContent
              className="space-y-3 relative"
              imageProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "bg-transparent",
              }}
            >
              <div className="mt-3 flex gap-3">
                <img
                  className="w-48 object-contain aspect-square overflow-hidden"
                  src="/assets/images/magic-card.webp"
                  alt=""
                />
                <div className="bg-black/50 flex-1 flex items-center justify-between px-10 gap-10">
                  <img
                    src="/assets/images/icons/chevron.webp"
                    className={cn(
                      "size-20 object-contain hover:cursor-pointer hover:scale-110 transition-all duration-300",
                      canScroll.prev ? "opacity-100" : "opacity-50"
                    )}
                    alt=""
                    onClick={handlePrevious}
                  />
                  <div ref={emblaRef} className="flex-1 overflow-hidden">
                    <div className="flex items-center">
                      {players.map((player) => (
                        <div className="flex-1/4 shrink-0" key={player.id}>
                          <img
                            key={player.id}
                            className="w-40 object-contain overflow-hidden aspect-square"
                            src={player.img}
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <img
                    src="/assets/images/icons/chevron.webp"
                    className={cn(
                      "size-20 object-contain rotate-180 hover:cursor-pointer hover:scale-110 transition-all duration-300",
                      canScroll.next ? "opacity-100" : "opacity-50"
                    )}
                    alt=""
                    onClick={handleNext}
                  />
                </div>
              </div>

              <div className="space-y-10 bg-black/50 border-l px-16 border-yellow-500 py-8 border-r border-t">
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
            </PhaseCardContent>
            <PhaseCardFooter />
          </PhaseCard>
        </div>
      </ContentLayout>
    </EnterExit>
  );
}

type ScoreProps = {
  score: number;
} & React.ComponentProps<"div">;

function Score({ score, className, ...props }: ScoreProps) {
  return (
    <div
      className={cn(
        "text-7xl px-5 font-bold italic bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300 text-transparent bg-clip-text",
        className
      )}
      {...props}
    >
      {score}
    </div>
  );
}
