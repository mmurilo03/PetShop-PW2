import { createContext } from "react";

interface FormContextInterface {
    nome?: string
    tutor?: string
    telefone?: string
    endereco?: string
    id?: number
}

const formContext: FormContextInterface = {}

export const FormContext = createContext(formContext);