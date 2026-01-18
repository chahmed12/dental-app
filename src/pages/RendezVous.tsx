import { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText, CheckCircle, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/api";

interface Dentiste {
  idD: number;
  nomD: string;
  prenomD: string;
  specialiteD: string;
}

// Dentistes will be fetched from API


// Removed: import { typesService } from "@/lib/constants"; 
// We will fetch services dynamically now.

const heuresDisponibles = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

interface ServiceMedical {
  numSM: number;
  nomSM: string;
  tarifSM: number;
}

interface ActeMedical {
  serviceMedical: {
    numSM: number;
    nomSM: string;
    tarifSM: number;
  };
  tarifAM: number; // Prix réellement facturé
  descriptionAM: string; // Description spécifique de l'acte
}

interface RendezVousForm {
  idD: string;
  dateRv: string;
  heureRv: string;
  detailsRv: string;
  statutRv: string;
  actes: ActeMedical[]; // Liste des ActeMedical
}

const RendezVous = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn, patientId } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dentistes, setDentistes] = useState<Dentiste[]>([]);

  const [errors, setErrors] = useState<Partial<RendezVousForm>>({});
  const [formData, setFormData] = useState<RendezVousForm>({
    idD: "",
    dateRv: "",
    heureRv: "",
    detailsRv: "",
    statutRv: "EN ATTENTE",
    actes: [],
  });

  // States for Service Selection
  const [availableServices, setAvailableServices] = useState<ServiceMedical[]>([]);
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState<string>("");
  const [selectedServiceToRemove, setSelectedServiceToRemove] = useState<string>("");

  // Fetch Services from API
  // Fetch Services and Dentists from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, dentistesRes] = await Promise.all([
          apiRequest<ServiceMedical[]>("/services", "GET"),
          apiRequest<Dentiste[]>("/dentistes", "GET")
        ]);

        if (servicesRes && Array.isArray(servicesRes)) {
          setAvailableServices(servicesRes);
        }

        if (dentistesRes && Array.isArray(dentistesRes)) {
          setDentistes(dentistesRes);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données" });
      }
    };
    fetchData();
  }, [toast]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RendezVousForm> = {};

    if (!formData.idD) newErrors.idD = "Veuillez sélectionner un dentiste";
    if (!formData.dateRv) newErrors.dateRv = "Veuillez choisir une date";
    if (!formData.heureRv) newErrors.heureRv = "Veuillez choisir une heure";
    if (!formData.detailsRv.trim()) {
      newErrors.detailsRv = "Veuillez décrire le motif de votre rendez-vous";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour confirmer votre rendez-vous.",
      });
      navigate("/");
      return;
    }

    if (validateForm()) {
      try {
        // Construct Payload for Backend with ActeMedical objects
        const payload = {
          dateRv: formData.dateRv,
          heureRv: formData.heureRv,
          statutRv: formData.statutRv,
          detailsRv: formData.detailsRv,
          patient: {
            idP: patientId || user?.id,
          },
          dentiste: {
            idD: parseInt(formData.idD),
          },
          actes: formData.actes.map(acte => ({
            serviceMedical: { numSM: acte.serviceMedical.numSM },
            tarifAM: acte.tarifAM,
            descriptionAM: acte.descriptionAM
          }))
        };

        console.log('📤 Sending payload:', payload);

        await apiRequest("/rendezvous", "POST", payload);

        setIsSubmitted(true);
        toast({
          title: "Demande envoyée !",
          description: "Votre rendez-vous est en attente de validation par le praticien.",
        });

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Erreur lors de la prise de rendez-vous."
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RendezVousForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddService = () => {
    const serviceToAdd = availableServices.find(s => s.numSM.toString() === selectedServiceToAdd);

    if (serviceToAdd && !formData.actes.find(a => a.serviceMedical.numSM === serviceToAdd.numSM)) {
      const newActe: ActeMedical = {
        serviceMedical: serviceToAdd,
        tarifAM: serviceToAdd.tarifSM, // Initialize with standard price
        descriptionAM: "", // Empty description
      };

      setFormData(prev => ({
        ...prev,
        actes: [...prev.actes, newActe]
      }));
      setAvailableServices(prev => prev.filter(s => s.numSM !== serviceToAdd.numSM));
      setSelectedServiceToAdd("");
    }
  };

  const handleRemoveService = () => {
    const acteToRemove = formData.actes.find(a => a.serviceMedical.numSM.toString() === selectedServiceToRemove);

    if (acteToRemove) {
      const serviceToAdd = acteToRemove.serviceMedical;
      setFormData(prev => ({
        ...prev,
        actes: prev.actes.filter(a => a.serviceMedical.numSM !== acteToRemove.serviceMedical.numSM)
      }));
      setAvailableServices(prev => [...prev, serviceToAdd].sort((a, b) => a.numSM - b.numSM));
      setSelectedServiceToRemove("");
    }
  };

  const handleUpdateActeTarif = (numSM: number, newTarif: number) => {
    setFormData(prev => ({
      ...prev,
      actes: prev.actes.map(acte =>
        acte.serviceMedical.numSM === numSM
          ? { ...acte, tarifAM: newTarif }
          : acte
      )
    }));
  };

  const handleUpdateActeDescription = (numSM: number, newDescription: string) => {
    setFormData(prev => ({
      ...prev,
      actes: prev.actes.map(acte =>
        acte.serviceMedical.numSM === numSM
          ? { ...acte, descriptionAM: newDescription }
          : acte
      )
    }));
  };

  const selectedDentiste = dentistes.find((d) => d.idD.toString() === formData.idD);

  // if (!isLoggedIn) check removed to allow guest access until submission

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up">
        <div className="card-dental text-center py-12">
          <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="page-title mb-4">Rendez-vous confirmé !</h2>
          <div className="bg-secondary/50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span>Dr. {selectedDentiste?.prenomD} {selectedDentiste?.nomD}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span>{new Date(formData.dateRv).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span>{formData.heureRv}</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mb-8">
            Un email de confirmation vous sera envoyé avec tous les détails de votre rendez-vous.
          </p>
          <button onClick={() => setIsSubmitted(false)} className="btn-secondary mr-4">
            Prendre un autre rendez-vous
          </button>
          <button onClick={() => navigate("/profile-patient")} className="btn-primary">
            Voir mon dossier
          </button>
        </div>
      </div>
    );
  }

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="page-title text-center">
          Un sourire éclatant commence ici
        </h2>
        <p className="text-muted-foreground text-lg">
          Prenez rendez-vous facilement et rapidement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Date & Heure */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="form-label">Date de réservation</label>
            <div className="relative">
              <input
                type="date"
                name="dateRv"
                value={formData.dateRv}
                onChange={handleChange}
                min={today}
                className={`form-input text-center uppercase ${errors.dateRv ? "border-destructive focus:ring-destructive" : ""}`}
              />
            </div>
            {errors.dateRv && <p className="text-destructive text-sm mt-1">{errors.dateRv}</p>}
          </div>
          <div>
            <label className="form-label">Heure</label>
            <select
              name="heureRv"
              value={formData.heureRv}
              onChange={handleChange}
              className={`form-input text-center ${errors.heureRv ? "border-destructive focus:ring-destructive" : ""}`}
            >
              <option value="">-- : --</option>
              {heuresDisponibles.map((heure) => (
                <option key={heure} value={heure}>
                  {heure}
                </option>
              ))}
            </select>
            {errors.heureRv && <p className="text-destructive text-sm mt-1">{errors.heureRv}</p>}
          </div>
        </div>

        {/* Choix de services dentaires */}
        <div className="mb-8 p-6 rounded-xl bg-secondary/30 border border-border">
          <h3 className="section-title text-xl mb-6">Services dentaires</h3>

          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md">
              <label className="form-label text-center">Liste des services</label>
              <select
                className="form-input text-center"
                value={selectedServiceToAdd}
                onChange={(e) => setSelectedServiceToAdd(e.target.value)}
              >
                <option value="">Sélectionner un service</option>
                {availableServices.map(s => <option key={s.numSM} value={s.numSM}>{s.nomSM} ({s.tarifSM} DT)</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleAddService}
                className="btn-secondary py-2 px-4 hover:bg-primary hover:text-primary-foreground"
                title="Ajouter le service"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemoveService}
                className="btn-secondary py-2 px-4 hover:bg-destructive hover:text-destructive-foreground"
                title="Retirer le service"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-w-md">
              <label className="form-label text-center">Services retenus</label>
              <select
                className="form-input text-center"
                value={selectedServiceToRemove}
                onChange={(e) => setSelectedServiceToRemove(e.target.value)}
              >
                <option value="">Sélectionner pour retirer</option>
                {formData.actes.map(a => <option key={a.serviceMedical.numSM} value={a.serviceMedical.numSM}>{a.serviceMedical.nomSM}</option>)}
              </select>
            </div>
          </div>

          {/* Détails des ActeMedical sélectionnés */}
          {formData.actes.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-semibold text-lg mb-4 text-foreground/80">Détails des actes médicaux</h4>
              <div className="space-y-4">
                {formData.actes.map((acte) => (
                  <div key={acte.serviceMedical.numSM} className="bg-background border border-border rounded-lg p-5 shadow-sm">
                    <div className="mb-3 flex justify-between items-center">
                      <h5 className="font-semibold text-primary">{acte.serviceMedical.nomSM}</h5>
                      <span className="text-sm px-2 py-1 bg-secondary rounded text-muted-foreground">Standard: {acte.serviceMedical.tarifSM} DT</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Tarif facturé</label>
                        <input
                          type="number"
                          step="0.01"
                          value={acte.tarifAM}
                          onChange={(e) => handleUpdateActeTarif(acte.serviceMedical.numSM, parseFloat(e.target.value))}
                          className="form-input h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Description</label>
                        <input
                          type="text"
                          value={acte.descriptionAM}
                          onChange={(e) => handleUpdateActeDescription(acte.serviceMedical.numSM, e.target.value)}
                          placeholder="Détails spécifiques..."
                          className="form-input h-10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dentist Selector */}
        <div className="mb-6">
          <label className="form-label text-center">Choix du dentiste</label>
          <div className="relative max-w-md mx-auto">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              name="idD"
              value={formData.idD}
              onChange={handleChange}
              className={`form-input pl-10 ${errors.idD ? "border-destructive focus:ring-destructive" : ""}`}
            >
              <option value="">-- Sélectionner un dentiste --</option>
              {dentistes.map((dentiste) => (
                <option key={dentiste.idD} value={dentiste.idD}> Dr. {dentiste.nomD} {dentiste.prenomD} ({dentiste.specialiteD}) </option>
              ))}
            </select>
          </div>
          {errors.idD && <p className="text-destructive text-sm mt-1 text-center">{errors.idD}</p>}
        </div>

        {/* Details */}
        <div className="mb-8">
          <label className="form-label text-center">Détails supplémentaires</label>
          <textarea
            name="detailsRv"
            value={formData.detailsRv}
            onChange={handleChange}
            rows={4}
            className={`form-input resize-none ${errors.detailsRv ? "border-destructive focus:ring-destructive" : ""}`}
            placeholder="Saisir les motifs ou détails de rendez-vous..."
          />
          {errors.detailsRv && <p className="text-destructive text-sm mt-1">{errors.detailsRv}</p>}
        </div>

        <div className="flex justify-center">
          <button type="submit" className="btn-primary w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Confirmer le rendez-vous
          </button>
        </div>
      </form>
    </div>
  );
};

export default RendezVous;
