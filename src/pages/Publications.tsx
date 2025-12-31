import { FileText, Calendar, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

import { apiRequest } from "@/lib/api";

interface Publication {
  idPub: number;
  titre: string;
  resume: string;
  datePublication: string;
  categorie: string;
  auteur?: string;
}



const categorieColors: Record<string, string> = {
  "Hygiène": "bg-success/10 text-success",
  "Innovation": "bg-primary/10 text-primary",
  "Actualités/innovation": "bg-primary/10 text-primary", // Mapped to Innovation style
  "Prévention": "bg-warning/10 text-warning",
  "Esthétique": "bg-accent text-accent-foreground",
  "Article scientifique": "bg-blue-100 text-blue-700",
  "Étude de cas": "bg-gray-100 text-gray-700",
  "Lancement d'un produit ou service": "bg-purple-100 text-purple-700",
};

const Publications = () => {
  const [publicationsList, setPublicationsList] = useState<Publication[]>([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await apiRequest<Publication[]>("/publications", "GET");
        console.log("Publications fetched:", data);
        if (data && Array.isArray(data)) {
          setPublicationsList(data);
        }
      } catch (error) {
        console.error("Failed to fetch publications", error);
      }
    };

    fetchPublications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="page-title">Publications</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Restez informé avec nos articles et conseils santé rédigés par nos experts dentaires.
        </p>
      </div>

      <div className="space-y-6">
        {publicationsList.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>Aucune publication disponible pour le moment.</p>
          </div>
        ) : (
          publicationsList.map((pub, index) => (
            <article
              key={pub.idPub}
              className="card-dental group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-16 h-16 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categorieColors[pub.categorie] || "bg-gray-100 text-gray-800"}`}>
                      {pub.categorie}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(pub.datePublication).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {pub.titre}
                  </h3>
                  <p className="text-muted-foreground mb-3">{pub.resume}</p>
                  <p className="text-sm text-primary font-medium">{pub.auteur || "Dr. Dentiste"}</p>
                </div>

                <div className="flex-shrink-0 self-center">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </article>
          )))}
      </div>
    </div>
  );
};

export default Publications;
