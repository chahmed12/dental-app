import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Droplets, Lock, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientForm {
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string;
  groupeSanguin: string;
  sexe: string;
  motDePasse: string;
  confirmMotDePasse: string;
  recouvrementSocial: string;
}

const groupesSanguins = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Patient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<PatientForm>>({});
  const [formData, setFormData] = useState<PatientForm>({
    nom: "",
    prenom: "",
    email: "",
    dateNaissance: "",
    groupeSanguin: "",
    sexe: "",
    motDePasse: "",
    confirmMotDePasse: "",
    recouvrementSocial: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientForm> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.groupeSanguin) newErrors.groupeSanguin = "Le groupe sanguin est requis";
    if (!formData.sexe) newErrors.sexe = "Le sexe est requis";
    if (!formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis";
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
    }
    if (!formData.recouvrementSocial.trim()) {
      newErrors.recouvrementSocial = "Le recouvrement social est requis";
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
        description: "Votre dossier médical a été créé avec succès.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PatientForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up">
        <div className="card-dental text-center py-12">
          <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="page-title mb-4">Inscription réussie !</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Votre dossier médical a été créé avec succès. Consultez la liste des dentistes disponibles et prenez rendez-vous dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/rendez-vous")} className="btn-primary">
              Prendre rendez-vous
            </button>
            <button onClick={() => navigate("/services")} className="btn-secondary">
              Voir les services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8 animate-fade-up">
        <h2 className="page-title">Inscription Patient</h2>
        <p className="text-muted-foreground">
          Remplissez le formulaire ci-dessous pour créer votre dossier médical
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
          <div className="md:col-span-2">
            <label className="form-label flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "border-destructive" : ""}`}
              placeholder="votre.email@exemple.com"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Date de naissance
            </label>
            <input
              type="date"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              className={`form-input ${errors.dateNaissance ? "border-destructive" : ""}`}
            />
            {errors.dateNaissance && <p className="text-destructive text-sm mt-1">{errors.dateNaissance}</p>}
          </div>

          {/* Groupe sanguin */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              Groupe sanguin
            </label>
            <select
              name="groupeSanguin"
              value={formData.groupeSanguin}
              onChange={handleChange}
              className={`form-input ${errors.groupeSanguin ? "border-destructive" : ""}`}
            >
              <option value="">Sélectionnez</option>
              {groupesSanguins.map((groupe) => (
                <option key={groupe} value={groupe}>
                  {groupe}
                </option>
              ))}
            </select>
            {errors.groupeSanguin && <p className="text-destructive text-sm mt-1">{errors.groupeSanguin}</p>}
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

          {/* Recouvrement social */}
          <div>
            <label className="form-label flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Recouvrement social
            </label>
            <input
              type="text"
              name="recouvrementSocial"
              value={formData.recouvrementSocial}
              onChange={handleChange}
              className={`form-input ${errors.recouvrementSocial ? "border-destructive" : ""}`}
              placeholder="Numéro de sécurité sociale"
            />
            {errors.recouvrementSocial && <p className="text-destructive text-sm mt-1">{errors.recouvrementSocial}</p>}
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

        <div className="mt-8 flex justify-center">
          <button type="submit" className="btn-primary w-full sm:w-auto min-w-[200px]">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Patient;
