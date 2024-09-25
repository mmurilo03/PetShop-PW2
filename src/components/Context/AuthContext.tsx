import { createContext } from "react";
import Cookies from "universal-cookie";

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

export const getUser = () => {
    const cookie = new Cookies();
    return cookie.get("user") as User;
}