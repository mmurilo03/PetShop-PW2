import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Search from "../../components/Search/Search";
import ButtonTab from "../../components/Button/ButtonTab";
import { FaArrowLeft, FaArrowRight, FaCat, FaRegClipboard } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import ButtonIcon from "../../components/Button/ButtonIcon";
import CardGerenciamento from "../../components/Card/CardGerenciamento";
import Button from "../../components/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";

interface Atendimento {
    data: string;
    descricao: string;
    endereco: string;
    id: number;
    imagem: string;
    nome: string;
    petId: number;
    responsavel: string;
    responsavelId: number;
    status: number;
    tipo: string;
}

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

const Gerenciar = () => {
    const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
    const [responsaveis, setResponsaveis] = useState<Responsaveis[]>([]);
    const [pets, setPets] = useState<Pets[]>([]);
    const [atendimentosFiltered, setAtendimentosFiltered] = useState<Atendimento[]>([]);
    const [responsaveisFiltered, setResponsaveisFiltered] = useState<Responsaveis[]>([]);
    const [petsFiltered, setPetsFiltered] = useState<Pets[]>([]);
    const [atendimentoPage, setAtendimentoPage] = useState(0);
    const [responsaveisPage, setResponsaveisPage] = useState(0);
    const [petsPage, setPetsPage] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const pageSize = 9;

    const [cardTypes, setCardTypes] = useState(location.state?.cardTypes ?? "Atendimentos");

    const cookie = new Cookies();
    const token = cookie.get("token");
    api.defaults.headers.common.Authorization = token;

    const loadAtendimentos = async () => {
        let atendimentos = (await api.get("/atendimento")).data.atendimentos as Atendimento[];
        atendimentos = atendimentos.map((value) => {
            let dataTemp = "";
            dataTemp = value!.data.split("T")[0] as string;
            dataTemp = `${dataTemp.split("-")[2]}/${dataTemp.split("-")[1]}/${dataTemp.split("-")[0]}`;
            value.data = dataTemp;

            return value;
        });
        setAtendimentos(atendimentos);
        setAtendimentosFiltered(atendimentos);
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

    const getPage = () => {
        switch (cardTypes) {
            case "Atendimentos":
                return atendimentoPage;
            case "Responsáveis":
                return responsaveisPage;
            case "Pets":
                return petsPage;
            default:
                return 0;
        }
    };

    const goToFormPage = () => {
        switch (cardTypes) {
            case "Atendimentos":
                
                break;
            case "Responsáveis":
                
                break;
            case "Pets":
                navigate("form/pet")
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        loadAtendimentos();
        loadResponsaveis();
        loadPets();
    }, []);

    return (
        <>
        <Navbar/>
            <div className="flex md:flex-row xsm:flex-col justify-between items-center pt-4 animate-in fade-in-20">
                <div className="flex items-center p-4 py-6 gap-3">
                    {cardTypes == "Atendimentos" ? <FaRegClipboard className="text-[500%]" /> : <></>}
                    {cardTypes == "Responsáveis" ? <FaUserDoctor className="text-[500%]" /> : <></>}
                    {cardTypes == "Pets" ? <FaCat className="text-[500%]" /> : <></>}
                    <h1 className="text-[150%]">Gerenciar {cardTypes}</h1>
                </div>
                <div className="flex px-10 gap-2 lg:flex-row xsm:flex-col md:flex-col items-center">
                    <Search
                    width="w-full"
                        onChange={(text) => {
                            setAtendimentoPage(0);
                            setResponsaveisPage(0);
                            setPetsPage(0);
                            setAtendimentosFiltered(() => {
                                const tempArray = atendimentos.filter((value) => {
                                    if (text.length == 0) return value;
                                    if (
                                        value.data.includes(text) ||
                                        value.endereco.includes(text) ||
                                        value.nome.includes(text) ||
                                        value.responsavel.includes(text) ||
                                        value.tipo.includes(text)
                                    ) {
                                        return value;
                                    }
                                });
                                return tempArray;
                            });
                            setResponsaveisFiltered(() => {
                                const tempArray = responsaveis.filter((value) => {
                                    if (text.length == 0) return value;
                                    if (
                                        value.email.includes(text) ||
                                        value.funcao.includes(text) ||
                                        value.nome.includes(text) ||
                                        value.telefone.includes(text)
                                    ) {
                                        return value;
                                    }
                                });
                                return tempArray;
                            });
                            setPetsFiltered(() => {
                                const tempArray = pets.filter((value) => {
                                    if (text.length == 0) return value;
                                    if (
                                        value.endereco.includes(text) ||
                                        value.nome.includes(text) ||
                                        value.telefone.includes(text) ||
                                        value.tutor.includes(text)
                                    ) {
                                        return value;
                                    }
                                });
                                return tempArray;
                            });
                        }}
                    />
                    <Button
                        className="bg-primaria-lighter text-white h-14 w-80"
                        text={`+ Cadastrar ${cardTypes}`}
                        onClick={goToFormPage}
                    />
                </div>
            </div>
            <div className="flex justify-between xsm:gap-14 xsm:w-screen lg:flex-row md:flex-col xsm:flex-col items-center p-8">
                <div className="flex items-center gap-10 lg:flex-row md:flex-col xsm:flex-col font-bold">
                <ButtonTab
                        text="Atendimentos"
                        color={cardTypes == "Atendimentos" ? "primaria" : ""}
                        icon={<FaRegClipboard />}
                        onClick={() => setCardTypes("Atendimentos")}
                    />
                    <ButtonTab
                        text="Responsáveis"
                        color={cardTypes == "Responsáveis" ? "primaria" : ""}
                        icon={<FaUserDoctor />}
                        onClick={() => setCardTypes("Responsáveis")}
                    />
                    <ButtonTab
                        text="Pets"
                        icon={<FaCat />}
                        color={cardTypes == "Pets" ? "primaria" : ""}
                        onClick={() => setCardTypes("Pets")}
                    />
                </div>
                <div className="flex gap-4 font-bold items-center">
                    <ButtonIcon
                        icon={<FaArrowLeft />}
                        onClick={() => {
                            switch (cardTypes) {
                                case "Atendimentos":
                                    setAtendimentoPage((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
                                    break;
                                case "Responsáveis":
                                    setResponsaveisPage((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
                                    break;
                                case "Pets":
                                    setPetsPage((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                    <p className="text-[150%]">Página {getPage() + 1}</p>
                    <ButtonIcon
                        icon={<FaArrowRight />}
                        onClick={() => {
                            switch (cardTypes) {
                                case "Atendimentos":
                                    setAtendimentoPage((prev) =>
                                        prev < Math.ceil(atendimentos.length / pageSize) - 1 ? prev + 1 : prev
                                    );
                                    break;
                                case "Responsáveis":
                                    setResponsaveisPage((prev) =>
                                        prev < Math.ceil(responsaveis.length / pageSize) - 1 ? prev + 1 : prev
                                    );
                                    break;
                                case "Pets":
                                    setPetsPage((prev) =>
                                        prev < Math.ceil(pets.length / pageSize) - 1 ? prev + 1 : prev
                                    );
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex gap-4 flex-wrap justify-center w-11/12 p-8">
                    {atendimentosFiltered.length > 0 && cardTypes == "Atendimentos" ? (
                        atendimentosFiltered
                            .slice(atendimentoPage * pageSize, atendimentoPage * pageSize + pageSize)
                            .map((value) => {
                                return (
                                    <CardGerenciamento
                                        img={value.imagem}
                                        nome={value.nome}
                                        pet={false}
                                        tags={{
                                            Tipo: value.tipo,
                                            Responsavel: value.responsavel,
                                            Data: value.data,
                                        }}
                                        key={value.id}
                                    />
                                );
                            })
                    ) : (
                        <></>
                    )}
                    {responsaveisFiltered.length > 0 && cardTypes == "Responsáveis" ? (
                        responsaveisFiltered
                            .slice(responsaveisPage * pageSize, responsaveisPage * pageSize + pageSize)
                            .map((value) => {
                                return (
                                    <CardGerenciamento
                                        img={value.imagem}
                                        nome={value.nome}
                                        pet={false}
                                        tags={{ Função: value.funcao, email: value.email }}
                                        key={value.id}
                                    />
                                );
                            })
                    ) : (
                        <></>
                    )}
                    {petsFiltered.length > 0 && cardTypes == "Pets" ? (
                        petsFiltered
                            .slice(petsPage * pageSize, petsPage * pageSize + pageSize)
                            .map((value) => {
                                return (
                                    <CardGerenciamento
                                        img={value.imagem}
                                        nome={value.nome}
                                        pet={false}
                                        tags={{
                                            tutor: value.tutor,
                                            telefone: value.telefone,
                                            endereco: value.endereco,
                                        }}
                                        key={value.id}
                                    />
                                );
                            })
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};

export default Gerenciar;
