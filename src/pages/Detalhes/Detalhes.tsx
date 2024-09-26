import Cookies from "universal-cookie";
import { api } from "../../api/api";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

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

const Detalhes = () => {
  const [atendimento, setAtendimento] = useState<Atendimento>();
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const cookie = new Cookies();
  const token = cookie.get("token");
  const navigate = useNavigate();

  let { id } = useParams();

  const getPetImage = async (petId: number) => {
    let petHasImage = false;
    let imageName = "";
    try {
      const cookie = new Cookies();
      const token = cookie.get("token");
      api.defaults.headers.common.Authorization = token;
      const petTemp = (await api.get(`pet/${petId}`)).data.pet;

      setLat(petTemp.endereco.split("|")[0])
      setLng(petTemp.endereco.split("|")[1])

      console.log(lat);
      console.log(lng);
      

      setAtendimento((atendimento) => {
        return { ...atendimento, endereco: petTemp.endereco } as Atendimento;
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
      const res = await api.get(`/atendimento/${id}`);
      const petId = res.data.atendimento.petId;
      setAtendimento(res.data.atendimento);
      await getPetImage(petId);
    } catch (e) {}
  };

  useEffect(() => {
    if (!token) navigate("/login")
    getAtendimento();
  }, [loading]);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <div className="bg-primaria w-full p-8 rounded-md flex gap-8 items-center justify-between">
          <div className="flex gap-8 items-center">
            <img
              className="rounded-lg object-cover h-80 w-80 shadow-white shadow-sm"
              src={atendimento!.imagem}
            />
            <div className="text-xl text-white">
              <p>
                <span className="font-bold">Pet:</span> {atendimento!.pet}
              </p>
              <p>
                <span className="font-bold">Tipo de atendimento:</span>{" "}
                {atendimento!.tipoAtendimento}
              </p>
              <p>
                <span className="font-bold">Data do atendimento:</span>{" "}
                {atendimento!.date}
              </p>
              <p>
                <span className="font-bold">Responsável pelo atendimento:</span>{" "}
                {atendimento!.responsavel}
              </p>
              <p>
                {" "}
                <span className="font-bold">Endereço: </span>
                {atendimento!.endereco}
              </p>
            </div>
          </div>
          <div>
            <APIProvider apiKey={import.meta.env.VITE_MAP_KEY}>
              <Map
                mapId={"map"}
                style={{ width: "20vw", height: "40vh" }}
                defaultCenter={{
                  lat: Number(lat),
                  lng: Number(lng),
                }}
                defaultZoom={14}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
              />
            </APIProvider>
          </div>
        </div>
        <div className="mt-8 bg-secundaria p-8 rounded-md text-xl">
          <span className="font-bold">Descrição:</span> {atendimento?.descricao}
        </div>
      </div>
    </>
  );
};

export default Detalhes;
