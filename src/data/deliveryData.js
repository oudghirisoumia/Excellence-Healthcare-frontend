// Données de livraison
export const DELIVERY_MODES = [
  { id: "standard", name: "Standard", description: "Livraison en 3-5 jours", basePrice: 4.9 },
  { id: "express", name: "Express", description: "Livraison en 24h", basePrice: 12.9 },
  { id: "cash", name: "Paiement à la livraison", description: "Paiement le jour de la livraison", basePrice: 6.9 },
  { id: "pickup", name: "Retrait en magasin", description: "Gratuit - Retrait dans nos points de vente", basePrice: 0 },
]

export const CARRIERS = [
  { id: "dhl", name: "DHL", color: "#FFD700" },
  { id: "chronopost", name: "Chronopost", color: "#FF6600" },
  { id: "local", name: "Transporteur Local", color: "#0066CC" },
]

export const TIME_SLOTS = [
  { id: "morning", name: "Matin", time: "9h - 12h" },
  { id: "afternoon", name: "Après-midi", time: "12h - 17h" },
  { id: "evening", name: "Soirée", time: "17h - 20h" },
]

export const ORDER_STATUSES = [
  { id: "pending", label: "En attente", color: "#FFA500" },
  { id: "preparing", label: "En préparation", color: "#3498DB" },
  { id: "shipped", label: "Expédiée", color: "#2ECC71" },
  { id: "delivered", label: "Livrée", color: "#27AE60" },
  { id: "returned", label: "Retournée", color: "#E74C3C" },
]
