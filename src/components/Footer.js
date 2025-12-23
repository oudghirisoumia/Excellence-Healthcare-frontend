import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* BRAND */}
        <div className="footer-section">
          <div className="footer-brand">
            <h3>Excellence Healthcare</h3>
            <p>
              Grossiste et détaillant en parapharmacie,
              santé, beauté et bien-être.
            </p>
            <p className="footer-slogan">الأفضل لصحتك وجمالك</p>
          </div>

          <div className="footer-social footer-social--compact">
            <a
              href="https://www.instagram.com/excellence_parapharmacie"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <i className="fab fa-instagram"></i>
              <span>@excellence_parapharmacie</span>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61569237020560"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <i className="fab fa-facebook-f"></i>
              <span>Excellence Healthcare</span>
            </a>

            <a
              href="https://wa.me/212657878992"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              <i className="fab fa-whatsapp"></i>
              <span>+212 657 878 992</span>
            </a>
          </div>
        </div>

        {/* SERVICE CLIENT */}
        <div className="footer-section">
          <h4>Service client</h4>
          <ul>
            <li>
              <a href="/contact">Contactez-nous</a>
            </li>
            <li>
              <a href="/contact#faq">Questions fréquentes</a>
            </li>
          </ul>
        </div>

        {/* À PROPOS */}
        <div className="footer-section">
          <h4>À propos</h4>
          <ul>
            <li>
              <a href="/about#qui-sommes-nous">Qui sommes-nous</a>
            </li>
            <li>
              <a href="/about#services">Nos services</a>
            </li>
            <li>
              <a href="/about#valeurs">Nos valeurs</a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h4>Contact</h4>

          <div className="contact-info">
            <p>
              <i className="fas fa-phone"></i>
              <a href="tel:+212657878992">+212 657 878 992</a>
            </p>

            <p>
              <i className="fas fa-envelope"></i>
              <a href="mailto:Digitum.business2020@gmail.com">
                Digitum.business2020@gmail.com
              </a>
            </p>

            <p>
              <i className="fas fa-map-marker-alt"></i>
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

      <div className="footer-bottom">
        <p>&copy; 2025 Excellence Healthcare. Tous droits réservés.</p>

        <div className="footer-legal">
          <a href="#mentions">Mentions légales</a> |{" "}
          <a href="#confidentialite">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  )
}