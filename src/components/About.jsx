import React from "react";
import "../styles/About.css";

import heroImg from "../assets/delivery.jpg";
import missionImg from "../assets/mission.jpg";
import deliveryImg from "../assets/team.jpg";

const About = () => {
  return (
    <div className="about-page">

      {/* HERO / À PROPOS */}

      <section className="about-hero">
        <div className="about-hero-text">
          <h1>À propos de Excellence Healthcare</h1>
          <p>
            Excellence Healthcare est une plateforme e-commerce spécialisée
            dans la vente de produits de parapharmacie, santé et bien-être,
            destinée aux particuliers (B2C) et aux professionnels (B2B).
          </p>
        </div>

        <div className="about-hero-image">
          <img src={heroImg} alt="Excellence Healthcare" />
        </div>
      </section>

      {/* MISSION */}
      <section className="about-mission">
        <div className="mission-image">
          <img src={missionImg} alt="Notre mission" />
        </div>

        <div className="mission-text">
          <h2>Notre mission</h2>
          <p>
            Simplifier l’accès aux produits de santé et de bien-être
            grâce à une plateforme digitale fiable, sécurisée et performante.
          </p>
          <p>
            Nous accompagnons aussi bien les clients particuliers que les
            professionnels de santé avec des services adaptés, une logistique
            maîtrisée et une facturation conforme.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="about-services">
        <h2>Nos services</h2>

        <div className="services-grid">
          <div className="service-card">
            <i className="fas fa-pills"></i>
            <h4>Produits parapharmaceutiques</h4>
            <p>Large catalogue de produits certifiés et contrôlés.</p>
          </div>

          <div className="service-card">
            <i className="fas fa-user"></i>
            <h4>Vente B2C</h4>
            <p>Achat simple et rapide pour les particuliers.</p>
          </div>

          <div className="service-card">
            <i className="fas fa-briefcase-medical"></i>
            <h4>Vente B2B</h4>
            <p>Tarifs professionnels et facturation adaptée.</p>
          </div>

          <div className="service-card">
            <i className="fas fa-truck"></i>
            <h4>Livraison sécurisée</h4>
            <p>Livraison rapide avec suivi de commande.</p>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="about-values">
        <h2>Nos valeurs</h2>

        <div className="values-grid">
          <div className="value-box">
            <i className="fas fa-shield-alt"></i>
            <h4>Sécurité</h4>
            <p>Données et paiements protégés.</p>
          </div>

          <div className="value-box">
            <i className="fas fa-check-circle"></i>
            <h4>Qualité</h4>
            <p>Produits répondant aux normes de santé.</p>
          </div>

          <div className="value-box">
            <i className="fas fa-bolt"></i>
            <h4>Rapidité</h4>
            <p>Commande et livraison optimisées.</p>
          </div>

          <div className="value-box">
            <i className="fas fa-eye"></i>
            <h4>Transparence</h4>
            <p>Prix clairs et facturation électronique.</p>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="about-why">
        <div className="why-text">
          <h2>Pourquoi choisir Excellence Healthcare ?</h2>
          <ul>
            <li>Plateforme e-commerce spécialisée santé & bien-être</li>
            <li>Solution adaptée aux particuliers et professionnels</li>
            <li>Paiement sécurisé et e-facturation</li>
            <li>Gestion de stock et livraison fiable</li>
          </ul>
        </div>

        <div className="why-image">
          <img src={deliveryImg} alt="Livraison Excellence Healthcare" />
        </div>
      </section>

    </div>
  );
};

export default About;
