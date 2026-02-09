"use client";

import { ReactNode } from "react";
import AdminSocketProvider from "./admin-socket-provider";
import AdminPhasesProvider from "./admin-phases-provider";

function AdminProviders({ children }: { readonly children: ReactNode }) {
    return (
        <AdminSocketProvider>
            <AdminPhasesProvider>
                {children}
            </AdminPhasesProvider>
        </AdminSocketProvider>
    );
}

export default AdminProviders;
