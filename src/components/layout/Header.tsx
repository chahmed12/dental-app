import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Stethoscope, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", label: "Connexion" },
  { path: "/patient", label: "Patient" },
  { path: "/aide-soignant", label: "Aide-soignant" },
  { path: "/services", label: "Service" },
  { path: "/publications", label: "Publication" },
  { path: "/rendez-vous", label: "Rendez-vous" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.isLoggedIn && user.profile === "patient") {
            setUserProfile("patient");
          } else if (user.isLoggedIn && user.profile === "dentiste") {
            setUserProfile("dentiste");
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };

    checkUser();
    // Listen for storage events (though this only works across tabs, inside same tab we might need a custom event or context)
    // For simplicity, we just check on mount and location change (as login redirects)
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [location]);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">DentalCare</span>
          </div>

          {/* Title */}
          <h1 className="hidden lg:block text-lg xl:text-xl font-display text-center text-foreground max-w-xl">
            Un sourire en un clic : simplifiez vos rendez-vous dentaires !
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-link text-sm ${location.pathname === item.path ? "active text-primary" : ""
                  }`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Title */}
        <h1 className="lg:hidden text-center text-sm font-display text-muted-foreground pb-3">
          Un sourire en un clic : simplifiez vos rendez-vous dentaires !
        </h1>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
