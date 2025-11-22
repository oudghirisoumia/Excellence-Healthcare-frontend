
import React from 'react';
import { Link } from 'react-router-dom';
export default function Hero(){
  return (
    <section className="hero">
      <div className="container">
        <h1>Excellence Parapharmacie - Votre partenaire santé</h1>
        <p>Des milliers de produits de santé, beauté et bien-être livrés rapidement à votre domicile. Conseils d'experts et livraison gratuite dès 49€.</p>
        <div style={{display:'flex',gap:16,justifyContent:'center',marginTop:20}}>
          <Link to="/products" className="btn">Découvrir nos produits →</Link>
          <button className="btn-outline">Nos conseils santé</button>
        </div>
      </div>
    </section>
  );
}
