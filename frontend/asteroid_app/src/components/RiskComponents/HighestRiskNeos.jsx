import { useState, useEffect } from "react";
import { neoRiskService } from "../../api/client";

const RISK_STYLES = {
  CRITICAL: { bg: "rgba(255,23,68,0.1)",  border: "rgba(255,23,68,0.3)",  badge: "badge-critical" },
  HIGH:     { bg: "rgba(255,109,0,0.08)", border: "rgba(255,109,0,0.3)",  badge: "badge-high" },
  MODERATE: { bg: "rgba(255,214,0,0.06)", border: "rgba(255,214,0,0.25)", badge: "badge-moderate" },
  LOW:      { bg: "rgba(0,176,255,0.06)", border: "rgba(0,176,255,0.25)", badge: "badge-low" },
  MINIMAL:  { bg: "rgba(0,230,118,0.06)", border: "rgba(0,230,118,0.2)", badge: "badge-minimal" },
};

const getRisk = (level) =>
  RISK_STYLES[level] || { bg: "rgba(70,90,120,0.08)", border: "#1a3050", badge: "" };

const HighestRiskNeos = ({ selectedDate = null, limit = 10 }) => {
  const today = new Date().toISOString().split("T")[0];

  const [currentDate, setCurrentDate] = useState(() => selectedDate || today);
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchHighestRiskNeos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await neoRiskService.getHighestRiskNeos(currentDate, currentDate, limit);
      setRiskData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) setCurrentDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (currentDate) fetchHighestRiskNeos();
  }, [currentDate, limit]);

  useEffect(() => {
    setShowAll(false);
  }, [currentDate]);

  if (isLoading) {
    return (
      <div className="w-full p-2">
        <div className="neo-card" style={{ padding: "1.25rem" }}>
          <div style={{ height: "2px", background: "linear-gradient(90deg, #00d4ff, transparent)", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
            <div className="scanner-line" style={{ position: "absolute", inset: 0, background: "rgba(0,212,255,0.6)", height: "100%" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ height: "72px", background: "rgba(0,212,255,0.04)", borderRadius: "1px" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-2">
        <div className="neo-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ color: "#ff4565", fontSize: "1.2rem" }}>⚠</div>
            <div>
              <div className="font-display" style={{ color: "#ff4565", fontSize: "0.8rem", marginBottom: "0.3rem" }}>Data Acquisition Failed</div>
              <div style={{ color: "#7090b0", fontSize: "0.75rem", fontFamily: "'Share Tech Mono', monospace", marginBottom: "0.75rem" }}>{error}</div>
              <button className="btn-primary" onClick={fetchHighestRiskNeos}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!riskData?.highest_risk_neos?.length) {
    return (
      <div className="w-full p-2">
        <div className="neo-card" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="section-label" style={{ marginBottom: "0.5rem" }}>No threat data for {currentDate}</div>
          <button className="btn-primary" onClick={fetchHighestRiskNeos}>Retry</button>
        </div>
      </div>
    );
  }

  const { highest_risk_neos } = riskData;
  const hasMore = highest_risk_neos.length > 5;
  const displayNeos = showAll ? highest_risk_neos : highest_risk_neos.slice(0, 5);

  return (
    <div className="w-full p-2">
      <div className="neo-card glow-cyan" style={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a3050", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <div>
            <div className="section-label" style={{ marginBottom: "0.2rem" }}>Ranked Objects</div>
            <h2 className="font-display" style={{ fontSize: "1.1rem", color: "#e0f0ff", margin: 0, fontWeight: 700 }}>
              Highest Risk NEOs
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="font-mono-data" style={{ fontSize: "0.7rem", color: "#4a6280" }}>
              {new Date(currentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="neo-input"
              style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
            />
            <button className="btn-ghost" onClick={() => setCurrentDate(today)} style={{ padding: "0.3rem 0.75rem" }}>Today</button>
          </div>
        </div>

        {/* Count bar */}
        <div style={{ padding: "0.4rem 1.25rem", borderBottom: "1px solid #1a3050", background: "#050d1a" }}>
          <span className="section-label">
            Showing {displayNeos.length} of {highest_risk_neos.length} tracked asteroids
          </span>
        </div>

        {/* NEO List */}
        <div style={{ padding: "0.75rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          {displayNeos.map((neo, index) => {
            const rs = getRisk(neo.risk_level);
            const isCritical = neo.risk_level === "CRITICAL";
            return (
              <div
                key={neo.id}
                style={{ background: rs.bg, border: `1px solid ${rs.border}`, borderRadius: "1px", padding: "0.65rem 0.85rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <span className="font-mono-data" style={{ fontSize: "0.78rem", color: "#6a8aaa", flexShrink: 0 }}>
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: "0.92rem", color: "#e0f0ff", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.04em" }}
                  >
                    {neo.name}
                  </span>
                  <span
                    className={`${rs.badge} ${isCritical ? "pulse-threat" : ""} font-display`}
                    style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem", letterSpacing: "0.08em", borderRadius: "1px", whiteSpace: "nowrap" }}
                  >
                    {neo.risk_level}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.35rem" }}>
                  {[
                    { l: "Score",    v: `${neo.risk_score}/100` },
                    { l: "Size",     v: `${neo.size_km.toFixed(2)} km` },
                    { l: "Distance", v: `${neo.miss_distance_lunar} LD` },
                    { l: "Velocity", v: `${(neo.velocity_kmh / 1000).toFixed(0)}k km/h` },
                  ].map(({ l, v }) => (
                    <div key={l} style={{ background: "rgba(3,8,16,0.5)", border: "1px solid rgba(26,48,80,0.5)", padding: "0.4rem 0.5rem", borderRadius: "1px" }}>
                      <div className="section-label" style={{ marginBottom: "0.15rem" }}>{l}</div>
                      <div className="font-mono-data" style={{ fontSize: "0.85rem", color: "#00d4ff" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {neo.is_nasa_hazardous && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.4rem" }}>
                    <span style={{ color: "#ff4565", fontSize: "0.85rem" }}>▲</span>
                    <span className="font-display" style={{ fontSize: "0.75rem", color: "#ff4565", letterSpacing: "0.08em" }}>NASA Hazardous</span>
                  </div>
                )}
              </div>
            );
          })}

          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-ghost"
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            >
              {showAll ? "Show Less" : `Show ${highest_risk_neos.length - 5} More`}
            </button>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #1a3050" }}>
          <button className="btn-primary" onClick={fetchHighestRiskNeos} style={{ width: "100%" }}>Refresh</button>
        </div>
      </div>
    </div>
  );
};

export default HighestRiskNeos;
