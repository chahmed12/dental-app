import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Stethoscope, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

type ProfileType = "patient" | "dentiste" | null;

interface LoginForm {
  email: string;
  motDePasse: string;
}

const Connexion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>(null);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    motDePasse: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.motDePasse.trim()) {
      newErrors.motDePasse = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await apiRequest<any>("/auth/login", "POST", {
          email: formData.email,
          motDePasse: formData.motDePasse,
        });

        // DEBUG: Inspecter la réponse (supprimé)
        // alert("Réponse du serveur: " + JSON.stringify(response));

        if (!response || !response.id) {
          throw new Error("Identifiants incorrects ou utilisateur inexistant.");
        }

        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${response.prenom} ${response.nom}`,
        });

        // Determine profile based on backend role
        const profile = response.role === "PATIENT" ? "patient" : "dentiste";

        // Persist login state with real data
        localStorage.setItem("user", JSON.stringify({
          ...response,
          profile: profile,
          isLoggedIn: true
        }));

        if (profile === "patient") {
          navigate("/profile-patient");
        } else {
          navigate("/profile-aide-soignant");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: error.message || "Impossible de se connecter",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({ email: "", motDePasse: "" });
    setErrors({});
  };

  const handleBackToSelection = () => {
    setSelectedProfile(null);
    resetForm();
  };

  // Écran de sélection de profil
  if (!selectedProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="page-title">Bienvenue sur DentalCare</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choisissez votre profil pour accéder à votre espace personnel et gérer vos rendez-vous dentaires en toute simplicité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient Card */}
          <button
            onClick={() => setSelectedProfile("patient")}
            className="card-dental group text-left cursor-pointer"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  Patient
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </h3>
                <p className="text-muted-foreground">
                  Connectez-vous pour consulter vos rendez-vous et accéder à vos services dentaires.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Connexion sécurisée
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Prise de rendez-vous en ligne
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Historique des consultations
                </li>
              </ul>
            </div>
          </button>

          {/* Aide-soignant / Dentiste Card */}
          <button
            onClick={() => setSelectedProfile("dentiste")}
            className="card-dental group text-left cursor-pointer"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  Aide-soignant / Dentiste
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </h3>
                <p className="text-muted-foreground">
                  Accédez à votre espace professionnel pour consulter les rendez-vous planifiés.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground"></span>
                  Consultation des plannings
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground"></span>
                  Gestion des rendez-vous
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground"></span>
                  Suivi des patients
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Formulaire de connexion
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-up">
        <div className={`w-16 h-16 rounded-xl ${selectedProfile === "patient" ? "hero-gradient" : "bg-accent"} flex items-center justify-center mx-auto mb-4`}>
          {selectedProfile === "patient" ? (
            <User className="w-8 h-8 text-primary-foreground" />
          ) : (
            <Stethoscope className="w-8 h-8 text-accent-foreground" />
          )}
        </div>
        <h2 className="page-title">
          Connexion {selectedProfile === "patient" ? "Patient" : "Professionnel"}
        </h2>
        <p className="text-muted-foreground">
          Entrez vos identifiants pour accéder à votre espace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
        {/* Email */}
        <div className="mb-6">
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
            placeholder={selectedProfile === "patient" ? "patient@exemple.com" : "dentiste@clinique.com"}
          />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Mot de passe */}
        <div className="mb-6">
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

        <button type="submit" className="btn-primary w-full mb-4">
          Se connecter
        </button>

        <div className="text-center space-y-3">
          {selectedProfile === "patient" ? (
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/patient")}
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                Inscrivez-vous
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/aide-soignant")}
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                Inscrivez-vous
              </button>
            </p>
          )}

          <button
            type="button"
            onClick={handleBackToSelection}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour à la sélection du profil
          </button>
        </div>
      </form>
    </div>
  );
};

export default Connexion;
