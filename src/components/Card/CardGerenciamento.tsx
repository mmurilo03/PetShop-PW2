import { useEffect, useState } from "react";
import { FaPaw, FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { api } from "../../api/api";

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

    useEffect(() => {
        getImage();
    }, []);

    if (loading) <></>;

    return (
        <>
            <div className="flex flex-row lg:w-96 md:w-96 xsm:w-[80vw] truncate h-32 rounded-lg shadow-lg">
                <img className="rounded-l-lg xsm:h-[60%] lg:h-32 md:h-32" src={image} />
                <div className="flex flex-col text-[90%] w-full">
                    <div className="flex gap-2 pr-2 xsm:pl-2 md:pl-[60%] lg:pl-[60%]">
                        <button>
                            <FaPencilAlt />
                        </button>
                        <button className="text-red-500">
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
