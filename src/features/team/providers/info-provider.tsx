
import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";
import { useTeamSocket } from "./socket-provider";
import { parse } from "@/core/lib/utils";

type TeamInfo = {
  score: number,
  won_phase1: boolean,
  used_magic_card: boolean,
  name: string,
  choosen_club: Club | null
}

const Context = createContext<{
  setTeamInfo: React.Dispatch<React.SetStateAction<TeamInfo>>;
  teamInfo: TeamInfo,
}>({
  setTeamInfo: () => { },
  teamInfo: null!
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
  const { socket } = useTeamSocket()
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    choosen_club: null,
    name: '',
    score: 0,
    used_magic_card: false,
    won_phase1: false
  });

  useLayoutEffect(() => {
    socket?.addEventListener('message', ({ data }) => {
      const parsed = parse<ServerTeamMessage>(data)
      if (parsed.event === 'your_team') {
        setTeamInfo(parsed.data)
      }
    })
  }, [socket])

  return (
    <Context.Provider value={{ setTeamInfo, teamInfo }}>
      {children}
    </Context.Provider>
  );
}
