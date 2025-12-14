import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Stethoscope, Lock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DentisteForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  sexe: string;
  motDePasse: string;
  confirmMotDePasse: string;
}

const specialites = [
  "Dentisterie générale",
  "Orthodontie",
  "Parodontologie",
  "Endodontie",
  "Chirurgie buccale",
  "Pédodontie",
  "Prosthodontie",
  "Implantologie",
];

const InscriptionDentiste = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<DentisteForm>>({});
  const [formData, setFormData] = useState<DentisteForm>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    specialite: "",
    sexe: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<DentisteForm> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (!/^[0-9+\s-]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }
    if (!formData.specialite) newErrors.specialite = "La spécialité est requise";
    if (!formData.sexe) newErrors.sexe = "Le sexe est requis";
    if (!formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis";
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      toast({
        title: "Inscription réussie !",
        description: "Votre compte professionnel a été créé avec succès.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof DentisteForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up">
        <div className="card-dental text-center py-12">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="page-title mb-4">Inscription réussie !</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Votre compte professionnel a été créé avec succès. Vous pouvez maintenant vous connecter et accéder à votre espace aide-soignant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/")} className="btn-primary">
              Se connecter
            </button>
            <button onClick={() => navigate("/aide-soignant")} className="btn-secondary">
              Voir l'espace professionnel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 animate-fade-up">
        <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="page-title">Inscription Dentiste / Aide-soignant</h2>
        <p className="text-muted-foreground">
          Créez votre compte professionnel pour rejoindre notre équipe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nom */}
          <div>
            <label className="form-label flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={`form-input ${errors.nom ? "border-destructive" : ""}`}
              placeholder="Votre nom"
            />
            {errors.nom && <p className="text-destructive text-sm mt-1">{errors.nom}</p>}
          </div>

          {/* Prénom */}
          <div>
            <label className="form-label flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className={`form-input ${errors.prenom ? "border-destructive" : ""}`}
              placeholder="Votre prénom"
            />
            {errors.prenom && <p className="text-destructive text-sm mt-1">{errors.prenom}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email professionnel
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "border-destructive" : ""}`}
              placeholder="dentiste@clinique.com"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className={`form-input ${errors.telephone ? "border-destructive" : ""}`}
              placeholder="+212 6XX XXX XXX"
            />
            {errors.telephone && <p className="text-destructive text-sm mt-1">{errors.telephone}</p>}
          </div>

          {/* Spécialité */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              Spécialité
            </label>
            <select
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              className={`form-input ${errors.specialite ? "border-destructive" : ""}`}
            >
              <option value="">Sélectionnez</option>
              {specialites.map((specialite) => (
                <option key={specialite} value={specialite}>
                  {specialite}
                </option>
              ))}
            </select>
            {errors.specialite && <p className="text-destructive text-sm mt-1">{errors.specialite}</p>}
          </div>

          {/* Sexe */}
          <div>
            <label className="form-label">Sexe</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sexe"
                  value="M"
                  checked={formData.sexe === "M"}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span>Masculin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sexe"
                  value="F"
                  checked={formData.sexe === "F"}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span>Féminin</span>
              </label>
            </div>
            {errors.sexe && <p className="text-destructive text-sm mt-1">{errors.sexe}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Mot de passe
            </label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              className={`form-input ${errors.motDePasse ? "border-destructive" : ""}`}
              placeholder="••••••••"
            />
            {errors.motDePasse && <p className="text-destructive text-sm mt-1">{errors.motDePasse}</p>}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmMotDePasse"
              value={formData.confirmMotDePasse}
              onChange={handleChange}
              className={`form-input ${errors.confirmMotDePasse ? "border-destructive" : ""}`}
              placeholder="••••••••"
            />
            {errors.confirmMotDePasse && <p className="text-destructive text-sm mt-1">{errors.confirmMotDePasse}</p>}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button type="submit" className="btn-primary w-full sm:w-auto min-w-[200px]">
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour à la connexion
          </button>
        </div>
      </form>
    </div>
  );
};

export default InscriptionDentiste;
