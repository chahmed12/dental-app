import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { categoriesPublication } from "@/lib/constants";
import { apiRequest } from "@/lib/api";

interface PublicationFormState {
    titre: string;
    date: string;
    categorie: string;
    resume: string;
    fichier: File | null;
    affiche: File | null;
}

const PublicationForm = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const [formData, setFormData] = useState<PublicationFormState>({
        titre: "",
        date: new Date().toISOString().split("T")[0],
        categorie: "",
        resume: "",
        fichier: null,
        affiche: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "fichier" | "affiche") => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.titre || !formData.date || !formData.categorie || !formData.resume) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires.",
            });
            return;
        }

        try {
            const payload = {
                titre: formData.titre,
                resume: formData.resume,
                datePublication: formData.date,
                categorie: formData.categorie,
                auteur: user ? `Dr. ${user.nom} ${user.prenom}` : "Cabinet Dentaire",
                // photo/fichier handling depends on backend capability (multipart vs base64 vs omitted)
                // For now, sending text data as per basic entity
            };

            await apiRequest("/publications", "POST", payload);

            toast({
                title: "Publication créée !",
                description: "Votre article a été publié avec succès.",
            });

            navigate("/publications");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Erreur lors de la création de la publication.",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
                <h2 className="page-title">Nouvelle Publication</h2>
                <p className="text-muted-foreground text-lg">
                    Rédigez un nouvel article pour informer vos patients
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Titre */}
                    <div>
                        <label className="form-label text-center">Titre</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            className="form-input text-center"
                            placeholder="Saisir le titre..."
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="form-label text-center">Date de publication</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="form-input text-center"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Fichier */}
                    <div>
                        <label className="form-label text-center">Fichier</label>
                        <div
                            className="form-input flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => document.getElementById('fichier-upload')?.click()}
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm truncate max-w-[150px]">
                                    {formData.fichier ? formData.fichier.name : "Choisir un fichier"}
                                </span>
                            </div>
                            <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground font-medium">Parcourir</span>
                            <input
                                id="fichier-upload"
                                type="file"
                                onChange={(e) => handleFileChange(e, "fichier")}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Affiche */}
                    <div>
                        <label className="form-label text-center">Image de couverture</label>
                        <div
                            className="form-input flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => document.getElementById('affiche-upload')?.click()}
                        >
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-sm truncate max-w-[150px]">
                                    {formData.affiche ? formData.affiche.name : "Choisir une image"}
                                </span>
                            </div>
                            <span className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground font-medium">Parcourir</span>
                            <input
                                id="affiche-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "affiche")}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Type de publication */}
                    <div>
                        <label className="form-label text-center">Catégorie</label>
                        <div className="relative">
                            <select
                                name="categorie"
                                value={formData.categorie}
                                onChange={handleChange}
                                className="form-input text-center appearance-none"
                            >
                                <option value="">-- Sélectionner une catégorie --</option>
                                {categoriesPublication.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Résumé */}
                    <div>
                        <label className="form-label text-center">Résumé</label>
                        <textarea
                            name="resume"
                            value={formData.resume}
                            onChange={handleChange}
                            rows={4}
                            className="form-input resize-none"
                            placeholder="Bref résumé de la publication..."
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-border">
                    <button type="submit" className="btn-primary min-w-[200px] flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5" />
                        Publier
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/profile-aide-soignant")}
                        className="btn-secondary min-w-[200px]"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PublicationForm;
