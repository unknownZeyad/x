'use client'
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

const Context = createContext<{
  socket: WebSocket | null
}>({
  socket: null
});

export const useTeamSocket = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useTeamSocket must be used within a TeamSocketProvider");
  }
  return context;
};

export default function TeamSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { team: teamId } = useParams<{ team: string }>();
  const [socket, setSocket] = useState<null | WebSocket>(null);

  useLayoutEffect(() => {
    setSocket(new WebSocket(
      `ws://localhost:3000?team_name=${teamId}&app_name=c3g`
    ))

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, []);


  return (
    <Context.Provider value={{ socket }}>
      {children}
    </Context.Provider>
  );
}
