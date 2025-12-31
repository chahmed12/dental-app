/**
 * Hook pour gérer l'authentification
 * Récupère l'utilisateur connecté depuis localStorage
 */

import { useEffect, useState } from "react";

interface AuthUser {
    id: number | string;
    nom: string;
    prenom: string;
    email: string;
    role: "PATIENT" | "DENTISTE";
    profile: "patient" | "dentiste";
    isLoggedIn: boolean;
}

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const userData = JSON.parse(userStr) as AuthUser;
                if (userData && userData.isLoggedIn) {
                    setUser(userData);
                }
            } catch (e) {
                console.error("Erreur lors de la lecture de l'utilisateur", e);
            }
        }
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    // Convertir l'ID en nombre pour le backend (Long)
    const patientId = user?.id ? parseInt(String(user.id), 10) : null;

    return {
        user,
        isLoading,
        isLoggedIn: user?.isLoggedIn ?? false,
        logout,
        patientId,
    };
};
