import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import LogoHorizontal from "../../images/LogoHorizontal";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import Cookies from "universal-cookie";
import { AuthContext } from "../../components/Context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const cookie = new Cookies();

    const navigate = useNavigate();
    const user = useContext(AuthContext);

    const sendForm = async () => {
        try {
            const { data } = await api.post("/responsavel/login", { email, senha: password });
            if (data.token) {
                user.email = data.email;
                user.funcao = data.funcao;
                user.id = data.id;
                user.imagem = data.imagem;
                user.nome = data.nome;
                user.telefone = data.telefone;

                cookie.set("token", data.token, { path: "/" });
                cookie.set("user", user, { path: "/" });
                navigate("/home");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="bg-primaria w-screen h-screen flex flex-col gap-8 items-center">
            <div className="flex justify-center pt-14">
                <LogoHorizontal width="80%" />
            </div>
            <div className="font-bold text-7xl text-white pb-14 pt-24">Login</div>
            <Input value={email} onChange={(value) => setEmail(value)} label="Email" type="email"></Input>
            <Input
                value={password}
                onChange={(value) => setPassword(value)}
                label="Senha"
                type="password"
            ></Input>
            <div className="pt-8">
                <Button className="bg-white text-primaria p-6 md:px-40 lg:px-44 xsm:px-24" text="Login" onClick={() => sendForm()} />
            </div>
        </div>
    );
};

export default Login;
