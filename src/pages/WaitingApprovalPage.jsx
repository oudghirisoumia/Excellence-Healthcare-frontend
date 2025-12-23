"use client"
import React from "react"
import "../styles/WaitingApproval.css"

export default function WaitingApprovalPage() {
    return (
        <div className="waiting-approval">
            <div className="card">
                <h2>Votre compte est en cours de validation</h2>
                <p>
                    <strong><i>Bonne nouvelle ! Vous pouvez déjà explorer nos produits.</i></strong>
                    <br />
                    L’accès à votre espace professionnel sera activé dès la validation de votre compte.
                </p>
            </div>
        </div>
    );
}