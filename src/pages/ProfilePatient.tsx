import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Droplets, Shield, FileText, LogOut, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/api";

interface RendezVous {
    idRv: number;
    dateRv: string;
    heureRv: string;
    statutRv: string;
    detailsRv: string;
    dentiste?: {
        nomD: string;
        prenomD: string;
        specialiteD: string;
    };
    patient?: {
        idP: number;
    };
}

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
    const { logout, patientId } = useAuth();
    const [patient, setPatient] = useState<PatientData | null>(null);
    const [appointments, setAppointments] = useState<RendezVous[]>([]);

    useEffect(() => {
        // Fetch appointments
        if (patientId) {
            const fetchAppointments = async () => {
                try {
                    // Note: Ideally backend should support /rendezvous/patient/{id}
                    // For now, fetching all and filtering (assuming small dataset or temporary solution)
                    const data = await apiRequest<RendezVous[]>("/rendezvous", "GET");
                    if (Array.isArray(data)) {
                        const myAppointments = data.filter(rv => rv.patient?.idP === patientId);
                        setAppointments(myAppointments);
                    }
                } catch (error) {
                    console.error("Failed to fetch appointments", error);
                }
            };
            fetchAppointments();
        }
    }, [patientId]);

    useEffect(() => {
        // Retrieve user data from localStorage for basic info, but preferably fetch fresh data
        if (patientId) {
            const fetchPatientDetails = async () => {
                try {
                    // Fetch full details from backend
                    const data = await apiRequest<any>(`/patients/${patientId}`, "GET");
                    console.log("📥 Patient details received:", data);

                    if (data) {
                        setPatient({
                            nom: data.nomP || data.nom || "",
                            prenom: data.prenomP || data.prenom || "",
                            email: data.emailP || data.email || "",
                            tel: data.telP || data.telephone || "Non renseigné",
                            adresse: data.adresseP || data.adresse || "Non renseignée",
                            dateNaissance: data.dateNP || data.dateNaissance || "Non renseignée",
                            groupeSanguin: data.groupSanguinP || data.groupeSanguin || "Non renseigné",
                            recouvrementSocial: data.recouvrementP || data.recouvrementSocial || "Non renseigné",
                            sexe: data.sexeP || data.sexe || "Non renseigné",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch patient details", error);
                    // Fallback to localStorage if API fails
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser);
                        setPatient({
                            nom: parsedUser.nomP || parsedUser.nom || "",
                            prenom: parsedUser.prenomP || parsedUser.prenom || "",
                            email: parsedUser.emailP || parsedUser.email || "",
                            tel: parsedUser.telP || parsedUser.telephone || "Non renseigné",
                            adresse: parsedUser.adresseP || parsedUser.adresse || "Non renseignée",
                            dateNaissance: parsedUser.dateNP || parsedUser.dateNaissance || "Non renseignée",
                            groupeSanguin: parsedUser.groupSanguinP || parsedUser.groupeSanguin || "Non renseigné",
                            recouvrementSocial: parsedUser.recouvrementP || parsedUser.recouvrementSocial || "Non renseigné",
                            sexe: parsedUser.sexeP || parsedUser.sexe || "Non renseigné",
                        });
                    }
                }
            };
            fetchPatientDetails();
        }
    }, [patientId, navigate]);

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
                <div className="w-24 h-24 rounded-full hero-gradient flex items-center justify-center mx-auto mb-4 relative group cursor-pointer transition-transform hover:scale-105">
                    <span className="text-3xl font-bold text-primary-foreground">
                        {patient.prenom[0]}{patient.nom[0]}
                    </span>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                        logout();
                        navigate("/");
                    }}>
                        <LogOut className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="page-title">Mon Dossier Médical</h2>
                <p className="text-muted-foreground mb-4">
                    Consultez vos informations personnelles et médicales
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => { logout(); navigate("/"); }} className="btn-secondary text-sm px-4 py-1 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                    {/* Just verifying other buttons if needed */}
                </div>
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

                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="text-center py-8 bg-secondary/30 rounded-lg border border-border border-dashed">
                                <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-muted-foreground font-medium">0 rendez-vous récents</p>
                                <p className="text-sm text-muted-foreground/70">Vous n'avez aucun rendez-vous planifié pour le moment.</p>
                            </div>
                        ) : (
                            appointments.map((rv) => (
                                <div key={rv.idRv} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary font-bold">
                                            {new Date(rv.dateRv).getDate()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Dr. {rv.dentiste?.nomD} {rv.dentiste?.prenomD}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-3 h-3" /> {new Date(rv.dateRv).toLocaleDateString()}
                                                <span className="text-gray-300">|</span>
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {rv.heureRv}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${rv.statutRv === 'CONFIRMÉ' ? 'bg-green-100 text-green-700' :
                                            rv.statutRv === 'ANNULÉ' ? 'bg-red-100 text-red-700' :
                                                rv.statutRv === 'TERMINÉ' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {rv.statutRv}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePatient;
