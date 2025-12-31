import { useEffect, useState } from "react"
import { Cpu, Database, Activity, FileText, Shield } from "lucide-react"
import api from "../api"
import "../styles/Monitoring.css"

export default function Monitoring() {
  const [metrics, setMetrics] = useState(null)
  const [logs, setLogs] = useState([])
  const [security, setSecurity] = useState([])

  useEffect(() => {
    loadMonitoring()
  }, [])

  const loadMonitoring = async () => {
    try {
      const metricsRes = await api.get("/metrics")
      setMetrics(metricsRes.data)

      const logsRes = await api.get("/logs")
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : [])

      const secRes = await api.get("/security")
      setSecurity(Array.isArray(secRes.data) ? secRes.data : [])
    } catch (err) {
      console.error("Erreur de monitoring :", err)
    }
  }

  return (
    <div className="monitoring-container">
      <h2>Page de monitoring</h2>

      <section className="info-box">
        <h3><Cpu size={20}/> Métriques</h3>
        <p className="info-desc">
          Indicateurs de performance du système mis à jour en temps réel.
        </p>

        {metrics ? (
          <div className="metrics-layout">
            <div className="metric-tile">
              <Cpu size={24} />
              <span>CPU</span>
              <div>{metrics.cpu}%</div>
            </div>

            <div className="metric-tile">
              <Database size={24} />
              <span>Mémoire</span>
              <div>{metrics.memory.toFixed(2)} MB</div>
            </div>

            <div className="metric-tile">
              <Activity size={24} />
              <span>Requêtes</span>
              <div>{metrics.requests}</div>
            </div>
          </div>
        ) : (
          <p className="loading">Chargement des métriques...</p>
        )}
      </section>

      <section className="info-box">
        <h3><FileText size={20}/> Logs récents</h3>
        <p className="info-desc">
          Derniers événements et avertissements de l’application.
        </p>

        <ul>
          {logs.length > 0 ? (
            logs.map((log, i) => <li key={i}>{log}</li>)
          ) : (
            <p className="loading">Aucun log disponible</p>
          )}
        </ul>
      </section>

      <section className="info-box">
        <h3><Shield size={20}/> Sécurité</h3>
        <p className="info-desc">
          Dernières tentatives de connexion échouées afin de détecter toute activité suspecte.
        </p>

        <ul>
          {security.length > 0 ? (
            security.map(event => (
              <li key={event.id}>
                {event.email} — {new Date(event.created_at).toLocaleString()}
              </li>
            ))
          ) : (
            <p className="loading">Aucune tentative échouée</p>
          )}
        </ul>
      </section>
    </div>
  )
}
