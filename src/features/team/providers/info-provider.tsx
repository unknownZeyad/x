import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { useTeamSocket } from "./socket-provider";
import { parse } from "@/core/lib/utils";
import { useTeamPhases } from "./phases-provider";

type TeamInfo = {
  score: number;
  won_phase1: boolean;
  used_magic_card: boolean;
  name: string;
  choosen_club: Club | null;
  main_question: {
    hold: boolean;
    questions: MainQuestion[];
  } | null;
  winnerDecided: boolean;
};

const Context = createContext<{
  setTeamInfo: React.Dispatch<React.SetStateAction<TeamInfo>>;
  teamInfo: TeamInfo;
}>({
  setTeamInfo: () => {},
  teamInfo: null!,
});

export const useTeamInfo = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useGamePhases must be used within a GamePhasesProvider");
  }
  return context;
};

export default function TeamInfoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useTeamSocket();
  const { setPhase } = useTeamPhases();
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    choosen_club: null,
    name: "",
    score: 0,
    used_magic_card: false,
    won_phase1: false,
    main_question: null,
    winnerDecided: false,
  });

  const { team: teamId } = useParams<{ team: string }>();

  useLayoutEffect(() => {
    if (!socket) return;

    const onMessage = ({ data }: MessageEvent) => {
      const parsed = parse<any>(data);

      // Handle the specific 'your_team' event
      if (parsed.event === "your_team") {
        setTeamInfo((prev) => ({ ...prev, ...parsed.data }));
      }

      // Handle full state updates
      if (parsed.team1 && parsed.team2) {
        if (teamId === "team1") {
          setTeamInfo((prev) => ({ ...prev, ...parsed.team1 }));
        } else if (teamId === "team2") {
          setTeamInfo((prev) => ({ ...prev, ...parsed.team2 }));
        }
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket, teamId]);

  useLayoutEffect(() => {
    if (!socket) return;

    const onMessage = ({ data }: MessageEvent) => {
      const parsed = parse<ServerTeamMessage>(data);
      if (parsed.event === "list_main_questions") {
        setTeamInfo((prev) => ({ ...prev, main_question: parsed.data }));
        setPhase("main_questions");
      }

      if (parsed.event === "unhold_choosing_main_question") {
        setTeamInfo((prev) => {
          if (prev.winnerDecided) return prev;
          return {
            ...prev,
            main_question: prev.main_question
              ? { ...prev.main_question, hold: false }
              : null,
          };
        });
      }

      if (parsed.event === "winner") {
        setTeamInfo((prev) => ({
          ...prev,
          winnerDecided: true,
          main_question: prev.main_question
            ? { ...prev.main_question, hold: true }
            : null,
        }));
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  return (
    <Context.Provider value={{ setTeamInfo, teamInfo }}>
      {children}
    </Context.Provider>
  );
}
