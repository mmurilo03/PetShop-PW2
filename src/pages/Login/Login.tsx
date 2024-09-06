import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import LogoHorizontal from "../../images/LogoHorizontal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <div className="bg-primaria w-screen h-screen flex flex-col gap-8 items-center">
            <div className="pt-14">
                <LogoHorizontal />
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
                <Button text="Login" onClick={() => navigate("/home")} />
            </div>
        </div>
    );
};

export default Login;
