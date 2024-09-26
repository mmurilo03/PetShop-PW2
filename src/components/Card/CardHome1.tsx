import { FaPaw } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { api } from "../../api/api";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";
import { Tooltip, initTWE } from "tw-elements";

initTWE({ Tooltip });

interface CardProps {
  id: number;
}

interface Atendimento {
  complete: number;
  date: string;
  descricao: string;
  id: number;
  pet: string;
  petId: number;
  responsavel: string;
  responsavelId: number;
  tipoAtendimento: string;
  imagem: string;
  endereco: string;
}

const CardHome1 = (props: CardProps) => {
  const [atendimento, setAtendimento] = useState<Atendimento>();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getPetImage = async (petId: number) => {
    let petHasImage = false;
    let imageName = "";
    try {
      const cookie = new Cookies();
      const token = cookie.get("token");
      api.defaults.headers.common.Authorization = token;
      const petTemp = (await api.get(`pet/${petId}`)).data.pet;

      setAtendimento((atendimento) => {
        return { ...atendimento } as Atendimento;
      });
      setAtendimento((atendimento) => {
        let dataTemp = "";
        dataTemp = atendimento!.date.split("T")[0] as string;
        dataTemp = `${dataTemp.split("-")[2]}/${dataTemp.split("-")[1]}/${
          dataTemp.split("-")[0]
        }`;
        return { ...atendimento, date: dataTemp } as Atendimento;
      });
      imageName = petTemp.imagem;
      petHasImage = true;
    } catch (e) {
      petHasImage = false;
    }

    if (petHasImage) {
      try {
        await api.get(`images/${imageName}`);
      } catch (e) {}
    }

    if (petHasImage) {
      try {
        const image = api.getUri({ url: `images/${imageName}` });
        setAtendimento((atendimento) => {
          return { ...atendimento, imagem: image } as Atendimento;
        });
      } catch (error) {}
    }
    setLoading(false);
  };

  const getAtendimento = async () => {
    try {
      const cookie = new Cookies();
      const token = cookie.get("token");
      api.defaults.headers.common.Authorization = token;
      const res = (await api.get(`/atendimento/${props.id}`)).data.atendimento;
      const petId = res.petId;

      const pet = (await api.get(`/pet/${petId}`)).data.pet;

      const lat = pet.endereco.split("|")[0];
      const lng = pet.endereco.split("|")[1];
      const endereco = await getEndereco(lat, lng);

      setAtendimento((atendimento) => {
        return { ...atendimento, ...res, endereco: endereco };
      });
      await getPetImage(petId);
    } catch (e) {}
  };

  const getEndereco = async (lat: string, lng: string) => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    api.defaults.headers.common.Authorization = token;

    try {
      const endereco = (await api.post("/pet/endereco", { lat: lat, lng: lng }))
        .data.address;
      return endereco;
    } catch (e) {}
  };

  useEffect(() => {
    getAtendimento();
  }, [loading]);

  if (loading) return <Loading />;

  return (
    <>
      <div
        className="w-80 animate-in zoom-in-75 cursor-pointer"
        onClick={() => navigate(`/detalhes-atendimento/${props.id}`)}
      >
        <img
          className="rounded-lg object-cover h-48 w-80"
          src={atendimento!.imagem}
        />
        <div className="flex flex-row justify-between text-[90%]">
          <div className="p-1 gap-2 flex w-[48%] items-center">
            <div>
              <FaPaw />
            </div>
            <p className="overflow-hidden text-ellipsis">{atendimento!.pet}</p>
          </div>
          <div className="p-1 gap-2 flex w-[48%] items-center relative">
            <div>
              <IoLocationSharp />
            </div>
            <p className="overflow-hidden text-ellipsis truncate">
              <a href="#" data-twe-toggle="tooltip" title={`${atendimento!.endereco}`}>
                {atendimento!.endereco}
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col rounded-lg bg-secundaria max-w-80 text-[90%]">
          <p className="bg-secundaria p-1 px-3 rounded-lg font-bold overflow-hidden text-ellipsis">
            Tipo: {atendimento!.tipoAtendimento}
          </p>
          <p className="bg-secundaria p-1 px-3 rounded-lg font-bold overflow-hidden text-ellipsis">
            Profissional: {atendimento!.responsavel}
          </p>
          <p className="bg-secundaria p-1 px-3 rounded-lg font-bold overflow-hidden text-ellipsis">
            Data: {atendimento!.date}
          </p>
        </div>
      </div>
    </>
  );
};

export default CardHome1;
