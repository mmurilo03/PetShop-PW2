import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import Login from "./pages/Login/Login.tsx";
import Home from "./pages/Home/Home.tsx";
import Gerenciar from "./pages/Gerenciar/Gerenciar.tsx";
import FormPet from "./pages/Forms/FormPet.tsx";
import MapPage from "./pages/MapPage/MapPage.tsx";
import FormResponsavel from "./pages/Forms/FormResponsavel.tsx";
import FormAtendimento from "./pages/Forms/FormAtendimento.tsx";
import EditResponsavel from "./pages/Forms/EditResponsavel.tsx";
import Detalhes from "./pages/Detalhes/Detalhes.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/gerenciar" element={<Gerenciar />} />
                <Route path="/gerenciar/form/pet" element={<FormPet />} />
                <Route path="/gerenciar/form/pet/map" element={<MapPage />} />
                <Route path="/gerenciar/form/responsavel" element={<FormResponsavel />} />
                <Route path="/gerenciar/form/atendimento" element={<FormAtendimento />} />
                <Route path="/editar-perfil" element={<EditResponsavel />} />
                <Route path="/detalhes-atendimento/:id" element={<Detalhes />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
