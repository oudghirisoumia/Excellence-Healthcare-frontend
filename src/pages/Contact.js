import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import "../styles/Contact.css"

export default function ContactPage() {
  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Nous sommes à votre écoute pour toutes vos questions.</p>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          {/* Formulaire */}
          <div className="contact-form-card">
            <div className="card-title">
              <MessageCircle className="icon" />
              <h2>Envoyez-nous un message</h2>
            </div>

            <form className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input type="text" placeholder="Votre nom" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="email@example.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" placeholder="+212 6XX XXX XXX" />
              </div>

              <div className="form-group">
                <label>Sujet *</label>
                <input type="text" placeholder="Ex : Question sur un produit" />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea rows="4" placeholder="Votre message..." />
              </div>

              <button className="btn-send">
                <Send className="icon" />
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Informations */}
          <div className="contact-info-col">
            <div className="info-card">
              <h3>Informations de contact</h3>

              <div className="info-item">
                <div className="icon-circle">
                  <Phone className="icon" />
                </div>
                <div>
                  <p className="info-label">Téléphone</p>
                  <p className="info-text">+212 5XX XXX XXX</p>
                  <p className="info-sub">Lun-Sam : 9h–19h</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-circle">
                  <Mail className="icon" />
                </div>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-text">contact@excellence-pharma.ma</p>
                  <p className="info-sub">Réponse sous 24h</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-circle">
                  <MapPin className="icon" />
                </div>
                <div>
                  <p className="info-label">Adresse</p>
                  <p className="info-text">Avenue Hassan II</p>
                  <p className="info-text">Casablanca, Maroc</p>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="info-card">
              <div className="card-title">
                <Clock className="icon" />
                <h3>Horaires d'ouverture</h3>
              </div>

              <div className="schedule-row">
                <span>Lundi - Vendredi</span>
                <strong>9h00 - 19h00</strong>
              </div>
              <div className="schedule-row">
                <span>Samedi</span>
                <strong>9h00 - 17h00</strong>
              </div>
              <div className="schedule-row">
                <span>Dimanche</span>
                <strong className="closed">Fermé</strong>
              </div>
            </div>

            {/* Aide urgente */}
            <div className="urgent-card">
              <h3>Besoin d'aide urgente ?</h3>
              <p>Notre service client est disponible du lundi au samedi.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-card">
          <h2>Questions fréquentes</h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Comment passer une commande ?</h3>
              <p>
                Parcourez le catalogue, ajoutez vos produits au panier, puis
                suivez les étapes de validation.
              </p>
            </div>

            <div className="faq-item">
              <h3>Délais de livraison ?</h3>
              <p>
                24–48h dans les grandes villes, 3–5 jours pour les autres villes.
              </p>
            </div>

            <div className="faq-item">
              <h3>Puis-je retourner un produit ?</h3>
              <p>
                Oui, retour sous 14 jours pour tout article non ouvert.
              </p>
            </div>

            <div className="faq-item">
              <h3>Les produits sont-ils authentiques ?</h3>
              <p>100% authentiques, provenant directement des laboratoires.</p>
            </div>
          </div>
        </div>

        {/* Points de vente */}
        <div className="stores-section">
          <h2>Nos points de vente</h2>

          <div className="stores-grid">
            <div className="store-card">
              <h3>Casablanca</h3>
              <p>Avenue Hassan II</p>
              <p className="store-phone">+212 5XX XXX XXX</p>
            </div>

            <div className="store-card">
              <h3>Rabat</h3>
              <p>Boulevard Mohammed V</p>
              <p className="store-phone">+212 5XX XXX XXX</p>
            </div>

            <div className="store-card">
              <h3>Fès</h3>
              <p>Avenue des Almohades</p>
              <p className="store-phone">+212 5XX XXX XXX</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
