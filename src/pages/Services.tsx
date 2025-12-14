import { Stethoscope, Euro } from "lucide-react";

interface ServiceMedical {
  numSM: number;
  nomSM: string;
  typeSM: string;
  descriptionSM: string;
  tarifSM: number;
}

const servicesMedicaux: ServiceMedical[] = [
  {
    numSM: 1,
    nomSM: "Consultation générale",
    typeSM: "Diagnostic",
    descriptionSM: "Examen bucco-dentaire complet avec bilan radiographique si nécessaire. Permet d'établir un diagnostic précis et un plan de traitement adapté.",
    tarifSM: 35,
  },
  {
    numSM: 2,
    nomSM: "Détartrage",
    typeSM: "Hygiène",
    descriptionSM: "Nettoyage professionnel des dents pour éliminer le tartre et la plaque dentaire. Prévient les maladies parodontales.",
    tarifSM: 60,
  },
  {
    numSM: 3,
    nomSM: "Blanchiment dentaire",
    typeSM: "Esthétique",
    descriptionSM: "Traitement esthétique pour éclaircir la couleur naturelle de vos dents et retrouver un sourire éclatant.",
    tarifSM: 350,
  },
  {
    numSM: 4,
    nomSM: "Extraction dentaire",
    typeSM: "Chirurgie",
    descriptionSM: "Extraction simple ou complexe de dents endommagées, de sagesse ou pour préparation orthodontique.",
    tarifSM: 80,
  },
  {
    numSM: 5,
    nomSM: "Pose de couronne",
    typeSM: "Prothèse",
    descriptionSM: "Couronne dentaire céramique ou métallique pour restaurer une dent très abîmée et lui redonner sa fonction.",
    tarifSM: 500,
  },
  {
    numSM: 6,
    nomSM: "Traitement de canal",
    typeSM: "Endodontie",
    descriptionSM: "Traitement de la pulpe dentaire infectée pour sauver une dent. Permet d'éviter l'extraction.",
    tarifSM: 250,
  },
];

const typeColors: Record<string, string> = {
  Diagnostic: "bg-primary/10 text-primary",
  Hygiène: "bg-success/10 text-success",
  Esthétique: "bg-accent text-accent-foreground",
  Chirurgie: "bg-destructive/10 text-destructive",
  Prothèse: "bg-warning/10 text-warning",
  Endodontie: "bg-muted text-muted-foreground",
};

const Services = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="page-title">Nos Services</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Découvrez l'ensemble de nos prestations dentaires. Notre équipe qualifiée vous accompagne pour tous vos besoins bucco-dentaires.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesMedicaux.map((service, index) => (
          <div
            key={service.numSM}
            className="card-dental flex flex-col animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[service.typeSM]}`}>
                {service.typeSM}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">{service.nomSM}</h3>
            <p className="text-muted-foreground text-sm flex-1">{service.descriptionSM}</p>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1 text-primary font-semibold">
                <Euro className="w-4 h-4" />
                <span>{service.tarifSM}</span>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">
                En savoir plus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
