import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope, Coins, Clock, FileText, Package } from "lucide-react";
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

const ServiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [service, setService] = useState<ServiceMedical | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                const data = await apiRequest<ServiceMedical>(`/services/${id}`, "GET");

                if (!data) {
                    throw new Error("Service non trouvé");
                }

                setService(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || "Impossible de charger le service");
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: err.message || "Impossible de charger le service",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchService();
        }
    }, [id, toast]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card-dental text-center py-12">
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card-dental text-center py-12">
                    <p className="text-destructive mb-4">{error || "Service non trouvé"}</p>
                    <button onClick={() => navigate("/services")} className="btn-secondary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour aux services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate("/services")}
                className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors animate-fade-up"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux services
            </button>

            {/* Service Header */}
            <div className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0">
                            <Stethoscope className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">{service.nomSM}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[service.typeSM] || "bg-muted text-muted-foreground"}`}>
                                {service.typeSM}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Service Details */}
                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                            <FileText className="w-5 h-5 text-primary" />
                            Description
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{service.descriptionSM}</p>
                    </div>

                    {/* Tarif */}
                    <div className="pt-6 border-t border-border">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                            <Coins className="w-5 h-5 text-primary" />
                            Tarif
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-primary">{service.tarifSM} DT</span>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-6 border-t border-border bg-secondary/30 rounded-lg p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                            <Package className="w-5 h-5 text-primary" />
                            Informations complémentaires
                        </h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Consultation préalable recommandée
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Prise en charge possible selon votre mutuelle
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Équipement moderne et stérilisé
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-border flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="btn-primary"
                    >
                        Prendre rendez-vous
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
