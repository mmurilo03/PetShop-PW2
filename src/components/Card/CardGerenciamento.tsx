import { useEffect, useState } from "react";
import { FaPaw, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";

interface Tags {
    [propName: string]: string;
}

interface CardProps {
    type: "atendimento" | "responsavel" | "pet";
    id: number;
    img: string;
    nome: string;
    pet: boolean;
    onDelete: () => void
    tags: Tags;
}

interface Atendimento {
    data: string;
    descricao: string;
    endereco: string;
    id: number;
    imagem: string;
    nome: string;
    petId: number;
    responsavel: string;
    responsavelId: number;
    status: number;
    tipo: string;
}
interface Responsaveis {
    id: number;
    email: string;
    funcao: string;
    imagem: string;
    nome: string;
    telefone: string;
}

interface Pets {
    id: number;
    imagem: string;
    endereco: string;
    nome: string;
    telefone: string;
    tutor: string;
}

const CardGerenciamento = (props: CardProps) => {
    const cont = [""];

    for (let tag of Object.keys(props.tags)) {
        cont.push(`${tag}: ${props.tags[tag]}`);
    }

    const navigate = useNavigate();

    const cookie = new Cookies();
    const token = cookie.get("token");
    api.defaults.headers.common.Authorization = token;

    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);

    const getImage = async () => {
        let hasImage = false;
        let imageName = "";
        try {
            const cookie = new Cookies();
            const token = cookie.get("token");
            api.defaults.headers.common.Authorization = token;

            imageName = props.img;
        } catch (e) {}

        try {
            await api.get(`images/${imageName}`);
            hasImage = true;
        } catch (e) {
            setImage(
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            );
        }

        if (hasImage) {
            try {
                const image = api.getUri({ url: `images/${imageName}` });
                setImage(image);
                setLoading(false);
            } catch (error) {}
        }
    };

    const goToFormPage = async () => {
        switch (props.type) {
            case "atendimento":
                const atendimento: Atendimento = (await api.get(`atendimento/${props.id}`)).data.atendimento;
                navigate("/gerenciar/form/atendimento", { state: { obj: atendimento } });
                break;
            case "responsavel":
                // const responsavel: Responsaveis = (await api.post(`responsavel/`, { id: props.id })).data
                //     .responsavel;
                // navigate("/gerenciar/form/responsavel", { state: { obj: responsavel } });
                break;
            case "pet":
                const pet: Pets = (await api.get(`pet/${props.id}`)).data.pet;
                navigate("form/pet", { state: { obj: pet } });
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        getImage();
    }, []);

    if (loading) <></>;

    return (
        <>
            <div className="flex flex-row w-96 h-32 rounded-lg shadow-lg">
                <img className="rounded-l-lg h-32" src={image} />
                <div className="flex flex-col text-[90%] w-full">
                    <div className="flex ml-52 gap-2 pr-2">
                        <button
                            onClick={() => {
                                goToFormPage();
                            }}
                        >
                            <FaPencilAlt />
                        </button>
                        <button className="text-red-500" onClick={() => {
                            props.onDelete();
                        }}>
                            <FaRegTrashAlt />
                        </button>
                    </div>
                    <div className="p-1 px-2 gap-2 flex items-center">
                        <div className="text-[90%]">{props.pet ? <FaUserDoctor /> : <FaPaw />}</div>
                        <p className="overflow-hidden text-ellipsis w-[70%] truncate">{props.nome}</p>
                    </div>
                    {cont.map((value) => (
                        <div key={value} className="px-2 flex items-center">
                            <p className="overflow-hidden text-ellipsis w-[70%] truncate">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CardGerenciamento;
