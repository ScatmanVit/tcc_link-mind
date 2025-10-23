import React, { createContext, useState } from "react";


type User = {
    name: string;
    email: string;
    idUser: string;
    access_token_prov: string; // TOKEN SENDO GUARDADO AQUI PORQUE NÃO DA PARA USAR O SECURE STORE EMULANDO NA WEB
    status?: string;
};

type AuthContextType = {
    user: User | null;
    signUp: (data: User) => void;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    signUp: () => { },
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    function signUp(data: User) {
        setUser(data);
    }

    return (
        <AuthContext.Provider value={{ user, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}
