import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categoriesPublication } from "@/lib/constants";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.titre || !formData.date || !formData.categorie || !formData.resume) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires.",
            });
            return;
        }

        // Mock saving to localStorage to simulate backend persistence
        const newPublication = {
            id: Date.now(),
            titre: formData.titre,
            extrait: formData.resume,
            date: formData.date,
            auteur: "Aide-Soignant (Moi)", // Static for now or fetch from user session
            categorie: formData.categorie,
            // files would be uploaded to backend in real app
        };

        const existingPubs = localStorage.getItem("publications");
        const pubs = existingPubs ? JSON.parse(existingPubs) : [];
        localStorage.setItem("publications", JSON.stringify([newPublication, ...pubs]));

        toast({
            title: "Publication créée !",
            description: "Votre article a été publié avec succès.",
        });

        navigate("/publications");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
                <h2 className="page-title">Nouvelle Publication</h2>
                <p className="text-muted-foreground">
                    Rédigez un nouvel article pour informer vos patients
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Titre */}
                    <div>
                        <label className="form-label text-blue-900 font-semibold mb-2 block text-center">Titre</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            className="form-input bg-cyan-50 border-cyan-100 text-center"
                            placeholder="Saisir le titre de publication .."
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="form-label text-blue-900 font-semibold mb-2 block text-center">date de publication</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="form-input bg-cyan-50 border-cyan-100 text-center"
                            placeholder="jj/mm/aaaa"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Fichier */}
                    <div>
                        <label className="form-label text-blue-900 font-semibold mb-2 block text-center">Fichier</label>
                        <div className="bg-cyan-50 border border-cyan-100 rounded p-2 flex items-center justify-between">
                            <input
                                type="button"
                                value="Choisir un fichier"
                                className="px-3 py-1 bg-gray-100 border border-gray-300 text-sm rounded cursor-pointer hover:bg-gray-200"
                                onClick={() => document.getElementById('fichier-upload')?.click()}
                            />
                            <span className="text-sm text-blue-500 truncate ml-2">
                                {formData.fichier ? formData.fichier.name : "Aucun fichier choisi"}
                            </span>
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
                        <label className="form-label text-blue-900 font-semibold mb-2 block text-center">Affiche</label>
                        <div className="bg-cyan-50 border border-cyan-100 rounded p-2 flex items-center justify-between">
                            <input
                                type="button"
                                value="Choisir un fichier"
                                className="px-3 py-1 bg-gray-100 border border-gray-300 text-sm rounded cursor-pointer hover:bg-gray-200"
                                onClick={() => document.getElementById('affiche-upload')?.click()}
                            />
                            <span className="text-sm text-blue-500 truncate ml-2">
                                {formData.affiche ? formData.affiche.name : "Aucun fichier choisi"}
                            </span>
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
                        <label className="form-label text-blue-900 font-semibold mb-2 block text-center">Type de publication</label>
                        <select
                            name="categorie"
                            value={formData.categorie}
                            onChange={handleChange}
                            className="form-input bg-cyan-50 border-cyan-100 text-center"
                        >
                            <option value="">[Choisir catégorie]</option>
                            {categoriesPublication.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Résumé */}
                    <div>
                        <label className="form-label text-blue-900 font-semibold mb-2 block text-center">Résumé</label>
                        <textarea
                            name="resume"
                            value={formData.resume}
                            onChange={handleChange}
                            rows={4}
                            className="form-input bg-cyan-50 border-cyan-100 resize-none"
                            placeholder="Saisir la description associée .."
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded text-lg transition-colors min-w-[200px]">
                        Enregistrer
                    </button>
                    <button type="button" onClick={() => navigate("/profile-aide-soignant")} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded text-lg transition-colors min-w-[200px]">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PublicationForm;
