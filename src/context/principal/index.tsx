
import React , {createContext, useContext, useState, ReactNode} from "react";

interface PrincipalContextType {
    principalAbertoFechado: boolean;
    setPrincipalAbertoFechado: (principal: boolean) => void;
}

const PrincipalContext = createContext<PrincipalContextType | undefined>(undefined);

export function PrincipalProvider({ children }: { children: ReactNode }) {
    const [principalAbertoFechado, setPrincipalAbertoFechado] = useState(false);

    return (
        <PrincipalContext.Provider value={{ principalAbertoFechado, setPrincipalAbertoFechado }}>
            {children}
        </PrincipalContext.Provider>
    );
}

export function usePrincipal() {
    const context = useContext(PrincipalContext);
    if (!context) {
        throw new Error("usePrincipal must be used within a PrincipalProvider");
    }   
    return context;
}