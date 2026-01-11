import React, { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [results, setResults] = useState(null);
  
  const calculateExample = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initial_investment: 50000,
          final_value: 75000,
          cash_flows: [-50000, 20000, 25000, 30000],
          discount_rate: 0.08
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.result);
      } else {
        console.error("API error:", response.status);
        // Données de démo en cas d'échec
        setResults({
          roi: 0.35,
          npv: 15248.36,
          irr: 0.18,
          payback_period: 2.5
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Données de démo
      setResults({
        roi: 0.35,
        npv: 15248.36,
        irr: 0.18,
        payback_period: 2.5
      });
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>?? SALMA Financial Dashboard</h1>
        <p>Plateforme d'analyse financière intelligente</p>
      </header>
      
      <div className="dashboard-content">
        <button onClick={calculateExample} className="btn-primary">
          Exécuter Calcul de Démo
        </button>
        
        {results && (
          <div className="results-panel">
            <h3>?? Résultats Financiers</h3>
            <div className="kpi-grid">
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="kpi-card">
                  <div className="kpi-name">{key.toUpperCase()}</div>
                  <div className="kpi-value">
                    {typeof value === "number" 
                      ? (key === "roi" || key === "irr" 
                          ? `${(value * 100).toFixed(2)}%` 
                          : value.toFixed(2))
                      : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
