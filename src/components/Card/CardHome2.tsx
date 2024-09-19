import { FaCat } from "react-icons/fa";
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

const CardHome2 = (props: CardProps) => {
    const cont = [""];

    for (let tag of Object.keys(props.tags)) {
        cont.push(`${tag}: ${props.tags[tag]}`);
    }

    return (
        <>
            <div className="w-80 rounded-lg shadow-lg">
                <img className="rounded-t-lg" src={props.img} />
                <div className="flex flex-col justify-between text-[90%]">
                    <div className="p-1 px-2 gap-2 flex items-center">
                        <div className="text-[90%]">{props.pet ? <FaUserDoctor /> : <FaCat />}</div>
                        <p className="overflow-hidden text-ellipsis">{props.nome}</p>
                    </div>
                    {cont.map((value) => (
                        <div key={value} className="p-1 px-2 gap-2 flex items-center">
                            <p className="overflow-hidden text-ellipsis">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CardHome2;
