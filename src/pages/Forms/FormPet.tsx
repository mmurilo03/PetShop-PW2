import Button from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Cookies from "universal-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { FormContext } from "../../components/Context/FormContext";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { FaArrowLeft } from "react-icons/fa";

const imageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const schema = z.object({
    nome: z.string({ required_error: "Digite o nome" }).min(1, "Digite o nome"),
    tutor: z.string({ required_error: "Digite o tutor" }).min(1, "Digite o tutor"),
    telefone: z.string({ required_error: "Digite o telefone" }).min(1, "Digite o telefone"),
    endereco: z.string({ required_error: "Escolha o endereço" }).min(1, "Escolha o endereço"),
    imagem: z
        .instanceof(FileList, { fatal: true, message: "Imagem obrigatória" })
        .refine((files) => files?.length === 1, "Imagem obrigatória")
        .refine((files) => imageTypes.includes(files[0]?.type), "Tipo não suportado"),
});

type DataType = z.infer<typeof schema>;

const FormPet = () => {
    const formContext = useContext(FormContext);
    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        getValues,
    } = useForm<DataType>({ resolver: zodResolver(schema) });

    const cookie = new Cookies();
    const token = cookie.get("token");
    const navigate = useNavigate();

    const sendForm = async (data: DataType) => {
        try {
            const form = new FormData();

            const img = data.imagem[0] as File;
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };
            if (location.state?.obj) {
                form.append("id", location.state?.obj.id);
            }
            form.append("nome", data.nome);
            form.append("tutor", data.tutor);
            form.append("telefone", data.telefone);
            form.append("endereco", data.endereco);
            form.append("image", img);

            api.defaults.headers.common.Authorization = cookie.get("token");

            if (location.state?.obj) {
                await api.patch("/pet/edit", form, config);
            } else {
                await api.post("/pet/create", form, config);
            }

            navigate("/gerenciar", { state: { cardTypes: "Pets" } });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (!formContext.endereco) return;
        setValue("endereco", formContext.endereco);
        setError("endereco", { message: "" });

        setValue("nome", formContext.nome ?? "");
        setValue("tutor", formContext.tutor ?? "");
        setValue("telefone", formContext.telefone ?? "");
    }, [formContext.endereco]);

    useEffect(() => {
        if (!token) navigate("/login");
        if (!location.state?.obj) return;

        formContext.nome = location.state?.obj.nome;
        formContext.telefone = location.state?.obj.telefone;
        formContext.tutor = location.state?.obj.tutor;
        formContext.endereco = location.state?.obj.endereco;

        setValue("endereco", location.state?.obj.endereco);
        setError("endereco", { message: "" });

        setValue("nome", location.state?.obj.nome ?? "");
        setValue("tutor", location.state?.obj.tutor ?? "");
        setValue("telefone", location.state?.obj.telefone ?? "");
    }, []);

    return (
        <form onSubmit={handleSubmit(sendForm)}>
            <div className="w-full h-full flex flex-col gap-8 items-center p-6 sm:p-6 md:p-8">
                <div className="flex w-full items-center">
                    <button
                        onClick={() => {
                            navigate("/gerenciar", { state: { cardTypes: "Pets" } });
                        }}
                    >
                        <FaArrowLeft className="text-[200%]" />
                    </button>
                    <h1 className="font-bold text-4xl text-black mx-auto">
                        {!location.state?.obj ? "Cadastrar" : "Editar"} Pet
                    </h1>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("nome")}
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite o nome"
                    />
                    <p className="text-red-700">{errors.nome?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Tutor <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("tutor")}
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite o tutor"
                    />
                    <p className="text-red-700">{errors.tutor?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Telefone <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("telefone")}
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite o telefone"
                    />
                    <p className="text-red-700">{errors.telefone?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Endereço <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("endereco")}
                        type="hidden"
                        className="border shadow-lg py-4 rounded-md pl-2"
                    />
                    <p className="text-red-700">{errors.endereco?.message}</p>
                </div>

                <button
                    onClick={() => {
                        formContext.nome = getValues("nome");
                        formContext.tutor = getValues("tutor");
                        formContext.telefone = getValues("telefone");
                        console.log(getValues("imagem"));
                        navigate("map");
                    }}
                >
                    <APIProvider apiKey={import.meta.env.VITE_MAP_KEY}>
                        {!formContext.endereco ? (
                            <Map
                                mapId={"map"}
                                style={{ width: "48vw", height: "20vh" }}
                                defaultCenter={{ lat: -6.889592332521834, lng: -38.545227971136384 }}
                                defaultZoom={14}
                                gestureHandling={"greedy"}
                                disableDefaultUI={true}
                            />
                        ) : (
                            <Map
                                mapId={"map"}
                                style={{ width: "48vw", height: "20vh" }}
                                defaultCenter={{
                                    lat: Number(formContext.endereco.split("|")[0]),
                                    lng: Number(formContext.endereco.split("|")[1]),
                                }}
                                defaultZoom={14}
                                gestureHandling={"greedy"}
                                disableDefaultUI={true}
                            >
                                <AdvancedMarker
                                    position={{
                                        lat: Number(formContext.endereco.split("|")[0]),
                                        lng: Number(formContext.endereco.split("|")[1]),
                                    }}
                                />
                            </Map>
                        )}
                    </APIProvider>
                </button>

                <div className="flex flex-col w-full sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Imagem <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("imagem")}
                        type="file"
                        className="border shadow-lg py-4 rounded-md pl-2"
                    />
                    <p className="text-red-700">{errors.imagem?.message}</p>
                </div>

                <div className="pt-8">
                    <Button className="bg-primaria text-white p-4 px-32 sm:px-24 md:px-32" text="Salvar" />
                </div>
            </div>
        </form>
    );
};

export default FormPet;
