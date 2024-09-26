import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Cookies from "universal-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeft } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { AuthContext, getUser } from "../../components/Context/AuthContext";

const imageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const schema = z.object({
    nome: z.string({ required_error: "Digite o nome" }).min(1, "Digite o nome"),
    funcao: z.string({ required_error: "Digite a função" }).min(1, "Digite a função"),
    telefone: z.string({ required_error: "Digite o telefone" }).min(1, "Digite o telefone"),
    email: z
        .string({ required_error: "Digite o email" })
        .email("Digite um email válido")
        .min(1, "Digite o email"),
    senhaAntiga: z.string({ required_error: "Digite a senha antiga" }).min(1, "Digite a senha antiga"),
    senhaNova: z.string({ required_error: "Digite a senha" }).min(1, "Digite a senha"),
    imagem: z
        .instanceof(FileList, { fatal: true, message: "Imagem obrigatória" })
        .refine((files) => files?.length === 1, "Imagem obrigatória")
        .refine((files) => imageTypes.includes(files[0]?.type), "Tipo não suportado"),
});

type DataType = z.infer<typeof schema>;

const EditResponsavel = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<DataType>({ resolver: zodResolver(schema) });

    const cookie = new Cookies();
    const user = useContext(AuthContext);
    const token = cookie.get("token");
    const navigate = useNavigate();

    const sendForm = async (data: DataType) => {
        try {
            const form = new FormData();

            const img = data.imagem[0] as File;
            const config = {
                headers: { "content-type": "multipart/form-data" },
            };

            const tempUser = getUser();
            form.append("id", `${tempUser.id}`);
            form.append("nome", data.nome);
            form.append("funcao", data.funcao);
            form.append("telefone", data.telefone);
            form.append("email", data.email);
            form.append("senhaAntiga", data.senhaAntiga);
            form.append("senhaNova", data.senhaNova);
            form.append("image", img);

            api.defaults.headers.common.Authorization = cookie.get("token");

            const responsavelEdited = (await api.patch("/responsavel/edit", form, config)).data
                .responsavelEdited;

            user.email = responsavelEdited.email;
            user.funcao = responsavelEdited.funcao;
            user.id = responsavelEdited.id;
            user.imagem = responsavelEdited.imagem;
            user.nome = responsavelEdited.nome;
            user.telefone = responsavelEdited.telefone;

            cookie.set("user", user, { path: "/" });

            navigate("/home", { state: { cardTypes: "Atendimentos" } });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (!token) navigate("/login");
        const tempUser = getUser();
        setValue("email", tempUser.email);
        setValue("funcao", tempUser.funcao);
        setValue("nome", tempUser.nome);
        setValue("telefone", tempUser.telefone);
    }, []);

    return (
        <form onSubmit={handleSubmit(sendForm)}>
            <div className="w-full h-full flex flex-col gap-8 items-center p-6 sm:p-6 md:p-8">
                <div className="flex w-full items-center">
                    <button
                        onClick={() => {
                            navigate("/gerenciar");
                        }}
                    >
                        <FaArrowLeft className="text-[200%]" />
                    </button>
                    <h1 className="font-bold text-4xl text-black mx-auto">Editar perfil</h1>
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
                        Função <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("funcao")}
                        type="text"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite a função"
                    />
                    <p className="text-red-700">{errors.funcao?.message}</p>
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
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite o email"
                    />
                    <p className="text-red-700">{errors.email?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Senha antiga <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("senhaAntiga")}
                        type="password"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite a senha antiga"
                    />
                    <p className="text-red-700">{errors.senhaAntiga?.message}</p>
                </div>
                <div className="flex flex-col sm:w-full md:w-full lg:w-[50%]">
                    <label className="font-bold">
                        Senha nova <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("senhaNova")}
                        type="password"
                        className="border shadow-lg py-4 rounded-md pl-2"
                        placeholder="Digite a senha"
                    />
                    <p className="text-red-700">{errors.senhaNova?.message}</p>
                </div>
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

export default EditResponsavel;
