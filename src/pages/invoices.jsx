import React from "react";
import html2pdf from "html2pdf.js";
import "../styles/Facture.css";
import logo from "../assets/logo.jpg"; // Remplace par le chemin réel de ton logo

export default function Invoice({ invoice }) {
  const data = invoice || {
    company: {
      name: "EXCELLENCE HEALTH CARE",
      address: "Excellence business Center, 76 hay el Qods Bensouda 30030 Fes.",
      ice: "2847685920305060606060606",
      phone: "06 06 06 06 06",
    },
    number: "000001",
    date: "20 Juin 2025",
    client: {
      name: "Studio Shodwe",
      address: "Fes",
      email: "hello@reallygreatsite.com",
    },
    items: [
      { desc: "Produit 1", qty: 1, unit: 45 },
      { desc: "Produit 2", qty: 2, unit: 55 },
      { desc: "Produit 3", qty: 3, unit: 165 },
    ],
    taxPercent: 20,
    paymentMethod: "Cash",
  };

  const subtotal = data.items.reduce((s, it) => s + it.qty * it.unit, 0);
  const tax = (subtotal * data.taxPercent) / 100;
  const total = subtotal + tax;

  const generatePDF = () => {
    const element = document.getElementById("invoice-to-print");

    const options = {
      margin: 0.4,
      filename: `Facture_${data.number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="invoice-container">
      <div className="invoice-box" id="invoice-to-print">
         <header className="invoice-header">
            <div className="invoice-info">
                <h1 className="company-title">{data.company.name}</h1>
                <div className="">
                  <h3> FACTURE</h3>
                </div>
                <div className="">NO{data.number}</div>
                <div className="invoice-date">Date: {data.date}</div>
               
            </div>
            <div className="invoice-logo">
                <img src={logo} alt="Logo" />
            </div>
        </header>


        <section className="invoice-client">
          <div>
            <h3>Client</h3>
            <p>{data.client.name}</p>
            <p>{data.client.address}</p>
            <p>{data.client.email}</p>
          </div>

          <div className="client-pay">
            <h3>Méthode de paiement</h3>
            <p>{data.paymentMethod}</p>
          </div>
        </section>

        <table className="invoice-table">
          <thead  className="thead">
            <tr>
              <th>Désignation</th>
              <th>Quantité</th>
              <th>Prix unitaire DH</th>
              <th>Prix Total DH</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.desc}</td>
                <td>{it.qty}</td>
                <td>{(it.unit || 0).toFixed(2)}</td>
                <td>{((it.qty || 0) * (it.unit || 0)).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td> <b>Total HT</b></td>
              <td><b>{(subtotal || 0).toFixed(2)}</b></td>
              
            </tr>
            <tr>
              <td><b>TVA {data.taxPercent}%</b></td>
              <td><b>{(tax || 0).toFixed(2)}</b></td>
            </tr>
            <tr>
              <td>  <b>Total TTC - DH</b></td>
              <td><b>{(total || 0).toFixed(2)}</b></td>
            </tr>

          </tbody>
        </table>
           <p>Méthode de paiement: {data.paymentMethod}</p>
        {/* <div className="invoice-total-box">
          <div className="line">
            <span>Total HT</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="line">
            <span>TVA {data.taxPercent}%</span>
            <span>{tax.toFixed(2)}</span>
          </div>
          <div className="line total">
            <span>Total TTC - DH</span>
            <span>{total.toFixed(2)}</span>
          </div>
        </div> */}

        <footer className="invoice-footer">
          <div >
               <b>Adresse :</b>  {data.company.address} <br />
              <b>ICE : </b>{data.company.ice}  <br />
              <b>Tél :</b> {data.company.phone}
          </div>
             
        </footer>
      </div>

      {/* Boutons séparés pour impression et PDF */}
      <div className="invoice-actions">
        <button onClick={generatePDF} className="btn-print">
          Télécharger PDF
        </button>
        <button onClick={() => window.print()} className="btn-print">
          Imprimer
        </button>
      </div>
    </div>
  );
}