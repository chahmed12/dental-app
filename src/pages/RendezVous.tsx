import { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText, CheckCircle, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/api";

interface Dentiste {
  idD: number;
  nomD: string;
  prenomD: string;
  specialiteD: string;
}

const dentistes: Dentiste[] = [
  { idD: 1, nomD: "Bernard", prenomD: "Laurent", specialiteD: "Chirurgie dentaire" },
  { idD: 2, nomD: "Moreau", prenomD: "Claire", specialiteD: "Orthodontie" },
  { idD: 3, nomD: "Dubois", prenomD: "Marie", specialiteD: "Pédodontie" },
  { idD: 4, nomD: "Lefebvre", prenomD: "Jean", specialiteD: "Implantologie" },
];

// Removed: import { typesService } from "@/lib/constants"; 
// We will fetch services dynamically now.

const heuresDisponibles = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

interface RendezVousForm {
  idD: string;
  dateRv: string;
  heureRv: string;
  detailsRv: string; // Changed from descriptionRv to detailsRv
  statutRv: string; // Added from backend
  actes: ServiceMedical[]; // Renamed from services to actes (list of ActeMedical)
}

interface ServiceMedical {
  numSM: number; // or string depending on backend
  nomSM: string;
  tarifSM: number;
}

const RendezVous = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [errors, setErrors] = useState<Partial<RendezVousForm>>({});
  const [formData, setFormData] = useState<RendezVousForm>({
    idD: "",
    dateRv: "",
    heureRv: "",
    detailsRv: "",
    statutRv: "CONFIRMÉ",
    servicesSelectionnes: [],
  });

  // States for Service Selection
  const [availableServices, setAvailableServices] = useState<ServiceMedical[]>([]);
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState<string>("");
  const [selectedServiceToRemove, setSelectedServiceToRemove] = useState<string>("");

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiRequest<ServiceMedical[]>("/services", "GET");
        if (response && Array.isArray(response)) {
          setAvailableServices(response);
        }
      } catch (error) {
        console.error("Failed to fetch services", error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les services" });
      }
    };
    fetchServices();
  }, [toast]);

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData && userData.isLoggedIn) {
            setIsLoggedIn(true);
            setUser(userData);
          }
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

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
        title: "Inscription requise",
        description: "Veuillez créer un compte pour confirmer votre rendez-vous.",
      });
      navigate("/patient");
      return;
    }

    if (validateForm()) {
      try {
        // Construct Payload for Backend
        // Rendezvous fields
        // ActeMedical entries will be created from servicesSelectionnes

        const payload = {
          idP: user?.id || 1,
          idD: formData.idD,
          dateRv: formData.dateRv,
          heureRv: formData.heureRv,
          detailsRv: formData.detailsRv,
          statutRv: formData.statutRv,
          // Les services sélectionnés créeront des ActeMedical
          servicesIds: formData.servicesSelectionnes.map(s => s.numSM)
        };

        console.log('📤 Sending payload:', payload);

        setIsSubmitted(true);
        toast({
          title: "Rendez-vous confirmé !",
          description: "Votre demande a été enregistrée avec succès.",
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

    if (serviceToAdd && !formData.servicesSelectionnes.find(s => s.numSM === serviceToAdd.numSM)) {
      setFormData(prev => ({
        ...prev,
        servicesSelectionnes: [...prev.servicesSelectionnes, serviceToAdd]
      }));
      setAvailableServices(prev => prev.filter(s => s.numSM !== serviceToAdd.numSM));
      setSelectedServiceToAdd("");
    }
  };

  const handleRemoveService = () => {
    const serviceToRemove = formData.servicesSelectionnes.find(s => s.numSM.toString() === selectedServiceToRemove);

    if (serviceToRemove) {
      setFormData(prev => ({
        ...prev,
        servicesSelectionnes: prev.servicesSelectionnes.filter(s => s.numSM !== serviceToRemove.numSM)
      }));
      setAvailableServices(prev => [...prev, serviceToRemove].sort((a, b) => a.numSM - b.numSM));
      setSelectedServiceToRemove("");
    }
  };

  const selectedDentiste = dentistes.find((d) => d.idD.toString() === formData.idD);

  if (checkingAuth) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

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
        <h2 className="text-2xl font-bold text-red-500 bg-red-100 p-4 rounded-lg inline-block border border-red-200">
          Un sourire éclatant commence ici : <br />
          prenez rendez-vous facilement et rapidement
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Sélection du dentiste */}
        {/* Date & Heure */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="form-label text-blue-800 font-semibold mb-2 block">Date de réservation</label>
            <div className="relative">
              <input
                type="date"
                name="dateRv"
                value={formData.dateRv}
                onChange={handleChange}
                min={today}
                className={`form-input bg-cyan-50 border-cyan-100 text-center uppercase ${errors.dateRv ? "border-destructive" : ""}`}
              />
            </div>
            {errors.dateRv && <p className="text-destructive text-sm mt-1">{errors.dateRv}</p>}
          </div>
          <div>
            <label className="form-label text-blue-800 font-semibold mb-2 block">Heure</label>
            <select
              name="heureRv"
              value={formData.heureRv}
              onChange={handleChange}
              className={`form-input bg-cyan-50 border-cyan-100 text-center ${errors.heureRv ? "border-destructive" : ""}`}
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
        <div className="mb-8 border border-gray-300 p-4 rounded bg-white">
          <h3 className="text-xl text-blue-400 font-bold mb-4 -mt-7 bg-white px-2 inline-block">Choix de services dentaires:</h3>

          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-md">
              <label className="text-center block text-blue-900 italic font-serif mb-1">Liste des services</label>
              <select
                className="form-input bg-cyan-50 border-cyan-100 text-center"
                value={selectedServiceToAdd}
                onChange={(e) => setSelectedServiceToAdd(e.target.value)}
              >
                <option value="">[Choisir service]</option>
                {availableServices.map(s => <option key={s.numSM} value={s.numSM}>{s.nomSM} ({s.tarifSM} DT)</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={handleAddService} className="bg-gray-200 border border-gray-400 px-4 py-1 text-sm font-bold opacity-70 hover:opacity-100">{">>>"}</button>
              <button type="button" onClick={handleRemoveService} className="bg-gray-200 border border-gray-400 px-4 py-1 text-sm font-bold opacity-70 hover:opacity-100">{"<<<"}</button>
            </div>

            <div className="w-full max-w-md">
              <label className="text-center block text-blue-900 italic font-serif mb-1">Services retenus</label>
              <select
                className="form-input bg-cyan-50 border-cyan-100 text-center"
                value={selectedServiceToRemove}
                onChange={(e) => setSelectedServiceToRemove(e.target.value)}
              >
                <option value="">[Choisir pour retirer]</option>
                {formData.servicesSelectionnes.map(s => <option key={s.numSM} value={s.numSM}>{s.nomSM}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Hidden Dentist Selector (keeping for ID logic but hidden or minimized as per user request to follow image) */}
        <div className="mb-6 invisible h-0 overflow-hidden">
          <select name="idD" value={formData.idD} onChange={handleChange}>
            <option value="">Select Dentist</option>
            {dentistes.map((dentiste) => (
              <option key={dentiste.idD} value={dentiste.idD}> {dentiste.nomD} </option>
            ))}
          </select>
        </div>

        {/* Details */}
        <div className="mb-8">
          <label className="form-label text-blue-800 font-semibold mb-2 block text-center">Détails</label>
          <textarea
            name="detailsRv"
            value={formData.detailsRv}
            onChange={handleChange}
            rows={4}
            className={`form-input resize-none bg-cyan-50 border-cyan-100 ${errors.detailsRv ? "border-destructive" : ""}`}
            placeholder="Saisir les détails de rendez-vous.."
          />
          {errors.detailsRv && <p className="text-destructive text-sm mt-1">{errors.detailsRv}</p>}
        </div>

        <div className="flex justify-center">
          <button type="submit" className="btn-primary w-full sm:w-auto min-w-[200px]">
            Confirmer le rendez-vous
          </button>
        </div>
      </form>
    </div>
  );
};

export default RendezVous;
