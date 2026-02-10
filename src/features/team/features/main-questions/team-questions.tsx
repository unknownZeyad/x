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
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/core/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { useTeamInfo } from "../../providers/info-provider";
import { useTeamSocket } from "../../providers/socket-provider";
import { HoldDialog } from "./hold-dialog";
import { parse } from "@/core/lib/utils";

export function TeamMainQuestions() {
  const { teamInfo, setTeamInfo } = useTeamInfo();
  const { main_question } = teamInfo;
  const { socket } = useTeamSocket();
  const [magicCardUsed, setMagicCardUsed] = useState(false);

  const [questions, setQuestions] = useState(() => {
    return (
      main_question?.questions.map((question) => ({
        ...question,
        selectedAnswerId: null as number | null,
        hasTimedOut: false,
        chosen: false,
        isMagicCardQuestion: false,
      })) ?? []
    );
  });
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    questions.at(0)?.id ?? null
  );

  const currentQuestion = useMemo(() => {
    return (
      questions.find((question) => question.id === currentQuestionId) ?? null
    );
  }, [questions, currentQuestionId]);
  console.log(currentQuestionId, currentQuestion);

  function holdMainQuestion() {
    setTeamInfo((prev) => {
      return {
        ...prev,
        main_question: prev.main_question
          ? { ...prev.main_question, hold: true }
          : null,
      };
    });
  }

  function handleAnswer(answerId: number) {
    if (main_question?.hold) return;
    if (!currentQuestion) throw new Error("Current question not found");

    holdMainQuestion();

    setQuestions((prev) => {
      return prev.map((question) => {
        if (question.id === currentQuestion.id) {
          return { ...question, selectedAnswerId: answerId };
        }
        return question;
      });
    });

    socket?.send(
      JSON.stringify({
        event: "answer_main_question",
        data: {
          question_id: currentQuestion.id,
          answer_id: answerId,
          use_magic_card: currentQuestion.isMagicCardQuestion,
        },
      })
    );

    const isCorrect = currentQuestion.answers.find(
      (answer) => answer.id === answerId
    )?.is_correct;

    if (isCorrect === undefined) throw new Error("Answer not found");

    setTeamInfo((prev) => {
      return {
        ...prev,
        score: isCorrect
          ? prev.score + currentQuestion.points
          : prev.score - currentQuestion.points,
      };
    });
  }

  const handleQuestionChange = useCallback(
    (questionId: number) => {
      if (main_question?.hold) return;

      setCurrentQuestionId(questionId);
      setQuestions((prev) => {
        return prev.map((question) => {
          if (question.id === questionId) {
            return { ...question, chosen: true };
          }
          return question;
        });
      });

      socket?.send(
        JSON.stringify({
          event: "choose_main_question",
          data: {
            question_id: questionId,
            use_magic_card: false,
          },
        })
      );
    },
    [main_question?.hold, socket]
  );

  function handleTimedOut() {
    if (currentQuestion?.selectedAnswerId) return;

    holdMainQuestion();
    setQuestions((prev) => {
      return prev.map((question) => {
        if (question.id === currentQuestion?.id) {
          return { ...question, hasTimedOut: true };
        }
        return question;
      });
    });
  }

  function handleMagicCard() {
    if (magicCardUsed) return;
    if (currentQuestion?.hasTimedOut) return;
    if (!!currentQuestion?.selectedAnswerId) return;
    if (main_question?.hold) return;

    setMagicCardUsed(true);

    socket?.send(
      JSON.stringify({
        event: "choose_main_question",
        data: {
          question_id: currentQuestion?.id,
          use_magic_card: true,
        },
      })
    );
  }

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = parse<ServerTeamMessage>(event.data);
      console.log("RECEIVED MESSAGE", data);
      if (data.event === "magic_card_question") {
        setQuestions((prev) => {
          return prev.map((question) => {
            if (question.id === currentQuestion?.id) {
              return {
                ...question,
                ...data.data.question,
                isMagicCardQuestion: true,
              };
            }
            return question;
          });
        });
      }
    }

    socket?.addEventListener("message", onMessage);

    return () => {
      socket?.removeEventListener("message", onMessage);
    };
  }, [socket, currentQuestion?.id]);

  useEffect(() => {
    if (!main_question || !currentQuestion) return;

    if (main_question.hold || currentQuestion.chosen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleQuestionChange(currentQuestion.id);
  }, [currentQuestion, main_question, handleQuestionChange]);

  const canScroll = useMemo(() => {
    if (!main_question || !currentQuestion) return false;

    if (main_question.hold) return false;
    if (teamInfo.winnerDecided) return false;
    if (currentQuestion.hasTimedOut) return true;
    if (currentQuestion.selectedAnswerId !== null) return true;

    return false;
  }, [currentQuestion, main_question, teamInfo.winnerDecided]);

  const answers = currentQuestion?.answers ?? [];
  const answered = !!currentQuestion?.selectedAnswerId;
  const timedOut = currentQuestion?.hasTimedOut ?? false;
  const chosen = currentQuestion?.chosen ?? false;

  return (
    <EnterExit>
      {main_question?.hold && <HoldDialog />}
      <ContentLayout personSrc="/assets/images/person.png">
        <div className="flex flex-col items-end gap-4">
          <PhaseCard>
            <PhaseCardHeader className="flex items-center justify-between">
              <TeamLogo
                src={teamInfo.choosen_club?.img_url ?? ""}
                name={teamInfo.choosen_club?.name ?? ""}
                className="text-black flex-1"
              />
              <div className="flex items-end">
                <Score score={teamInfo.score} className="text-shadow-sm" />
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
                  className={cn(
                    "w-48 object-contain aspect-square border-2 border-amber-500 overflow-hidden shadow-2xl shadow-amber-500/30 hover:cursor-pointer hover:scale-105 transition-all duration-300",
                    magicCardUsed
                      ? "opacity-50 pointer-events-none"
                      : "opacity-100",
                    canScroll && "pointer-events-none opacity-50"
                  )}
                  src="/assets/images/magic-card.webp"
                  alt=""
                  onClick={handleMagicCard}
                />
                <QuestionsCarousel
                  onQuestionChange={handleQuestionChange}
                  canScroll={canScroll}
                />
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
                  <h1 className="text-3xl font-bold text-center uppercase">
                    {currentQuestion?.question}
                  </h1>
                  <div className="size-24 shrink-0">
                    <CountdownTimer
                      key={currentQuestion?.id}
                      initialSeconds={timedOut ? 0 : 60}
                      paused={
                        answered || timedOut || !chosen || main_question?.hold
                      }
                      onComplete={handleTimedOut}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 gap-x-20 w-6/8 mx-auto">
                  {answers.map((answer) => (
                    <Answer
                      key={`current-question-${currentQuestion?.id}-answer-${answer.id}`}
                      answer={answer}
                      hasTimedOut={currentQuestion?.hasTimedOut ?? false}
                      selectedAnswerId={
                        currentQuestion?.selectedAnswerId ?? null
                      }
                      disabled={!!currentQuestion?.selectedAnswerId}
                      onAnswer={handleAnswer}
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

type QuestionsCarouselProps = {
  onQuestionChange: (questionId: number) => void;
  canScroll: boolean;
};

function QuestionsCarousel({
  onQuestionChange,
  canScroll,
}: QuestionsCarouselProps) {
  const { teamInfo } = useTeamInfo();
  const { main_question } = teamInfo;
  const [currentQuestion, setCurrentQuestion] = useState<MainQuestion | null>(
    main_question?.questions[0] || null
  );

  const [carouselCanScroll, setCarouselCanScroll] = useState<{
    prev: boolean;
    next: boolean;
  }>({
    prev: false,
    next: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    watchDrag: false,
  });

  function handleScroll() {
    if (!emblaApi) return;

    setCarouselCanScroll({
      prev: emblaApi.canScrollPrev(),
      next: emblaApi.canScrollNext(),
    });
  }

  function handlePrevious() {
    if (!emblaApi?.canScrollNext() || !canScroll) return;

    emblaApi.scrollPrev();
    handleScroll();

    const currentIndex = main_question?.questions.findIndex(
      (question) => question.id === currentQuestion?.id
    );
    if (currentIndex === undefined)
      throw new Error("Current question not found");

    const previousQuestion = main_question?.questions[currentIndex - 1];
    if (!previousQuestion) throw new Error("Previous question not found");

    setCurrentQuestion(previousQuestion);
    onQuestionChange(previousQuestion.id);
  }

  function handleNext() {
    if (!emblaApi?.canScrollNext() || !canScroll) return;
    emblaApi.scrollNext();
    handleScroll();

    const currentIndex = main_question?.questions.findIndex(
      (question) => question.id === currentQuestion?.id
    );
    if (currentIndex === undefined)
      throw new Error("Current question not found");

    const nextQuestion = main_question?.questions[currentIndex + 1];
    if (!nextQuestion) throw new Error("Next question not found");

    setCurrentQuestion(nextQuestion);
    onQuestionChange(nextQuestion.id);
  }

  if (!main_question) return null;

  return (
    <div className="bg-black/50 flex-1 flex items-center justify-between px-10 gap-10">
      <img
        src="/assets/images/icons/chevron.webp"
        className={cn(
          "size-20 object-contain hover:cursor-pointer hover:scale-110 transition-all duration-300",
          carouselCanScroll.prev ? "opacity-100" : "opacity-50"
        )}
        alt=""
        onClick={handlePrevious}
      />
      <div ref={emblaRef} className="flex-1 overflow-hidden">
        <div className="flex items-center">
          {main_question.questions.map((question) => (
            <div className="flex-1/4 shrink-0" key={question.id}>
              <img
                key={question.id}
                className="w-40 object-contain overflow-hidden aspect-square"
                src={question.img_url}
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
          carouselCanScroll.next ? "opacity-100" : "opacity-50"
        )}
        alt=""
        onClick={handleNext}
      />
    </div>
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
