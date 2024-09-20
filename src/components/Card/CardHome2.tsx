import { FaCat } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { api } from "../../api/api";
import { useEffect, useState } from "react";

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
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    for (let tag of Object.keys(props.tags)) {
        cont.push(`${tag}: ${props.tags[tag]}`);
    }

    const getImage = async () => {
        let hasImage = false;
        const cookie = new Cookies();
        const token = cookie.get("token");
        api.defaults.headers.common.Authorization = token;

        try {
            await api.get(`images/${props.img}`);
            hasImage = true;
        } catch (e) {
            setImage(
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            );
        }

        if (hasImage) {
            try {
                const image = api.getUri({ url: `images/${props.img}` });
                setImage(image);
                setLoading(false);
            } catch (error) {}
        }
    };

    useEffect(() => {
        getImage();
    }, []);

    if (loading) return <></>;

    return (
        <>
            <div className="w-80 rounded-lg shadow-lg">
                <img className="rounded-t-lg object-cover h-44 w-80" src={image} />
                <div className="flex flex-col justify-between text-[90%]">
                    <div className="p-1 px-2 gap-2 flex items-center">
                        <div className="text-[90%]">{props.pet ? <FaUserDoctor /> : <FaCat />}</div>
                        <p className="overflow-hidden text-ellipsis">{props.nome}</p>
                    </div>
                    {cont.map((value) => (
                        <div key={value} className="p-1 px-2 gap-2 flex items-center">
                            <p className="overflow-hidden text-ellipsis">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CardHome2;
