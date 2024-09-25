import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Cookies from "universal-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { FormContext } from "../../components/Context/FormContext";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";

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

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        getValues,
    } = useForm<DataType>({ resolver: zodResolver(schema) });

    const cookie = new Cookies();

    const navigate = useNavigate();

    const sendForm = async (data: DataType) => {
        try {
            const form = new FormData();

            const img = data.imagem[0] as File;
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };
            form.append("nome", data.nome);
            form.append("tutor", data.tutor);
            form.append("telefone", data.telefone);
            form.append("endereco", data.endereco);
            form.append("image", img);

            api.defaults.headers.common.Authorization = cookie.get("token");

            await api.post("/pet/create", form, config);

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

    return (
        <form onSubmit={handleSubmit(sendForm)}>
            <div className="w-screen h-screen flex flex-col gap-8 items-center p-6">
                <div className="font-bold text-4xl text-black">Cadastrar Pet</div>
                <div className="flex flex-col w-[50%]">
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
                <div className="flex flex-col w-[50%]">
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
                <div className="flex flex-col w-[50%]">
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
                <div className="flex flex-col w-[50%]">
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
                                style={{ width: "40vw", height: "20vh" }}
                                defaultCenter={{ lat: -6.889592332521834, lng: -38.545227971136384 }}
                                defaultZoom={14}
                                gestureHandling={"greedy"}
                                disableDefaultUI={true}
                            />
                        ) : (
                            <Map
                                mapId={"map"}
                                style={{ width: "40vw", height: "20vh" }}
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

                <div className="flex flex-col w-[50%]">
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
                    <Button className="bg-primaria text-white p-4 px-32" text="Salvar" />
                </div>
            </div>
        </form>
    );
};

export default FormPet;
