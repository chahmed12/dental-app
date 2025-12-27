import { User, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";

const aideSoignantInfo = {
  nom: "Martin",
  prenom: "Sophie",
  email: "sophie.martin@dentalcare.com",
  telephone: "+33 6 12 34 56 78",
  poste: "Assistante dentaire",
  service: "Chirurgie dentaire",
};

const rendezvousPlanifies = [
  {
    id: 1,
    patient: "Jean Dupont",
    dentiste: "Dr. Laurent Bernard",
    date: "2024-12-20",
    heure: "09:00",
    type: "Consultation",
    statut: "Confirmé",
  },
  {
    id: 2,
    patient: "Marie Lambert",
    dentiste: "Dr. Claire Moreau",
    date: "2024-12-20",
    heure: "10:30",
    type: "Détartrage",
    statut: "En attente",
  },
  {
    id: 3,
    patient: "Pierre Martin",
    dentiste: "Dr. Laurent Bernard",
    date: "2024-12-20",
    heure: "14:00",
    type: "Extraction",
    statut: "Confirmé",
  },
  {
    id: 4,
    patient: "Anne Rousseau",
    dentiste: "Dr. Claire Moreau",
    date: "2024-12-21",
    heure: "11:00",
    type: "Blanchiment",
    statut: "Confirmé",
  },
];

import { useNavigate } from "react-router-dom";

const ProfileAideSoignant = () => {
  const navigate = useNavigate();
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
                  {aideSoignantInfo.prenom[0]}{aideSoignantInfo.nom[0]}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                {aideSoignantInfo.prenom} {aideSoignantInfo.nom}
              </h4>
              <p className="text-muted-foreground">{aideSoignantInfo.poste}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{aideSoignantInfo.service}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{aideSoignantInfo.telephone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground break-all">{aideSoignantInfo.email}</span>
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
              {rendezvousPlanifies.map((rdv) => (
                <div
                  key={rdv.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{rdv.heure}</p>
                      <p className="text-sm text-muted-foreground">{rdv.date}</p>
                    </div>
                  </div>

                  <div className="flex-1 sm:border-l sm:border-border sm:pl-4">
                    <p className="font-medium text-foreground">{rdv.patient}</p>
                    <p className="text-sm text-muted-foreground">{rdv.dentiste}</p>
                    <p className="text-sm text-primary">{rdv.type}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${rdv.statut === "Confirmé"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                        }`}
                    >
                      {rdv.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAideSoignant;
