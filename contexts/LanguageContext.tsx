"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.bookings": "My Bookings",
    "nav.payments": "Payments",
    "nav.notifications": "Notifications",
    "nav.profile": "Profile",
    "nav.signOut": "Sign Out",

    // Common
    "common.loading": "Loading...",
    "common.search": "Search...",
    "common.filter": "Filter",
    "common.clear": "Clear",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.add": "Add",
    "common.back": "Back",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.phoneNumber": "Phone Number",
    "auth.location": "Location",
    "auth.welcome": "Welcome back to MobiRent Cameroon",
    "auth.join": "Join MobiRent Cameroon today",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.availableCars": "Available Cars",
    "dashboard.activeBookings": "Active Bookings",
    "dashboard.notifications": "Notifications",
    "dashboard.recentBookings": "Recent Bookings",
    "dashboard.quickActions": "Quick Actions",

    // Cars
    "cars.brand": "Brand",
    "cars.model": "Model",
    "cars.pricePerDay": "Price per Day",
    "cars.status": "Status",
    "cars.available": "Available",
    "cars.booked": "Booked",
    "cars.maintenance": "Maintenance",

    // Bookings
    "bookings.confirmed": "Confirmed",
    "bookings.completed": "Completed",
    "bookings.cancelled": "Cancelled",
    "bookings.pending": "Pending",

    // Payments
    "payments.success": "Success",
    "payments.failed": "Failed",
    "payments.initiated": "Initiated",
    "payments.totalPaid": "Total Paid",
    "payments.downloadReceipt": "Download Receipt",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de bord",
    "nav.bookings": "Mes Réservations",
    "nav.payments": "Paiements",
    "nav.notifications": "Notifications",
    "nav.profile": "Profil",
    "nav.signOut": "Se déconnecter",

    // Common
    "common.loading": "Chargement...",
    "common.search": "Rechercher...",
    "common.filter": "Filtrer",
    "common.clear": "Effacer",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.view": "Voir",
    "common.add": "Ajouter",
    "common.back": "Retour",

    // Auth
    "auth.signIn": "Se connecter",
    "auth.signUp": "S'inscrire",
    "auth.email": "Adresse e-mail",
    "auth.password": "Mot de passe",
    "auth.fullName": "Nom complet",
    "auth.phoneNumber": "Numéro de téléphone",
    "auth.location": "Localisation",
    "auth.welcome": "Bienvenue sur MobiRent Cameroun",
    "auth.join": "Rejoignez MobiRent Cameroun aujourd'hui",

    // Dashboard
    "dashboard.welcome": "Bon retour",
    "dashboard.availableCars": "Voitures Disponibles",
    "dashboard.activeBookings": "Réservations Actives",
    "dashboard.notifications": "Notifications",
    "dashboard.recentBookings": "Réservations Récentes",
    "dashboard.quickActions": "Actions Rapides",

    // Cars
    "cars.brand": "Marque",
    "cars.model": "Modèle",
    "cars.pricePerDay": "Prix par jour",
    "cars.status": "Statut",
    "cars.available": "Disponible",
    "cars.booked": "Réservé",
    "cars.maintenance": "Maintenance",

    // Bookings
    "bookings.confirmed": "Confirmé",
    "bookings.completed": "Terminé",
    "bookings.cancelled": "Annulé",
    "bookings.pending": "En attente",

    // Payments
    "payments.success": "Succès",
    "payments.failed": "Échoué",
    "payments.initiated": "Initié",
    "payments.totalPaid": "Total Payé",
    "payments.downloadReceipt": "Télécharger le reçu",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile } = useAuth()
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load language from user profile or localStorage
    if (userProfile?.language) {
      setLanguageState(userProfile.language as Language)
    } else {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
        setLanguageState(savedLanguage)
      }
    }
  }, [userProfile])

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)

    // Update user profile if logged in
    if (user) {
      try {
        await supabase.from("users").update({ language: lang }).eq("id", user.id)
      } catch (error) {
        console.error("Error updating language preference:", error)
      }
    }
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
