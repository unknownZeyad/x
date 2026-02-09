"use client";

import { ReactNode } from "react";
import AdminSocketProvider from "./admin-socket-provider";
import AdminPhasesProvider from "./admin-phases-provider";
import { TeamsProvider } from "./teams-provider";

function AdminProviders({ children }: { readonly children: ReactNode }) {
  return (
    <AdminSocketProvider>
      <AdminPhasesProvider>
        <TeamsProvider>{children}</TeamsProvider>
      </AdminPhasesProvider>
    </AdminSocketProvider>
  );
}

export default AdminProviders;
