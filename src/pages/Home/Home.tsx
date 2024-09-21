import CardHome1 from "../../components/Card/CardHome1";
import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { BsHouse } from "react-icons/bs";
import Search from "../../components/Search/Search";
import ButtonTab from "../../components/Button/ButtonTab";
import { FaArrowLeft, FaArrowRight, FaCat, FaRegClipboard } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import Cookies from "universal-cookie";
import CardHome2 from "../../components/Card/CardHome2";
import ButtonIcon from "../../components/Button/ButtonIcon";

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

const Home = () => {
    const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
    const [responsaveis, setResponsaveis] = useState<Responsaveis[]>([]);
    const [pets, setPets] = useState<Pets[]>([]);
    const [atendimentosFiltered, setAtendimentosFiltered] = useState<Atendimento[]>([]);
    const [responsaveisFiltered, setResponsaveisFiltered] = useState<Responsaveis[]>([]);
    const [petsFiltered, setPetsFiltered] = useState<Pets[]>([]);
    const [atendimentoPage, setAtendimentoPage] = useState(0);
    const [responsaveisPage, setResponsaveisPage] = useState(0);
    const [petsPage, setPetsPage] = useState(0);

    const pageSize = 8;

    const [cardTypes, setCardTypes] = useState("atendimentos");

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
            case "atendimentos":
                return atendimentoPage;
            case "responsaveis":
                return responsaveisPage;
            case "pets":
                return petsPage;
            default:
                return 0;
        }
    };

    useEffect(() => {
        loadAtendimentos();
        loadResponsaveis();
        loadPets();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex justify-between items-center">
                <div className="flex items-center p-4 py-6 gap-3">
                    <BsHouse className="text-[500%]" />
                    <h1 className="text-[150%]">Página Inicial</h1>
                </div>
                <div className="px-10">
                    <Search
                        width="w-[50rem]"
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
                </div>
            </div>
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-10 font-bold">
                    <ButtonTab
                        text="Atendimentos"
                        color="primaria"
                        icon={<FaRegClipboard />}
                        onClick={() => setCardTypes("atendimentos")}
                    />
                    <ButtonTab
                        text="Responsáveis"
                        icon={<FaUserDoctor />}
                        onClick={() => setCardTypes("responsaveis")}
                    />
                    <ButtonTab text="Pets" icon={<FaCat />} onClick={() => setCardTypes("pets")} />
                </div>
                <div className="flex gap-4 font-bold items-center">
                    <ButtonIcon
                        icon={<FaArrowLeft />}
                        onClick={() => {
                            switch (cardTypes) {
                                case "atendimentos":
                                    setAtendimentoPage((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
                                    break;
                                case "responsaveis":
                                    setResponsaveisPage((prev) => (prev - 1 <= 0 ? 0 : prev - 1));
                                    break;
                                case "pets":
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
                                case "atendimentos":
                                    setAtendimentoPage((prev) =>
                                        prev < Math.floor(atendimentos.length / pageSize) ? prev + 1 : prev
                                    );
                                    break;
                                case "responsaveis":
                                    setResponsaveisPage((prev) =>
                                        prev < Math.floor(responsaveis.length / pageSize) ? prev + 1 : prev
                                    );
                                    break;
                                case "pets":
                                    setPetsPage((prev) =>
                                        prev < Math.floor(pets.length / pageSize) ? prev + 1 : prev
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
                    {atendimentosFiltered.length > 0 && cardTypes == "atendimentos" ? (
                        atendimentosFiltered
                            .slice(atendimentoPage * pageSize, atendimentoPage * pageSize + pageSize)
                            .map((value) => {
                                return <CardHome1 id={value.id} key={value.id} />;
                            })
                    ) : (
                        <></>
                    )}
                    {responsaveisFiltered.length > 0 && cardTypes == "responsaveis" ? (
                        responsaveisFiltered
                            .slice(responsaveisPage * pageSize, responsaveisPage * pageSize + pageSize)
                            .map((value) => {
                                return (
                                    <CardHome2
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
                    {petsFiltered.length > 0 && cardTypes == "pets" ? (
                        petsFiltered
                            .slice(petsPage * pageSize, petsPage * pageSize + pageSize)
                            .map((value) => {
                                return (
                                    <CardHome2
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

export default Home;
