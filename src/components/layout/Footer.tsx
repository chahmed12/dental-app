import { Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2 animate-slide-horizontal">
            <Mail className="w-5 h-5 text-primary" />
            <a
              href="mailto:developer@dentalcare.com"
              className="hover:text-primary transition-colors"
            >
              developer@dentalcare.com
            </a>
          </div>
          <span className="hidden md:block">•</span>
          <div className="flex items-center gap-2 text-sm">
            <span>Développé avec</span>
            <Heart className="w-4 h-4 text-primary animate-pulse-soft" />
            <span>en React + Vite</span>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          © 2024 DentalCare - Plateforme de rendez-vous dentaires
        </p>
      </div>
    </footer>
  );
};

export default Footer;
