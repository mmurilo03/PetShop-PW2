import { createContext } from "react";

interface CardTypes {
    cardTypes: string
}

const cards: CardTypes = { cardTypes: "Atendimentos"}

export const CardContext = createContext(cards);