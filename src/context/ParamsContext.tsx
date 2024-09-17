"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type ParamsContextType = {
  message: string;
  setMessage: (value: string) => void;
};

const ParamsContext = createContext<ParamsContextType | undefined>(undefined);

export function ParamsProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string>("");

  return (
    <ParamsContext.Provider value={{ message, setMessage }}>
      {children}
    </ParamsContext.Provider>
  );
}

export function useParamsContext() {
  const context = useContext(ParamsContext);
  if (context === undefined) {
    throw new Error("useParamsContext must be used within a ParamsProvider");
  }
  return context;
}
