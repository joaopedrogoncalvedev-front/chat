import React, { createContext, useContext, useState, ReactNode } from "react";

// Interface com os campos que você quer manter no contexto
interface Contato {
  username: string;
  nome_completo: string;
  id: number;
}

// Tipo do contexto
interface ContatoSelecionadoContextType {
  contatoSelecionado: Contato | null;
  setContatoSelecionado: (contatoCompleto: any) => void;
}

// Criação do contexto
const ContatoSelecionadoContext = createContext<ContatoSelecionadoContextType | undefined>(undefined);

// Provider
export function ContatoSelecionadoProvider({ children }: { children: ReactNode }) {
  const [contatoSelecionado, setContato] = useState<Contato | null>();

  // Função para filtrar os dados recebidos
  const setContatoSelecionado = (contatoCompleto: any) => {
    if (contatoCompleto && contatoCompleto.username && contatoCompleto.nome_completo && contatoCompleto.id) {
      const { username, nome_completo, id } = contatoCompleto;
      setContato({ username, nome_completo, id });
    } else {
      // opcional: trata se o objeto não tiver os campos esperados
      setContato(null);
    }
  };

  return (
    <ContatoSelecionadoContext.Provider value={{ contatoSelecionado, setContatoSelecionado }}>
      {children}
    </ContatoSelecionadoContext.Provider>
  );
}

// Hook personalizado
export function useContato() {
  const context = useContext(ContatoSelecionadoContext);
  if (!context) {
    throw new Error("useContato deve ser usado dentro de um ContatoSelecionadoProvider");
  }
  return context;
}
