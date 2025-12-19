export default function InvoicesB2B() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Factures B2B</h2>

      <table className="table">
        <thead>
          <tr>
            <th>N° Facture</th>
            <th>Société</th>
            <th>Montant</th>
            <th>Format</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>FAC-2025-001</td>
            <td>Pharma Pro</td>
            <td>12 000 MAD</td>
            <td>
              <button className="btn-primary">PDF / UBL</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
