import { createContext } from "react";

interface User {
    id: number;
    email: string;
    funcao: string;
    imagem: string;
    nome: string;
    telefone: string;
}

const user: User = { email: "", funcao: "", id: 0, imagem: "", nome: "", telefone: ""}

export const AuthContext = createContext(user);