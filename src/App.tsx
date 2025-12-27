import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Connexion from "./pages/Connexion";
import Patient from "./pages/Patient";
import AideSoignant from "./pages/AideSoignant";
import ProfileAideSoignant from "./pages/ProfileAideSoignant";
import ProfilePatient from "./pages/ProfilePatient";
import PublicationForm from "./pages/PublicationForm";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import GestionServices from "./pages/GestionServices";
import Publications from "./pages/Publications";
import RendezVous from "./pages/RendezVous";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Connexion />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/profile-patient" element={<ProfilePatient />} />
            <Route path="/aide-soignant" element={<AideSoignant />} />
            <Route path="/profile-aide-soignant" element={<ProfileAideSoignant />} />
            <Route path="/publication" element={<PublicationForm />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/services/gestion" element={<GestionServices />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/rendez-vous" element={<RendezVous />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
