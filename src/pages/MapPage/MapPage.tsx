import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { FormContext } from "../../components/Context/FormContext";
import Button from "../../components/Button/Button";
import { FaArrowLeft } from "react-icons/fa";
import Cookies from "universal-cookie";

interface EnderecoCoord {
    lat: number;
    lng: number;
}

const MapPage = () => {
    const [markerLocation, setMarkerLocation] = useState<EnderecoCoord>();
    const formContext = useContext(FormContext);

    const cookie = new Cookies();
    const token = cookie.get("token");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate("/login");
    }, [])

    return (
        <div className="w-screen h-screen flex flex-col gap-8 items-center p-8">
            <div className="flex w-full items-center">
                <button onClick={() => {
                    navigate(-1)
                }}>
                    <FaArrowLeft />
                </button>
                <h1 className="font-bold text-4xl text-black mx-auto">Endereço</h1>
            </div>
            <APIProvider apiKey={import.meta.env.VITE_MAP_KEY}>
                <Map
                    mapId={"map"}
                    style={{ width: "100vw", height: "100vh" }}
                    defaultCenter={{ lat: -6.889592332521834, lng: -38.545227971136384 }}
                    defaultZoom={14}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    onClick={(e) => {
                        const lat = e.detail.latLng?.lat;
                        const lng = e.detail.latLng?.lng;
                        if (lat && lng) {
                            setMarkerLocation({ lat, lng });
                            formContext.endereco = `${lat}|${lng}`;
                        }
                    }}
                >
                    {markerLocation && (
                        <AdvancedMarker position={{ lat: markerLocation.lat, lng: markerLocation.lng }} />
                    )}
                </Map>
            </APIProvider>
            <Button
                text="Salvar"
                className="bg-primaria border py-4 px-24 text-white"
                onClick={() => {
                    navigate(-1);
                }}
            />
        </div>
    );
};

export default MapPage;
