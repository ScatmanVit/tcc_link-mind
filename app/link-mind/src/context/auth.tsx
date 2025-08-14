import { createContext, useState } from "react";
import { useRouter } from 'expo-router'

type User = {
  name: string,
  email: string,
  status: string
};

type AuthContextType = {
  user?: User | undefined
  signUp: (data: Omit<User, "status">) => void,
  isLogged: (user: Omit<User, "status">) => void
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({children}: any){
   const router = useRouter()
   const [user, setUser] = useState<User>();

   function signUp({ name, email }: Omit<User, "status">){
      if(email && name){
         setUser({
            name: name,
            email: email,
            status: "ATIVO"
         })
         router.push('/auth/login')
      }
   }

   function isLogged(userLogged: Omit<User, "status">) {
      if (!userLogged || !userLogged.email || !userLogged.name) {
         router.push("/auth/register");
         return;
      }
      router.push("/(tabs)/provisional");
   }

   return (
      <AuthContext.Provider value={{signUp, isLogged, user}}>
         {children}
      </AuthContext.Provider>
   )
}
