import { Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2 animate-slide-horizontal">
            <Mail className="w-5 h-5 text-primary" />
            <a
              href="mailto:cheikhahmed.zenvour@etudiant-enit.utm.tn"
              className="hover:text-primary transition-colors"
            >
              cheikhahmed.zenvour@etudiant-enit.utm.tn
            </a>
          </div>

        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          © 2026 SmileClinic - Plateforme de rendez-vous dentaires
        </p>
      </div>
    </footer>
  );
};

export default Footer;
