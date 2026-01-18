import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Stethoscope, CheckCircle, HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

import { diplomes } from "@/lib/constants";

interface AideSoignantForm {
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  email: string;
  motDePasse: string;
  confirmMotDePasse: string;
  dateNaissance: string;
  diplome: string;
  sexe: string;
  photo: File | null;
}

const AideSoignant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<AideSoignantForm>>({});
  const [formData, setFormData] = useState<AideSoignantForm>({
    nom: "",
    prenom: "",
    adresse: "",
    telephone: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
    dateNaissance: "",
    diplome: "",
    sexe: "",
    photo: null,
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<AideSoignantForm> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise";
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    } else if (!/^[0-9+\s-]{8,}$/.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis";
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas";
    }
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.diplome) newErrors.diplome = "Le diplôme est requis";
    if (!formData.sexe) newErrors.sexe = "Le sexe est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔴 Form submitted!');
    console.log('📝 Form data:', formData);

    if (validateForm()) {
      console.log('✅ Validation passed');
      try {
        const { confirmMotDePasse, photo, ...data } = formData;

        const payload = {
          nomD: data.nom,
          prenomD: data.prenom,
          emailD: data.email,
          mdpD: data.motDePasse,
          specialiteD: data.diplome,
          telD: data.telephone,
          adresse: data.adresse,
          sexeD: data.sexe,
          date_naissance: data.dateNaissance,
        };

        console.log('📤 Sending payload:', payload);
        await apiRequest("/auth/register/dentiste", "POST", payload);

        setIsSubmitted(true);
        toast({
          title: "Inscription réussie !",
          description: "Votre compte aide-soignant a été créé avec succès.",
        });
      } catch (error: any) {
        console.error('❌ Registration error:', error);
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message || "Impossible de créer le compte",
        });
      }
    } else {
      console.log('❌ Validation failed, errors:', errors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorKey = name as keyof AideSoignantForm;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
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
            Votre compte aide-soignant a été créé avec succès. Vous pouvez maintenant vous connecter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/")} className="btn-primary">
              Se connecter
            </button>
            <button onClick={() => navigate("/profile-aide-soignant")} className="btn-secondary">
              Voir le profil (Demo)
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
          <HeartPulse className="w-8 h-8 text-accent-foreground" />
        </div>
        <h2 className="page-title">Inscription Aide-Soignant</h2>
        <p className="text-muted-foreground">
          Créez votre compte professionnel pour assister l'équipe dentaire
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
              placeholder="Saisir votre nom.."
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
              placeholder="Saisir votre prénom.."
            />
            {errors.prenom && <p className="text-destructive text-sm mt-1">{errors.prenom}</p>}
          </div>

          {/* Adresse */}
          <div>
            <label className="form-label flex items-center gap-2">
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className={`form-input ${errors.adresse ? "border-destructive" : ""}`}
              placeholder="Saisir votre adresse .."
            />
            {errors.adresse && <p className="text-destructive text-sm mt-1">{errors.adresse}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="form-label flex items-center gap-2">
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className={`form-input ${errors.telephone ? "border-destructive" : ""}`}
              placeholder="Saisir votre téléphone .."
            />
            {errors.telephone && <p className="text-destructive text-sm mt-1">{errors.telephone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="form-label flex items-center gap-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "border-destructive" : ""}`}
              placeholder="Saisir votre E-mail .."
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="form-label flex items-center gap-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              className={`form-input ${errors.motDePasse ? "border-destructive" : ""}`}
              placeholder="Saisir votre mot de passe .."
            />
            {errors.motDePasse && <p className="text-destructive text-sm mt-1">{errors.motDePasse}</p>}
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label className="form-label flex items-center gap-2">
              Confirmer mot de passe
            </label>
            <input
              type="password"
              name="confirmMotDePasse"
              value={formData.confirmMotDePasse}
              onChange={handleChange}
              className={`form-input ${errors.confirmMotDePasse ? "border-destructive" : ""}`}
              placeholder="Confirmer votre mot de passe .."
            />
            {errors.confirmMotDePasse && <p className="text-destructive text-sm mt-1">{errors.confirmMotDePasse}</p>}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="form-label flex items-center gap-2">
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

          {/* Diplome */}
          <div>
            <label className="form-label flex items-center gap-2">
              Diplome
            </label>
            <select
              name="diplome"
              value={formData.diplome}
              onChange={handleChange}
              className={`form-input ${errors.diplome ? "border-destructive" : ""}`}
            >
              <option value="">[Choisir]</option>
              {diplomes.map((diplome) => (
                <option key={diplome} value={diplome}>
                  {diplome}
                </option>
              ))}
            </select>
            {errors.diplome && <p className="text-destructive text-sm mt-1">{errors.diplome}</p>}
          </div>

          {/* Photo */}
          <div>
            <label className="form-label flex items-center gap-2">
              Photo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="button"
                value="Choisir un fichier"
                className="px-3 py-1.5 border border-gray-400 bg-gray-100 text-sm rounded cursor-pointer hover:bg-gray-200"
                onClick={() => document.getElementById('photo-upload')?.click()}
              />
              <span className="text-sm text-gray-600">
                {formData.photo ? formData.photo.name : "Aucun fichier choisi"}
              </span>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Sexe */}
          <div className="flex items-center gap-4">
            <label className="form-label mb-0">Sexe</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sexe"
                  value="H"
                  checked={formData.sexe === "H"}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <span className="italic">Homme</span>
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
                <span className="italic">Femme</span>
              </label>
            </div>
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

export default AideSoignant;
