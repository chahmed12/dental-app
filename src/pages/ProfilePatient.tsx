import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Droplets, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientData {
    nom: string;
    prenom: string;
    email: string;
    tel?: string;
    adresse?: string;
    dateNaissance?: string;
    groupeSanguin?: string;
    recouvrementSocial?: string;
    sexe?: string;
}

const ProfilePatient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientData | null>(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Map backend fields to frontend interface if needed, or stick to what's stored
                // Backend response usually has: nom, prenom, email, etc.
                // Let's assume the stored object has compatible fields or map them
                setPatient({
                    nom: parsedUser.nom || parsedUser.nomP || "",
                    prenom: parsedUser.prenom || parsedUser.prenomP || "",
                    email: parsedUser.email || parsedUser.emailP || "",
                    tel: parsedUser.tel || parsedUser.telP || "Non renseigné",
                    adresse: parsedUser.adresse || parsedUser.adresseP || "Non renseignée",
                    dateNaissance: parsedUser.dateN || parsedUser.dateNP || "Non renseignée",
                    groupeSanguin: parsedUser.groupeSanguin || parsedUser.groupeSanguinP || "Non renseigné",
                    recouvrementSocial: parsedUser.recouvrement || parsedUser.recouvrementP || "Non renseigné",
                    sexe: parsedUser.sexe || parsedUser.sexeP || "Non renseigné",
                });
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        } else {
            // Redirect to login if no user found (optional, but good practice)
            // navigate("/");
        }
    }, [navigate]);

    if (!patient) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Chargement du profil...</p>
                <button onClick={() => navigate("/")} className="mt-4 text-primary hover:underline">
                    Se connecter
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-up">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full hero-gradient flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary-foreground">
                        {patient.prenom[0]}{patient.nom[0]}
                    </span>
                </div>
                <h2 className="page-title">Mon Dossier Médical</h2>
                <p className="text-muted-foreground">
                    Consultez vos informations personnelles et médicales
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Informations Personnelles */}
                <div className="card-dental h-full">
                    <h3 className="section-title flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-primary" />
                        Informations Personnelles
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Nom complet</p>
                                <p className="font-medium text-foreground">{patient.prenom} {patient.nom}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Date de naissance</p>
                                <p className="font-medium text-foreground">{patient.dateNaissance}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Sexe</p>
                                <p className="font-medium text-foreground">
                                    {patient.sexe === "M" ? "Masculin" : patient.sexe === "F" ? "Féminin" : patient.sexe}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coordonnées */}
                <div className="card-dental h-full">
                    <h3 className="section-title flex items-center gap-2 mb-6">
                        <Phone className="w-5 h-5 text-primary" />
                        Coordonnées
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium text-foreground break-all">{patient.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Téléphone</p>
                                <p className="font-medium text-foreground">{patient.tel}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Adresse</p>
                                <p className="font-medium text-foreground">{patient.adresse}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations Médicales */}
                <div className="card-dental h-full md:col-span-2">
                    <h3 className="section-title flex items-center gap-2 mb-6">
                        <FileText className="w-5 h-5 text-primary" />
                        Informations Médicales
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        <div className="flex items-start gap-3">
                            <Droplets className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Groupe Sanguin</p>
                                <p className="text-lg font-semibold text-foreground">{patient.groupeSanguin}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Shield className="w-4 h-4 text-primary mt-1" />
                            <div>
                                <p className="text-sm text-muted-foreground">Couverture Sociale</p>
                                <p className="font-medium text-foreground">{patient.recouvrementSocial}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mes Rendez-vous */}
                <div className="card-dental h-full md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="section-title flex items-center gap-2 mb-0">
                            <Calendar className="w-5 h-5 text-primary" />
                            Mes Rendez-vous
                        </h3>
                        <button onClick={() => navigate("/rendez-vous")} className="btn-primary text-sm px-4 py-2">
                            Prendre rendez-vous
                        </button>
                    </div>

                    <div className="text-center py-8 bg-secondary/30 rounded-lg border border-border border-dashed">
                        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground font-medium">0 rendez-vous récents</p>
                        <p className="text-sm text-muted-foreground/70">Vous n'avez aucun rendez-vous planifié pour le moment.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePatient;
