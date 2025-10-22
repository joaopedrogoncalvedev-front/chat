import React, { createContext, useContext, useState, ReactNode } from "react";

// Interface com os campos que você quer manter no contexto
interface userLogado {
   id: number;
}


const UserLogadoContext = createContext<userLogado | undefined>(undefined);

// Provider
export function UserLogadoProvider({ children }: { children: ReactNode }) {
  const [userLogado, setUserLogado] = useState<userLogado | null>();



  return (
    <UserLogadoContext.Provider value={{ userLogado, setUserLogado }}>
      {children}
    </UserLogadoContext.Provider>
  );
}

// Hook personalizado
export function useLogado() {
  const context = useContext(UserLogadoContext);
  if (!context) {
    throw new Error("useContato deve ser usado dentro de um ContatoSelecionadoProvider");
  }
  return context;
}
