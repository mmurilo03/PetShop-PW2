import { FaPaw, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

interface Tags {
    [propName: string]: string;
}

interface CardProps {
    img: string;
    nome: string;
    pet: boolean;
    tags: Tags;
}

const CardGerenciamento = (props: CardProps) => {
    const cont = [""];

    for (let tag of Object.keys(props.tags)) {
        cont.push(`${tag}: ${props.tags[tag]}`);
    }

    return (
        <>
            <div className="flex flex-row w-96 h-32 rounded-lg shadow-lg">
                <img className="rounded-l-lg h-32" src={props.img} />
                <div className="flex flex-col text-[90%]">
                    <div className="flex justify-end gap-2">
                        <button>
                            <FaPencilAlt />{" "}
                        </button>
                        <button className="text-red-500">
                            <FaRegTrashAlt />
                        </button>
                    </div>
                    <div className="p-1 px-2 gap-2 flex items-center">
                        <div className="text-[90%]">{props.pet ? <FaUserDoctor /> : <FaPaw />}</div>
                        <p className="overflow-hidden text-ellipsis">{props.nome}</p>
                    </div>
                    {cont.map((value) => (
                        <div key={value} className="px-2 flex items-center">
                            <p className="overflow-hidden text-ellipsis">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CardGerenciamento;
