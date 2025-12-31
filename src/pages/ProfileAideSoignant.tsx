import { User, Calendar, Clock, MapPin, Phone, Mail, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";

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



const ProfileAideSoignant = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [info, setInfo] = useState<AideSoignantInfo>({
    nom: "", prenom: "", email: "", telephone: "", poste: "Dentiste / Aide-Soignant", service: "Clinique Dentaire"
  });
  const [rendezvous, setRendezvous] = useState<RendezVous[]>([]);

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
            // Filter or show all? Showing all for staff dashboard usually
            setRendezvous(rdvData);
          }
        } catch (err) {
          console.error("Error fetching dashboard data", err);
        }
      };
      fetchData();
    }
  }, [user]);
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
          <button onClick={() => navigate("/services/gestion")} className="btn-primary">
            Gérer les Services
          </button>
          <button onClick={logout} className="btn-secondary flex items-center gap-2">
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

                    <div className="flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${rdv.statutRv === "CONFIRMÉ"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                          }`}
                      >
                        {rdv.statutRv}
                      </span>
                    </div>
                  </div>
                )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAideSoignant;
