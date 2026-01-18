import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, Package, Coins, Clock, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { typesService } from "@/lib/constants";

interface ServiceForm {
    nomService: string;
    tarif: string;
    nombreSeance: string;
    image: File | null;
    typeService: string;
    description: string;
}

const GestionServices = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ServiceForm, string>>>({});
    const [formData, setFormData] = useState<ServiceForm>({
        nomService: "",
        tarif: "",
        nombreSeance: "",
        image: null,
        typeService: "",
        description: "",
    });

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ServiceForm, string>> = {};

        if (!formData.nomService.trim()) newErrors.nomService = "Le nom du service est requis";
        if (!formData.tarif.trim()) newErrors.tarif = "Le tarif est requis";
        if (!formData.nombreSeance.trim()) newErrors.nombreSeance = "Le nombre de séances est requis";
        if (!formData.typeService) newErrors.typeService = "Le type de service est requis";
        if (!formData.description.trim()) newErrors.description = "La description est requise";
        // Image is optional but recommended. Let's make it optional for now or require it if desired. 
        // Assuming optional as not specified strictly.

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Since we have a file, we might need FormData if the API supports it.
                // Assuming JSON for now unless file upload logic is specific.
                // For simulation, we'll just alert success.

                // Mapping to Backend Entity "serviceMedical" (numSM, nomSM, typeSM, tarifSM, descriptionSM)
                const payload = {
                    nomSM: formData.nomService,
                    typeSM: formData.typeService,
                    tarifSM: parseFloat(formData.tarif), // Ensure numeric
                    descriptionSM: formData.description,
                    // image: formData.image (Handle as needed, likely ignored in strict JSON entity mapping)
                    // numSM is auto-generated
                };

                // Simulated API call with correct payload structure
                await apiRequest("/services", "POST", payload);

                toast({
                    title: "Service ajouté !",
                    description: "Le nouveau service a été enregistré avec succès. Redirection en cours...",
                });

                // Rediriger vers le profil aide-soignant après 1 seconde
                setTimeout(() => {
                    navigate("/profile-aide-soignant");
                }, 1500);
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: error.message || "Impossible d'ajouter le service",
                });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ServiceForm]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto animate-fade-up">
                <div className="card-dental text-center py-12">
                    <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h2 className="page-title mb-4">Service Ajouté !</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        Le service a été ajouté avec succès à la liste des prestations.
                    </p>
                    <button onClick={() => setIsSubmitted(false)} className="btn-primary">
                        Ajouter un autre service
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 animate-fade-up">
                <h2 className="page-title">Gestion des Services</h2>
                <p className="text-muted-foreground">
                    Ajouter ou modifier les services dentaires proposés
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card-dental animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Nom du service */}
                    <div className="md:col-span-2">
                        <label className="form-label flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Nom du service
                        </label>
                        <input
                            type="text"
                            name="nomService"
                            value={formData.nomService}
                            onChange={handleChange}
                            className={`form-input ${errors.nomService ? "border-destructive" : ""}`}
                            placeholder="Ex: Détartrage complet"
                        />
                        {errors.nomService && <p className="text-destructive text-sm mt-1">{errors.nomService}</p>}
                    </div>

                    {/* Tarif */}
                    <div>
                        <label className="form-label flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary" />
                            Tarif (DT)
                        </label>
                        <input
                            type="number"
                            name="tarif"
                            value={formData.tarif}
                            onChange={handleChange}
                            className={`form-input ${errors.tarif ? "border-destructive" : ""}`}
                            placeholder="0.00"
                        />
                        {errors.tarif && <p className="text-destructive text-sm mt-1">{errors.tarif}</p>}
                    </div>

                    {/* Nombre de séances */}
                    <div>
                        <label className="form-label flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Nombre de séances
                        </label>
                        <input
                            type="number"
                            name="nombreSeance"
                            value={formData.nombreSeance}
                            onChange={handleChange}
                            className={`form-input ${errors.nombreSeance ? "border-destructive" : ""}`}
                            placeholder="1"
                        />
                        {errors.nombreSeance && <p className="text-destructive text-sm mt-1">{errors.nombreSeance}</p>}
                    </div>

                    {/* Type de service */}
                    <div>
                        <label className="form-label flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            Type de service
                        </label>
                        <select
                            name="typeService"
                            value={formData.typeService}
                            onChange={handleChange}
                            className={`form-input ${errors.typeService ? "border-destructive" : ""}`}
                        >
                            <option value="">Sélectionner un type</option>
                            {typesService.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.typeService && <p className="text-destructive text-sm mt-1">{errors.typeService}</p>}
                    </div>

                    {/* Image */}
                    <div>
                        <label className="form-label flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Image illustrative
                        </label>
                        <div className={`flex items-center justify-center w-full`}>
                            <label className={`flex flex-col items-center justify-center w-full h-11 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${errors.image ? "border-destructive" : "border-gray-300"}`}>
                                <div className="flex items-center gap-2 pt-1">
                                    <Upload className="w-4 h-4 text-gray-500" />
                                    <p className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                                        {formData.image ? formData.image.name : "Télécharger image"}
                                    </p>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        {/* No error display for image as it's optional in this logic, but layout prepared */}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="form-label flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`form-input resize-none ${errors.description ? "border-destructive" : ""}`}
                            placeholder="Décrivez le service en détail..."
                        />
                        {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
                    </div>

                </div>

                <div className="mt-8 flex justify-center">
                    <button type="submit" className="btn-primary w-full sm:w-auto min-w-[200px]">
                        Enregistrer le service
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GestionServices;
