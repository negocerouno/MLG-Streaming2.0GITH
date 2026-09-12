import React, { createContext, useContext, useState } from "react";
import { Account, MOCK_ACCOUNTS, MOCK_CLIENTS, Client } from "../lib/mockData";

type DataContextType = {
  accounts: Account[];
  addAccount: (account: Account) => void;
  releaseSlot: (accountId: string, slotId: string) => void;
  assignSlot: (accountId: string, slotId: string, clientId: string, profileName: string, pin?: string) => void;
  clients: Client[];
  updateClient: (updated: Client) => void;
  addClient: (client: Client) => void;
};

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  const addAccount = (account: Account) => {
    setAccounts((prev) => [...prev, account]);
  };

  const releaseSlot = (accountId: string, slotId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        return {
          ...acc,
          slots: acc.slots.map((s) =>
            s.id === slotId
              ? { id: s.id, status: "disponible" as const }
              : s
          ),
        };
      })
    );
  };

  const assignSlot = (accountId: string, slotId: string, clientId: string, profileName: string, pin?: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        return {
          ...acc,
          slots: acc.slots.map((s) =>
            s.id === slotId
              ? { ...s, status: "ocupado" as const, clientId, profileName, pin }
              : s
          ),
        };
      })
    );
  };

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const addClient = (client: Client) => {
    setClients((prev) => [...prev, client]);
  };

  return (
    <DataContext.Provider value={{ accounts, addAccount, releaseSlot, assignSlot, clients, updateClient, addClient }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
