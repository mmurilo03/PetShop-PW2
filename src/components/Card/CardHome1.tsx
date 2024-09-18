import { FaPaw } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

interface CardProps {
    img: string;
    nomeAnimal: string;
    endereco: string;
    tipoAtendimento: string;
    profissional: string;
    data: string;
}

const CardHome1 = (props: CardProps) => {
    return (
        <>
            <div className="w-80">
                <img className="rounded-lg" src={props.img} />
                <div className="flex flex-row justify-between text-[90%]">
                    <div className="p-1 gap-2 flex w-[48%] items-center">
                        <div>
                            <FaPaw />
                        </div>
                        <p className="overflow-hidden text-ellipsis">
                            {props.nomeAnimal}
                        </p>
                    </div>
                    <div className="p-1 gap-2 flex w-[48%] items-center">
                        <div>
                            <IoLocationSharp />
                        </div>
                        <p className="overflow-hidden text-ellipsis">
                            {props.endereco}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col rounded-lg bg-secundaria max-w-80 text-[90%]">
                    <p className="bg-secundaria p-1 px-3 rounded-lg font-bold overflow-hidden text-ellipsis">
                        Tipo: {props.tipoAtendimento}
                    </p>
                    <p className="bg-secundaria p-1 px-3 rounded-lg font-bold overflow-hidden text-ellipsis">
                        Profissional: {props.profissional}
                    </p>
                    <p className="bg-secundaria p-1 px-3 rounded-lg font-bold overflow-hidden text-ellipsis">
                        Data: {props.data}
                    </p>
                </div>
            </div>
        </>
    );
};

export default CardHome1;
