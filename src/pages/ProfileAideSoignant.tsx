import { User, Calendar, Clock, MapPin, Phone, Mail, LogOut, Check, X, Shield, Trash2, Edit2, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for data
interface AideSoignantInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  service: string;
}

interface RendezVous {
  idRv: number;
  dateRv: string;
  heureRv: string;
  statutRv: string;
  detailsRv: string;
  type: string; // Assuming 'type' exists or mapping DETAILS as type
  patient?: {
    nomP: string;
    prenomP: string;
  };
  dentiste?: {
    nomD: string;
    prenomD: string;
  };
}

interface ServiceMedical {
  numSM: number;
  nomSM: string;
  tarifSM: number;
  descriptionSM: string;
}

const ProfileAideSoignant = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [info, setInfo] = useState<AideSoignantInfo>({
    nom: "", prenom: "", email: "", telephone: "", poste: "Dentiste / Aide-Soignant", service: "Clinique Dentaire"
  });
  const [rendezvous, setRendezvous] = useState<RendezVous[]>([]);
  const [services, setServices] = useState<ServiceMedical[]>([]);

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          // Fetch Profile Info - Trying /dentistes/{id} as they are staff
          // Adjust endpoint if AideSoignant has a specific table
          const profileData = await apiRequest<any>(`/dentistes/${user.id}`, "GET");
          if (profileData) {
            setInfo({
              nom: profileData.nomD || user.nom,
              prenom: profileData.prenomD || user.prenom,
              email: profileData.emailD || user.email,
              telephone: profileData.telD || "Non renseigné",
              poste: profileData.specialiteD || "Aide-Soignant",
              service: "Service Dentaire"
            });
          }

          // Fetch Appointments
          // In a real app, this should be /rendezvous/today or similar
          const rdvData = await apiRequest<any[]>("/rendezvous", "GET");
          if (Array.isArray(rdvData)) {
            // Filter to show only appointments for this dentist
            const myRdv = rdvData.filter((r: any) => r.dentiste?.idD === user.id);
            setRendezvous(myRdv);
          }

          // Fetch Services
          const servicesData = await apiRequest<ServiceMedical[]>("/services", "GET");
          if (Array.isArray(servicesData)) {
            setServices(servicesData);
          }

        } catch (err) {
          console.error("Error fetching dashboard data", err);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleUpdateStatus = async (rdv: RendezVous, newStatus: string) => {
    try {
      // Create a payload. The backend might expect the full updated object.
      // We'll trust that the backend can handle a partial update or full update.
      // Based on typical patterns, we send the updated object to a PUT endpoint.
      const updatedRdv = { ...rdv, statutRv: newStatus };

      // Sending PUT to /rendezvous (assuming standard REST update)
      await apiRequest(`/rendezvous`, "PUT", updatedRdv);

      // Update local state to reflect change immediately
      setRendezvous(prev => prev.map(r => r.idRv === rdv.idRv ? { ...r, statutRv: newStatus } : r));
      toast({ title: "Succès", description: "Statut du rendez-vous mis à jour." });
    } catch (error) {
      console.error("Failed to update status", error);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible de mettre à jour le statut." });
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        await apiRequest(`/services/${serviceId}`, "DELETE");
        setServices(prev => prev.filter(s => s.numSM !== serviceId));
        toast({ title: "Service supprimé", description: "Le service a été retiré de la liste." });
      } catch (error) {
        console.error("Failed to delete service", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer le service." });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="page-title">Espace Aide-Soignant</h2>
        <p className="text-muted-foreground mb-6">
          Consultez vos informations professionnelles et les rendez-vous planifiés
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate("/publication")} className="btn-primary">
            Nouvelle Publication
          </button>
          <button onClick={() => { logout(); navigate("/"); }} className="btn-secondary flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Informations professionnelles */}
        <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-dental h-full">
            <h3 className="section-title flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              Informations
            </h3>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full hero-gradient flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-foreground">
                  {info.prenom?.[0]}{info.nom?.[0]}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                {info.prenom} {info.nom}
              </h4>
              <p className="text-muted-foreground">{info.poste}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{info.service}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{info.telephone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground break-all">{info.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rendez-vous planifiés */}
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-dental">
            <h3 className="section-title flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              Rendez-vous planifiés
            </h3>

            <div className="space-y-4">
              {rendezvous.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Aucun rendez-vous planifié.</p>
              ) : (
                rendezvous.map((rdv) => (
                  <div
                    key={rdv.idRv}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{rdv.heureRv}</p>
                        <p className="text-sm text-muted-foreground">{new Date(rdv.dateRv).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex-1 sm:border-l sm:border-border sm:pl-4">
                      <p className="font-medium text-foreground">{rdv.patient?.prenomP} {rdv.patient?.nomP}</p>
                      <p className="text-sm text-muted-foreground">Dr. {rdv.dentiste?.nomD} {rdv.dentiste?.prenomD}</p>
                      <p className="text-sm text-primary">{rdv.detailsRv}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${rdv.statutRv === "CONFIRMÉ"
                          ? "bg-success/10 text-success"
                          : rdv.statutRv === "REFUSÉ" || rdv.statutRv === "ANNULÉ"
                            ? "bg-destructive/10 text-destructive"
                            : rdv.statutRv === "TERMINÉ"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-warning/10 text-warning"
                          }`}
                      >
                        {rdv.statutRv}
                      </span>

                      {rdv.statutRv === "EN ATTENTE" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateStatus(rdv, "CONFIRMÉ")}
                            className="p-1 rounded bg-success/20 text-success hover:bg-success/30"
                            title="Confirmer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(rdv, "REFUSÉ")}
                            className="p-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
                            title="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {rdv.statutRv === "CONFIRMÉ" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateStatus(rdv, "TERMINÉ")}
                            className="p-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                            title="Marquer comme terminé"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )))}
            </div>
          </div>
        </div>

        {/* Mes Services */}
        <div className="lg:col-span-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-dental">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title flex items-center gap-2 mb-0">
                <Package className="w-5 h-5 text-primary" />
                Mes Services
              </h3>
              <button
                onClick={() => navigate("/services/gestion")}
                className="btn-primary text-sm px-4 py-2"
              >
                Ajouter un Service
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  Aucun service disponible.
                </div>
              ) : (
                services.map((service) => (
                  <div key={service.numSM} className="bg-white border p-4 rounded-lg shadow-sm flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground text-lg">{service.nomSM}</h4>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold">
                          {service.tarifSM} TND
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {service.descriptionSM}
                      </p>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleDeleteService(service.numSM)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors"
                        title="Supprimer ce service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div >

      </div >
    </div >
  );
};

export default ProfileAideSoignant;
