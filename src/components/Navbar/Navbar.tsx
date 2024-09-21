import { useContext, useState } from "react";
import LogoHorizontal from "../../images/LogoHorizontal";
import { FaUser, FaCat, FaHome } from "react-icons/fa";
import { FaUserDoctor, FaClipboard } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import Button from "../Button/Button";
import Cookies from "universal-cookie";

const Navbar = () => {
    const navigate = useNavigate();

    const user = useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);

    const cookie = new Cookies();

    const logout = () => {
        user.email = "";
        user.funcao = "";
        user.id = 0;
        user.imagem = "";
        user.nome = "";
        user.telefone = "";

        cookie.set("token", "", { path: "/" });
        navigate("/login");
    };

    const optionsUser = () => {
        return (
            <div className="flex z-10 bg-primaria flex-col text-white p-4 rounded-bl-md gap-2 absolute right-0 w-44">
                <Button className="p-3 px-3 text-white hover:text-primaria border hover:bg-white" text="Meu Perfil" />
                <Button className="p-3 px-3 text-white hover:text-primaria border hover:bg-white" text="Logout" onClick={logout} />
            </div>
        );
    };

    return (
        <>
            <nav className="p-8 bg-primaria flex items-center text-white justify-between z-1">
                <div className="w-44">
                    <LogoHorizontal width="300" height="40" />
                </div>
                <div className="flex flex-row-reverse gap-8 items-center">
                    <div className="flex flex-col items-center">
                        <button
                            className="text-4xl text-primaria bg-white p-2 rounded-full"
                            onClick={() => {
                                setShowModal(!showModal);
                            }}
                        >
                            <FaUser />
                        </button>
                        <p>{user.nome}</p>
                    </div>
                    <div className="text-4xl pr-14 flex flex-row-reverse gap-8">
                        <div>
                            <button className="flex flex-col items-center">
                                <FaCat />
                                <p className="text-sm">Gerenciar Pets</p>
                            </button>
                        </div>
                        <div>
                            <button className="flex flex-col items-center">
                                <FaUserDoctor />
                                <p className="text-sm">Gerenciar Responsáveis</p>
                            </button>
                        </div>
                        <div>
                            <button className="flex flex-col items-center" onClick={() => {
                                navigate("/gerenciar")
                            }}>
                                <FaClipboard />
                                <p className="text-sm">Gerenciar Atendimentos</p>
                            </button>
                        </div>
                        <div>
                            <button className="flex flex-col items-center" onClick={() => {
                                navigate("/home")
                            }}>
                                <FaHome />
                                <p className="text-sm">Página inicial</p>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {showModal && optionsUser()}
        </>
    );
};

export default Navbar;
