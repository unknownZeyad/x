"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

const Context = createContext<{
    socket: WebSocket | null;
}>({
    socket: null!
});

export const useAdminSocket = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useAdminSocket must be used within an AdminSocketProvider");
    }
    return context;
};

export default function AdminSocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [socket, setSocket] = useState<null | WebSocket>(null);

    useLayoutEffect(() => {
        setSocket(new WebSocket(
            `ws://localhost:3000?role=admin&app_name=c3g`
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
