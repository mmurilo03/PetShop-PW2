import LogoHorizontal from "../../images/LogoHorizontal";
import { FaUser, FaCat, FaHome } from "react-icons/fa";
import { FaUserDoctor, FaClipboard } from "react-icons/fa6";


const Navbar = () => {
    return (
        <nav className="p-8 bg-primaria flex items-center text-white justify-between">
            <div className="w-44">
                <LogoHorizontal width="300" height="40" />
            </div>
            <div className="flex flex-row-reverse gap-8 items-center">
                <div>
                    <button className="text-4xl text-primaria bg-white p-2 rounded-full">
                        <FaUser />
                    </button>
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
                        <button className="flex flex-col items-center">
                            <FaClipboard />
                            <p className="text-sm">Gerenciar Atendimentos</p>
                        </button>
                    </div>
                    <div>
                        <button className="flex flex-col items-center">
                            <FaHome />
                            <p className="text-sm">Página inicial</p>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
