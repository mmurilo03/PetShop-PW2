import { useEffect, useState } from "react";
import { FaPaw, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

interface Tags {
    [propName: string]: string;
}

interface CardProps {
    type: "atendimento" | "responsavel" | "pet";
    id: number;
    img: string;
    nome: string;
    pet: boolean;
    onDelete: () => void;
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(true);

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
            } catch (error) {}
        }
        setLoading(false);
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
    }, [image]);

    if (loading) return <Loading />;

    return (
        <>
            <div className="flex flex-row lg:w-96 md:w-96 xsm:w-[80vw] truncate h-32 rounded-lg shadow-lg animate-in zoom-in-75">
                <img className="rounded-l-lg xsm:h-[60%] lg:h-32 md:h-32" src={image} />
                <div className="flex flex-col text-[90%] w-full">
                    <div className="flex gap-2 pr-2 xsm:pl-2 md:pl-52 lg:pl-52">
                        <button
                            onClick={() => {
                                goToFormPage();
                            }}
                        >
                            <FaPencilAlt />
                        </button>
                        <button
                            className="text-red-500"
                            onClick={() => {
                                setShowDeleteConfirm(true);
                            }}
                        >
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
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 bg-gray-600">
                    <div className="bg-white rounded-md p-6 shadow-lg w-80 animate-in zoom-in-100">
                        <h2 className="text-lg font-semibold mb-4">Confirmação</h2>
                        <p className="pb-6">Deseja excluir <span className="font-bold">{props.nome}</span>?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-500 transition-colors duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    props.onDelete();
                                }}
                                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-700 transition-colors duration-300 text-white "
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardGerenciamento;
