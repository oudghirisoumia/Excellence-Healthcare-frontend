export default function DashboardB2B() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard B2B</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">Professionnels actifs</div>
        <div className="card">Commandes B2B</div>
        <div className="card">CA B2B</div>
        <div className="card">Factures générées</div>
      </div>
    </div>
  );
}
