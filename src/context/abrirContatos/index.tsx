
import React , {createContext, useContext, useState, ReactNode} from "react";

interface AbreContatosContextType {
    AbreContatosAbertoFechado: boolean;
    setAbreContatosAbertoFechado: (AbreContatos: boolean) => void;
}

const AbreContatosContext = createContext<AbreContatosContextType | undefined>(undefined);

export function AbreContatosProvider({ children }: { children: ReactNode }) {
    const [AbreContatosAbertoFechado, setAbreContatosAbertoFechado] = useState(false);

    return (
        <AbreContatosContext.Provider value={{ AbreContatosAbertoFechado, setAbreContatosAbertoFechado }}>
            {children}
        </AbreContatosContext.Provider>
    );
}

export function useAbreContatos() {
    const context = useContext(AbreContatosContext);
    if (!context) {
        throw new Error("useAbreContatos must be used within a AbreContatosProvider");
    }   
    return context;
}