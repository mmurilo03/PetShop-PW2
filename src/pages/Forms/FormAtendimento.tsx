import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Cookies from "universal-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

const schema = z.object({
    tipoAtendimento: z
        .string({ required_error: "Escolha o tipo do atendimento" })
        .min(1, "Escolha o tipo do atendimento"),
    responsavel: z.string({ required_error: "Digite a função" }).min(1, "Digite a função"),
    pet: z.string({ required_error: "Digite o telefone" }).min(1, "Digite o telefone"),
    descricao: z.string(),
    date: z.string({ required_error: "Digite a senha" }).min(1, "Digite a senha"),
});

type DataType = z.infer<typeof schema>;

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

const FormAtendimento = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DataType>({ resolver: zodResolver(schema) });

    const [responsaveis, setResponsaveis] = useState<Responsaveis[]>([]);
    const [pets, setPets] = useState<Pets[]>([]);
    const [responsaveisFiltered, setResponsaveisFiltered] = useState<Responsaveis[]>([]);
    const [petsFiltered, setPetsFiltered] = useState<Pets[]>([]);

    const [loading, setLoading] = useState(true);

    const cookie = new Cookies();
    const token = cookie.get("token");
    api.defaults.headers.common.Authorization = token;
    const navigate = useNavigate();

    const sendForm = async (data: DataType) => {
        try {
            const form = { tipoAtendimento: "", responsavel: "", pet: "", descricao: "Sem descrição", date: ""}
            form.tipoAtendimento = data.tipoAtendimento;
            form.responsavel = data.responsavel;
            form.pet = data.pet;
            form.descricao = data.descricao.length > 0 ? data.descricao : "Sem descrição";
            form.date = data.date;

            await api.post("/atendimento/create", form);

            navigate("/gerenciar", { state: { cardTypes: "Atendimentos" } });
        } catch (e) {
            console.log(e);
        }
    };

    const loadResponsaveis = async () => {
        const responsaveis = (await api.get("/responsavel")).data.responsaveis;
        setResponsaveis(responsaveis);
        setResponsaveisFiltered(responsaveis);
    };

    const loadPets = async () => {
        const pets = (await api.get("/pet")).data.pets;
        setPets(pets);
        setPetsFiltered(pets);
    };

    useEffect(() => {
        loadResponsaveis().then(() => {
            loadPets().then(() => {
                setLoading(false);
            });
        });
    }, []);

    if (loading) return <></>;

    return (
        <form onSubmit={handleSubmit(sendForm)}>
            <div className="w-full h-full flex flex-col gap-8 items-center p-6 sm:p-6 md:p-8">
                <div className="flex w-full items-center">
                    <button
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        <FaArrowLeft className="text-[200%]" />
                    </button>
                    <h1 className="font-bold text-4xl text-black mx-auto">Cadastrar Pet</h1>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Tipo do atendimento <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register("tipoAtendimento")}
                        className="border shadow-lg py-4 rounded-md pl-2"
                    >
                        <option value={"Banho"}>Banho</option>
                        <option value={"Tosa"}>Tosa</option>
                        <option value={"Veterinário"}>Veterinário</option>
                    </select>
                    <p className="text-red-700">{errors.tipoAtendimento?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Responsável <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Pesquise o responável"
                        onChange={(event) => {
                            const text = event.target.value;
                            setResponsaveisFiltered(() => {
                                const tempArray = responsaveis.filter((value) => {
                                    if (text.length == 0) return value;
                                    if (value.nome.includes(text)) {
                                        return value;
                                    }
                                });
                                return tempArray;
                            });
                        }}
                    />
                    <select {...register("responsavel")} className="border shadow-lg py-4 rounded-md pl-2">
                        {responsaveisFiltered.length > 0 &&
                            responsaveisFiltered.map((value) => {
                                return (
                                    <option key={value.id} value={value.id}>
                                        {value.nome}
                                    </option>
                                );
                            })}
                    </select>

                    <p className="text-red-700">{errors.responsavel?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Pet <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Pesquise o pet"
                        onChange={(event) => {
                            const text = event.target.value;
                            setPetsFiltered(() => {
                                const tempArray = pets.filter((value) => {
                                    if (text.length == 0) return value;
                                    if (value.nome.includes(text)) {
                                        return value;
                                    }
                                });
                                return tempArray;
                            });
                        }}
                    />
                    <select {...register("pet")} className="border shadow-lg py-4 rounded-md pl-2">
                        {petsFiltered.length > 0 &&
                            petsFiltered.map((value) => {
                                return (
                                    <option key={value.id} value={value.id}>
                                        {value.nome}
                                    </option>
                                );
                            })}
                    </select>

                    <p className="text-red-700">{errors.pet?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Descrição <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("descricao")}
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite a descrição"
                    />
                    <p className="text-red-700">{errors.descricao?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Senha <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("date")}
                        type="date"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Escolha a data"
                    />
                    <p className="text-red-700">{errors.date?.message}</p>
                </div>

                <div className="pt-8">
                    <Button className="bg-primaria text-white p-4 px-32 sm:px-24 md:px-32" text="Salvar" />
                </div>
            </div>
        </form>
    );
};

export default FormAtendimento;
