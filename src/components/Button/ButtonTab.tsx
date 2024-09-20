import { ReactNode } from "react";

interface InputProps {
    text: string;
    color?: "primaria";
    icon: ReactNode
    onClick?: () => void;
}

const ButtonTab = (props: InputProps) => {
    return (
        <>
            <button
                onClick={props.onClick}
                className={`flex items-center gap-2 w-[15vw] justify-center p-2 px-3 font-bold text-lg hover:bg-primaria-light hover:text-white transition-all duration-300 ${
                    props.color == "primaria" ? "bg-primaria text-white" : "bg-secundaria"
                } rounded-lg`}
            >
                {props.icon} {props.text}
            </button>
        </>
    );
};

export default ButtonTab;
