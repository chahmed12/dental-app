import { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText, CheckCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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

const heuresDisponibles = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

interface RendezVousForm {
  idD: string;
  dateRv: string;
  heureRv: string;
  descriptionRv: string;
}

const RendezVous = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [errors, setErrors] = useState<Partial<RendezVousForm>>({});
  const [formData, setFormData] = useState<RendezVousForm>({
    idD: "",
    dateRv: "",
    heureRv: "",
    descriptionRv: "",
  });

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.isLoggedIn) {
            setIsLoggedIn(true);
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
    if (!formData.descriptionRv.trim()) {
      newErrors.descriptionRv = "Veuillez décrire le motif de votre rendez-vous";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      toast({
        title: "Rendez-vous confirmé !",
        description: "Vous recevrez un email de confirmation.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RendezVousForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const selectedDentiste = dentistes.find((d) => d.idD.toString() === formData.idD);

  if (checkingAuth) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up">
        <div className="card-dental text-center py-12">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="page-title mb-4">Connexion requise</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Vous devez être connecté à votre espace patient pour prendre un rendez-vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary min-w-[200px]">
              Se connecter
            </Link>
            <Link to="/patient" className="btn-secondary min-w-[200px]">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <button onClick={() => setIsSubmitted(false)} className="btn-secondary">
            Prendre un autre rendez-vous
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
        <h2 className="page-title">Prendre rendez-vous</h2>
        <p className="text-muted-foreground">
          Sélectionnez votre dentiste et choisissez le créneau qui vous convient
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Sélection du dentiste */}
        <div className="mb-6">
          <label className="form-label flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Choisir un dentiste
          </label>
          <select
            name="idD"
            value={formData.idD}
            onChange={handleChange}
            className={`form-input ${errors.idD ? "border-destructive" : ""}`}
          >
            <option value="">Sélectionnez un dentiste</option>
            {dentistes.map((dentiste) => (
              <option key={dentiste.idD} value={dentiste.idD}>
                Dr. {dentiste.prenomD} {dentiste.nomD} - {dentiste.specialiteD}
              </option>
            ))}
          </select>
          {errors.idD && <p className="text-destructive text-sm mt-1">{errors.idD}</p>}
        </div>

        {/* Dentiste sélectionné */}
        {selectedDentiste && (
          <div className="mb-6 p-4 rounded-lg bg-accent/50 border border-accent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {selectedDentiste.prenomD[0]}{selectedDentiste.nomD[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Dr. {selectedDentiste.prenomD} {selectedDentiste.nomD}
                </p>
                <p className="text-sm text-muted-foreground">{selectedDentiste.specialiteD}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Date */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date du rendez-vous
            </label>
            <input
              type="date"
              name="dateRv"
              value={formData.dateRv}
              onChange={handleChange}
              min={today}
              className={`form-input ${errors.dateRv ? "border-destructive" : ""}`}
            />
            {errors.dateRv && <p className="text-destructive text-sm mt-1">{errors.dateRv}</p>}
          </div>

          {/* Heure */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Heure du rendez-vous
            </label>
            <select
              name="heureRv"
              value={formData.heureRv}
              onChange={handleChange}
              className={`form-input ${errors.heureRv ? "border-destructive" : ""}`}
            >
              <option value="">Sélectionnez une heure</option>
              {heuresDisponibles.map((heure) => (
                <option key={heure} value={heure}>
                  {heure}
                </option>
              ))}
            </select>
            {errors.heureRv && <p className="text-destructive text-sm mt-1">{errors.heureRv}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="form-label flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Motif du rendez-vous
          </label>
          <textarea
            name="descriptionRv"
            value={formData.descriptionRv}
            onChange={handleChange}
            rows={4}
            className={`form-input resize-none ${errors.descriptionRv ? "border-destructive" : ""}`}
            placeholder="Décrivez brièvement le motif de votre consultation..."
          />
          {errors.descriptionRv && <p className="text-destructive text-sm mt-1">{errors.descriptionRv}</p>}
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
