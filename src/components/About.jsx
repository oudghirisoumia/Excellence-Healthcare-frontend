import React from "react";
import "../styles/About.css";

import heroImg from "../assets/whyus.png";
import missionImg from "../assets/mission.png";
import whyImg from "../assets/us.png";

const About = () => {
  return (
    <div className="about-page">

      <section className="about-hero" id="qui-sommes-nous">

        <div className="about-hero-text">
          <h1>À propos de Excellence Healthcare</h1>
          <p className="about-slogan">الأفضل لصحتك وجمالك</p>
          <p>
            Excellence Healthcare est une parapharmacie moderne spécialisée
            dans les produits de santé, de beauté et de bien-être.
            Nous proposons une large sélection de produits authentiques,
            disponibles en ligne et dans notre magasin à Fès,
            avec livraison partout au Maroc.
          </p>
        </div>

        <div className="about-hero-image">
          <img src={heroImg} alt="Excellence Healthcare" />
        </div>
      </section>

      <section className="about-mission">
        <div className="mission-image">
          <img src={missionImg} alt="Notre mission" />
        </div>

        <div className="mission-text">
          <h2>Notre mission</h2>
          <p>
            Notre mission est de vous accompagner au quotidien
            en vous offrant des produits fiables, efficaces et accessibles,
            adaptés à vos besoins et à ceux de votre famille.
          </p>
          <p>
            Chez Excellence Healthcare, nous mettons l’accent sur le conseil,
            la qualité des produits et une expérience d’achat simple,
            rapide et sécurisée.
          </p>
        </div>
      </section>

      <section className="about-services" id="services">

        <h2>Nos services</h2>

        <div className="services-grid">
          <div className="service-card">
            <i className="fas fa-pills"></i>
            <h4>Produits parapharmaceutiques</h4>
            <p>
              Soins du visage, cheveux, corps, bébé
              et compléments alimentaires soigneusement sélectionnés.
            </p>
          </div>

          <div className="service-card">
            <i className="fas fa-user"></i>
            <h4>Achat simple et pratique</h4>
            <p>
              Une expérience d’achat fluide pour répondre
              à vos besoins santé et bien-être.
            </p>
          </div>

          <div className="service-card">
            <i className="fas fa-briefcase-medical"></i>
            <h4>Solutions pour professionnels</h4>
            <p>
              Des offres adaptées aux pharmacies, cabinets
              et revendeurs partout au Maroc.
            </p>
          </div>

          <div className="service-card">
            <i className="fas fa-truck"></i>
            <h4>Livraison sécurisée</h4>
            <p>
              Livraison rapide et fiable dans toutes
              les villes du Maroc.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values" id="valeurs">

        <h2>Nos valeurs</h2>

        <div className="values-grid">
          <div className="value-box">
            <i className="fas fa-user-md"></i>
            <h4>Expertise</h4>
            <p>
              Des conseils basés sur une réelle expérience
              en parapharmacie.
            </p>
          </div>

          <div className="value-box">
            <i className="fas fa-eye"></i>
            <h4>Transparence</h4>
            <p>
              Produits authentiques, informations claires
              et prix justes.
            </p>
          </div>

          <div className="value-box">
            <i className="fas fa-handshake"></i>
            <h4>Confiance</h4>
            <p>
              Une relation durable avec nos clients,
              fondée sur le sérieux et l’écoute.
            </p>
          </div>
        </div>
      </section>

      <section className="about-why">
        <div className="why-text">
          <h2>Pourquoi choisir Excellence Healthcare ?</h2>
          <ul>
            <li>Parapharmacie en ligne et magasin physique à Fès</li>
            <li>Produits santé, beauté et bien-être soigneusement sélectionnés</li>
            <li>Conseils fiables et accompagnement client</li>
            <li>Livraison rapide partout au Maroc</li>
          </ul>
        </div>

        <div className="why-image">
          <img src={whyImg} alt="Excellence Healthcare livraison" />
        </div>
      </section>

    </div>
  );
};

export default About;