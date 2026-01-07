import "../styles/CheckoutPage.css"

export default function CheckoutSummary({ cart, preview }) {
  if (!preview) {
    return (
      <div className="checkout-summary">
        <p className="summary-placeholder">
          Choisissez un mode de livraison pour voir le récapitulatif.
        </p>

      </div>
    )
  }

  return (
    <div className="checkout-summary">
      <h3 className="summary-title">Récapitulatif</h3>

      <div className="summary-items">
        {cart.map((item, i) => (
          <div key={i} className="summary-item">
            <span>{item.product?.name} × {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="summary-line">
        <span>Sous-total (HT)</span>
        <span>{preview.subtotal_ht.toFixed(2)} DH</span>
      </div>

      <div className="summary-line">
        <span>TVA (20%)</span>
        <span>{preview.tva.toFixed(2)} DH</span>
      </div>

      <div className="summary-line">
        <span>Livraison</span>
        <div className="summary-line">
          <span>Livraison</span>
          <span>
            {preview.shipping_fee === 0
              ? "Gratuit"
              : `${preview.shipping_fee.toFixed(2)} DH`}
          </span>
        </div>

      </div>

      <div className="summary-total">
        <span>Total TTC</span>
        <span>{preview.total_ttc.toFixed(2)} DH</span>
      </div>
    </div>
  )
}
