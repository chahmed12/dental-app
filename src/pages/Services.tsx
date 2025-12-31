import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

interface ServiceMedical {
  numSM: number;
  nomSM: string;
  typeSM: string;
  descriptionSM: string;
  tarifSM: number;
}

const typeColors: Record<string, string> = {
  Diagnostic: "bg-primary/10 text-primary",
  Hygiène: "bg-success/10 text-success",
  Esthétique: "bg-accent text-accent-foreground",
  Chirurgie: "bg-destructive/10 text-destructive",
  Prothèse: "bg-warning/10 text-warning",
  Endodontie: "bg-muted text-muted-foreground",
  "Dentisterie générale": "bg-primary/10 text-primary",
  "Diagnostic et soins courants": "bg-primary/10 text-primary",
  Parodontologie: "bg-success/10 text-success",
  "Radiologie et imagerie dentaire": "bg-muted text-muted-foreground",
  "Actes chirurgicaux": "bg-destructive/10 text-destructive",
  "Implantologie": "bg-warning/10 text-warning",
};

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceMedical[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<ServiceMedical[]>("/services", "GET");
        if (data && Array.isArray(data)) {
          setServices(data);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message || "Impossible de charger les services",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="page-title">Nos Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez l'ensemble de nos prestations dentaires. Notre équipe qualifiée vous accompagne pour tous vos besoins bucco-dentaires.
          </p>
        </div>
        <div className="card-dental text-center py-12">
          <p className="text-muted-foreground">Chargement des services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="page-title">Nos Services</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Découvrez l'ensemble de nos prestations dentaires. Notre équipe qualifiée vous accompagne pour tous vos besoins bucco-dentaires.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="card-dental text-center py-12">
          <p className="text-muted-foreground">Aucun service disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.numSM}
              className="card-dental flex flex-col animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[service.typeSM] || "bg-muted text-muted-foreground"}`}>
                  {service.typeSM}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{service.nomSM}</h3>
              <p className="text-muted-foreground text-sm flex-1 line-clamp-3">{service.descriptionSM}</p>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>{service.tarifSM} DT</span>
                </div>
                <button
                  onClick={() => navigate(`/services/${service.numSM}`)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  En savoir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button onClick={() => navigate("/rendez-vous")} className="btn-primary">
          Prendre un rendez-vous
        </button>
      </div>
    </div>
  );
};

export default Services;

