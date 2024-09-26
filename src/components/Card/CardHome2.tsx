import { FaCat } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { api } from "../../api/api";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading/Loading";

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
    const [cont, setCont] = useState<string[]>([]);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const requestAddress = useRef(true);
    const [hasAddress, setHasAddress] = useState(false);

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
            } catch (error) {}
        }
        setLoading(false)
    };

    const getEndereco = async (lat: string, lng: string) => {
        const cookie = new Cookies();
        const token = cookie.get("token");
        api.defaults.headers.common.Authorization = token;

        try {
            const endereco = (await api.post("/pet/endereco", { lat: lat, lng: lng })).data.address;
            setCont((prev) => {
                const temp = [...prev];
                temp.push(`Endereço: ${endereco}`);
                return temp;
            });
            setHasAddress(true);
        } catch (e) {}
    };

    useEffect(() => {
        if (requestAddress.current) {
            requestAddress.current = false
            for (let tag of Object.keys(props.tags)) {
                if (tag == "Endereço") {
                    const lat = props.tags[tag].split("|")[0];
                    const lng = props.tags[tag].split("|")[1];
                    getEndereco(lat, lng);
                } else {
                    setCont((prev) => {
                        const temp = [...prev];
                        temp.push(`${tag}: ${props.tags[tag]}`);
                        return temp;
                    });
                }
            }
            setHasAddress(true)
        }
        getImage();
    }, [image]);

    if (loading || !hasAddress) return <Loading />;

    return (
        <>
            <div className="w-80 rounded-lg shadow-lg animate-in zoom-in-75">
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
