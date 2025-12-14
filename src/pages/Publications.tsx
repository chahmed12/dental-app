import { FileText, Calendar, ArrowRight } from "lucide-react";

interface Publication {
  id: number;
  titre: string;
  extrait: string;
  date: string;
  auteur: string;
  categorie: string;
}

const publications: Publication[] = [
  {
    id: 1,
    titre: "L'importance du brossage quotidien",
    extrait: "Découvrez les bonnes pratiques pour un brossage efficace et les erreurs à éviter pour préserver votre santé bucco-dentaire.",
    date: "2024-12-15",
    auteur: "Dr. Laurent Bernard",
    categorie: "Hygiène",
  },
  {
    id: 2,
    titre: "Les nouvelles technologies en dentisterie",
    extrait: "Tour d'horizon des innovations qui révolutionnent les soins dentaires : scanner 3D, empreintes numériques, laser...",
    date: "2024-12-10",
    auteur: "Dr. Claire Moreau",
    categorie: "Innovation",
  },
  {
    id: 3,
    titre: "Prévenir les caries chez les enfants",
    extrait: "Guide complet pour protéger les dents de lait et accompagner les enfants dans l'apprentissage de l'hygiène dentaire.",
    date: "2024-12-05",
    auteur: "Dr. Marie Dubois",
    categorie: "Prévention",
  },
  {
    id: 4,
    titre: "Le blanchiment dentaire : mythes et réalités",
    extrait: "Tout ce que vous devez savoir sur le blanchiment dentaire : techniques, résultats attendus et précautions à prendre.",
    date: "2024-11-28",
    auteur: "Dr. Laurent Bernard",
    categorie: "Esthétique",
  },
];

const categorieColors: Record<string, string> = {
  Hygiène: "bg-success/10 text-success",
  Innovation: "bg-primary/10 text-primary",
  Prévention: "bg-warning/10 text-warning",
  Esthétique: "bg-accent text-accent-foreground",
};

const Publications = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <h2 className="page-title">Publications</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Restez informé avec nos articles et conseils santé rédigés par nos experts dentaires.
        </p>
      </div>

      <div className="space-y-6">
        {publications.map((pub, index) => (
          <article
            key={pub.id}
            className="card-dental group cursor-pointer animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-16 h-16 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categorieColors[pub.categorie]}`}>
                    {pub.categorie}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(pub.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {pub.titre}
                </h3>
                <p className="text-muted-foreground mb-3">{pub.extrait}</p>
                <p className="text-sm text-primary font-medium">{pub.auteur}</p>
              </div>

              <div className="flex-shrink-0 self-center">
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Publications;
