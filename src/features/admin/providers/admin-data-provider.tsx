import { parse } from "@/core/lib/utils";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useAdminSocket } from "./admin-socket-provider";

export type AdminTeamInfo = {
  club: Club | null;
};

type ContextData = {
  team1: AdminTeamInfo;
  team2: AdminTeamInfo;
  currentQuestion: { club: Club; question: MainQuestion; score: number } | null;
  answerResult: MainQuestionAnswerResult | null;
};

const Context = createContext<ContextData>({
  team1: { club: null },
  team2: { club: null },
  currentQuestion: null,
  answerResult: null,
});

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useAdminSocket();
  const [team1Club, setTeam1Club] = useState<Club | null>(null);
  const [team2Club, setTeam2Club] = useState<Club | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<
    ContextData["currentQuestion"] | null
  >(null);
  const [answerResult, setAnswerResult] =
    useState<MainQuestionAnswerResult | null>(null);

  const values = useMemo((): ContextData => {
    return {
      team1: { club: team1Club },
      team2: { club: team2Club },
      currentQuestion: currentQuestion,
      answerResult: answerResult,
    };
  }, [team1Club, team2Club, currentQuestion, answerResult]);

  useLayoutEffect(() => {
    if (!socket) return;

    function onMessage({ data }: MessageEvent) {
      const parsed = parse<ServerAdminMessage>(data);

      if (parsed.event === "view_all_choosen_clubs") {
        setTeam1Club(parsed.data.team1_club);
        setTeam2Club(parsed.data.team2_club);
      }

      if (parsed.event === "choosen_main_question") {
        setCurrentQuestion(parsed.data);
        setAnswerResult(null);
      }

      if (parsed.event === "main_question_answer_result") {
        console.log("answer result", parsed.data);
        setAnswerResult(parsed.data);
      }
    }

    socket.addEventListener("message", onMessage);

    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useAdminData() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
