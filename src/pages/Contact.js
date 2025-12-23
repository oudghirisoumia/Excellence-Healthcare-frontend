import { MapPin, Phone, Mail } from "lucide-react"
import "../styles/Contact.css"

export default function ContactPage() {
  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>Contactez-nous</h1>
        <p>
          Une question, un conseil ou une demande professionnelle ?
          Notre équipe est à votre écoute.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-grid">

          <div className="contact-form-card">
            <div className="card-title">
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
                <input
                  type="text"
                  placeholder="Commande, produit, partenariat…"
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows="4"
                  placeholder="Votre message..."
                />
              </div>

              <button className="btn-send">
                Envoyer le message
              </button>
            </form>
          </div>

          <div className="contact-info-col">

            <div className="info-card">
              <h3>Informations de contact</h3>

              <div className="info-item">
                <div className="icon-circle">
                  <Phone className="icon" />
                </div>
                <div>
                  <p className="info-label">Téléphone / WhatsApp</p>
                  <p className="info-text">
                    <a href="tel:+212657878992">
                      +212 657 878 992
                    </a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-circle">
                  <Mail className="icon" />
                </div>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-text">
                    <a href="mailto:Digitum.business2020@gmail.com">
                      Digitum.business2020@gmail.com
                    </a>
                  </p>
                  <p className="info-sub">Réponse sous 24h</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-circle">
                  <MapPin className="icon" />
                </div>
                <div>
                  <p className="info-label">Adresse</p>
                  <p className="info-text">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=76+Hay+El+Qods+Bensouda+Fes+Maroc"
                      target="_blank"
                      rel="noreferrer"
                    >
                      76 Hay El Qods Bensouda<br />
                      Fès, Maroc 30030
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="schedule-card">
              <div className="schedule-title">
                <h3>Horaires d'ouverture</h3>
              </div>

              <div className="schedule-row">
                <span>Lundi – Jeudi</span>
                <strong>10h00 – 20h00</strong>
              </div>

              <div className="schedule-row">
                <span>Vendredi</span>
                <strong>15h00 – 20h00</strong>
              </div>

              <div className="schedule-row">
                <span>Samedi</span>
                <strong>10h00 – 20h00</strong>
              </div>

              <div className="schedule-row">
                <span>Dimanche</span>
                <strong className="closed">Fermé</strong>
              </div>
            </div>

            <div className="urgent-card">
              <h3>Besoin d'un conseil rapide ?</h3>
              <p>
                Contactez-nous directement par téléphone ou WhatsApp
                pendant les horaires d’ouverture.
              </p>
            </div>

          </div>
        </div>

        <div className="faq-card" id="faq">
          <h2>Questions fréquentes</h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Comment passer une commande ?</h3>
              <p>
                Choisissez vos produits, ajoutez-les au panier
                et finalisez votre commande en quelques étapes.
              </p>
            </div>

            <div className="faq-item">
              <h3>Livrez-vous partout au Maroc ?</h3>
              <p>
                Oui, nous livrons dans toutes les villes du Maroc.
              </p>
            </div>

            <div className="faq-item">
              <h3>Puis-je commander en gros ?</h3>
              <p>
                Oui, nous proposons des solutions adaptées
                aux professionnels et revendeurs.
              </p>
            </div>

            <div className="faq-item">
              <h3>Les produits sont-ils authentiques ?</h3>
              <p>
                Tous nos produits sont 100% authentiques
                et soigneusement sélectionnés.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}