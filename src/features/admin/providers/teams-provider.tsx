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
};

const Context = createContext<ContextData>({
  team1: { club: null },
  team2: { club: null },
});

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useAdminSocket();
  const [team1Club, setTeam1Club] = useState<Club | null>(null);
  const [team2Club, setTeam2Club] = useState<Club | null>(null);

  const values = useMemo((): ContextData => {
    return {
      team1: { club: team1Club },
      team2: { club: team2Club },
    };
  }, [team1Club, team2Club]);

  useLayoutEffect(() => {
    if (!socket) return;

    function onMessage({ data }: MessageEvent) {
      const parsed = parse<ServerAdminMessage>(data);

      if (parsed.event === "view_all_choosen_clubs") {
        setTeam1Club(parsed.data.team1_club);
        setTeam2Club(parsed.data.team2_club);
      }
    }

    socket.addEventListener("message", onMessage);

    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useTeams() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useTeams must be used within an TeamsProvider");
  }
  return context;
}
