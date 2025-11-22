import { Link } from "react-router-dom"
import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h3>Excellence Parapharmacie</h3>
            <p>Votre parapharmacie en ligne de confiance depuis 2020.</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>Service Client</h4>
          <ul>
            <li>
              <Link to="/">FAQ</Link>
            </li>
            <li>
              <Link to="/checkout">Livraison</Link>
            </li>
            <li>
              <Link to="/order-tracking">Retours</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>À propos</h4>
          <ul>
            <li>
              <a href="#histoire">Notre histoire</a>
            </li>
            <li>
              <a href="#pharmaciens">Nos pharmaciens</a>
            </li>
            <li>
              <a href="#blog">Blog santé</a>
            </li>
            <li>
              <a href="#recrutement">Recrutement</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <p>
              <i className="fas fa-phone"></i> +212 5XX XXX XXX
            </p>
            <p>
              <i className="fas fa-envelope"></i> contact@excellence-pharma.ma
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> Avenue Hassan II
              <br />
              Casablanca, Maroc
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Excellence Parapharmacie. Tous droits réservés.</p>
        <div className="footer-legal">
          <a href="#mentions">Mentions légales</a> | <a href="#confidentialite">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  )
}
