export default function ProValidation() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Validation des comptes professionnels
      </h2>

      <table className="table">
        <thead>
          <tr>
            <th>Société</th>
            <th>IF</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Pharma Pro</td>
            <td>123456</td>
            <td>En attente</td>
            <td>
              <button className="btn-success">Valider</button>
              <button className="btn-danger ml-2">Refuser</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
