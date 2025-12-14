import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Connexion from "./pages/Connexion";
import Patient from "./pages/Patient";
import InscriptionDentiste from "./pages/InscriptionDentiste";
import AideSoignant from "./pages/AideSoignant";
import Services from "./pages/Services";
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
            <Route path="/inscription-dentiste" element={<InscriptionDentiste />} />
            <Route path="/aide-soignant" element={<AideSoignant />} />
            <Route path="/services" element={<Services />} />
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
