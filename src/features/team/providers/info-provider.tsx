import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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

  const { team: teamId } = useParams<{ team: string }>();

  useLayoutEffect(() => {
    if (!socket) return;

    const onMessage = ({ data }: MessageEvent) => {
      const parsed = parse<any>(data)

      // Handle the specific 'your_team' event
      if (parsed.event === 'your_team') {
        setTeamInfo(parsed.data)
      }

      // Handle full state updates
      if (parsed.team1 && parsed.team2) {
        if (teamId === 'team1') {
          setTeamInfo(parsed.team1);
        } else if (teamId === 'team2') {
          setTeamInfo(parsed.team2);
        }
      }
    };

    socket.addEventListener('message', onMessage);
    return () => socket.removeEventListener('message', onMessage);
  }, [socket, teamId])

  return (
    <Context.Provider value={{ setTeamInfo, teamInfo }}>
      {children}
    </Context.Provider>
  );
}
