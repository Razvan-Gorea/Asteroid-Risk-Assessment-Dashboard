import { useState, useEffect } from "react";
import { neoRiskService } from "../../api/client";

const RISK_COLORS = {
  CRITICAL: { bg: "rgba(255,23,68,0.12)", border: "rgba(255,23,68,0.4)", text: "#ff4565", badge: "badge-critical" },
  HIGH:     { bg: "rgba(255,109,0,0.1)",  border: "rgba(255,109,0,0.35)", text: "#ff8c3a", badge: "badge-high" },
  MODERATE: { bg: "rgba(255,214,0,0.08)", border: "rgba(255,214,0,0.3)",  text: "#ffd600", badge: "badge-moderate" },
  LOW:      { bg: "rgba(0,176,255,0.08)", border: "rgba(0,176,255,0.3)",  text: "#00b0ff", badge: "badge-low" },
  MINIMAL:  { bg: "rgba(0,230,118,0.08)", border: "rgba(0,230,118,0.3)", text: "#00e676", badge: "badge-minimal" },
};

const getRisk = (level) =>
  RISK_COLORS[level] || { bg: "rgba(70,90,120,0.1)", border: "#1a3050", text: "#7090b0", badge: "" };

const StatCard = ({ label, value, accent }) => (
  <div className="stat-card bracket" style={{ borderColor: accent ? `rgba(0,212,255,0.2)` : "#1a3050" }}>
    <div className="section-label" style={{ marginBottom: "0.35rem" }}>{label}</div>
    <div className="font-mono-data" style={{ fontSize: "1.6rem", fontWeight: 400, color: accent || "#e0f0ff", lineHeight: 1 }}>
      {value}
    </div>
  </div>
);

const MetricCard = ({ label, value, sub }) => (
  <div className="stat-card bracket">
    <div className="section-label" style={{ marginBottom: "0.35rem" }}>{label}</div>
    <div className="font-mono-data" style={{ fontSize: "1.05rem", color: "#00d4ff" }}>{value}</div>
    {sub && <div style={{ fontSize: "0.75rem", color: "#6a8aaa", marginTop: "0.2rem", fontFamily: "'Barlow', sans-serif" }}>{sub}</div>}
  </div>
);

const RiskAssessment = ({ selectedDate = null }) => {
  const today = new Date().toISOString().split("T")[0];

  const [currentDate, setCurrentDate] = useState(() => selectedDate || today);
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRiskAssessment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data =
        currentDate === today
          ? await neoRiskService.getRiskAssessment()
          : await neoRiskService.getRiskAssessmentByDate(currentDate);
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
    if (currentDate) fetchRiskAssessment();
  }, [currentDate]);

  if (isLoading) {
    return (
      <div className="w-full p-2">
        <div className="neo-card" style={{ padding: "1.5rem" }}>
          <div style={{ height: "2px", background: "linear-gradient(90deg, #00d4ff, transparent)", marginBottom: "1.5rem", borderRadius: "1px", position: "relative", overflow: "hidden" }}>
            <div className="scanner-line" style={{ position: "absolute", inset: 0, background: "rgba(0,212,255,0.6)", height: "100%" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[200, 160, 120].map((w, i) => (
              <div key={i} style={{ height: "12px", width: `${w}px`, background: "rgba(0,212,255,0.06)", borderRadius: "1px" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem", marginTop: "1.5rem" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ height: "64px", background: "rgba(0,212,255,0.04)", borderRadius: "1px" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-2">
        <div className="neo-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ color: "#ff4565", fontSize: "1.2rem", lineHeight: 1, marginTop: "2px" }}>⚠</div>
            <div>
              <div className="font-display" style={{ color: "#ff4565", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                Data Acquisition Failed
              </div>
              <div style={{ color: "#7090b0", fontSize: "0.8rem", fontFamily: "'Share Tech Mono', monospace", marginBottom: "0.75rem" }}>
                {error}
              </div>
              <button className="btn-primary" onClick={fetchRiskAssessment}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!riskData?.risk_assessments?.length) {
    return (
      <div className="w-full p-2">
        <div className="neo-card" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="section-label" style={{ marginBottom: "0.5rem" }}>No data for {currentDate}</div>
          <button className="btn-primary" onClick={fetchRiskAssessment}>Retry</button>
        </div>
      </div>
    );
  }

  const { risk_summary, risk_assessments, date } = riskData;
  const highestRiskNEO = risk_assessments[0];
  const riskStyle = getRisk(highestRiskNEO?.risk_level);
  const isCritical = highestRiskNEO?.risk_level === "CRITICAL";
  const isHigh = highestRiskNEO?.risk_level === "HIGH";

  return (
    <div className="w-full p-2">
      <div className="neo-card glow-cyan">
        {/* Header */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a3050", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <div>
            <div className="section-label" style={{ marginBottom: "0.2rem" }}>Daily Report</div>
            <h2 className="font-display" style={{ fontSize: "1.1rem", color: "#e0f0ff", margin: 0, fontWeight: 700 }}>
              Risk Assessment
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="font-mono-data" style={{ fontSize: "0.7rem", color: "#4a6280" }}>
              {new Date(date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
            </span>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="neo-input"
              style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem" }}
            />
            <button className="btn-ghost" onClick={() => setCurrentDate(today)} style={{ padding: "0.3rem 0.75rem" }}>
              Today
            </button>
          </div>
        </div>

        {/* Risk Summary Stats */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a3050" }}>
          <div className="section-label" style={{ marginBottom: "0.75rem" }}>Threat Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "0.6rem" }}>
            <StatCard label="Total NEOs" value={risk_summary.total_objects} accent="#00d4ff" />
            <StatCard label="Critical" value={risk_summary.critical_risk} accent={risk_summary.critical_risk > 0 ? "#ff4565" : undefined} />
            <StatCard label="High" value={risk_summary.high_risk} accent={risk_summary.high_risk > 0 ? "#ff8c3a" : undefined} />
            <StatCard label="Moderate" value={risk_summary.moderate_risk} accent={risk_summary.moderate_risk > 0 ? "#ffd600" : undefined} />
            <StatCard label="Low / Minimal" value={risk_summary.low_risk + risk_summary.minimal_risk} accent="#00e676" />
          </div>
        </div>

        {/* Highest Risk NEO */}
        {highestRiskNEO && (
          <div style={{ padding: "1rem 1.25rem" }}>
            <div className="section-label" style={{ marginBottom: "0.75rem" }}>Primary Threat Object</div>
            <div
              className={isCritical ? "glow-critical" : isHigh ? "glow-amber" : ""}
              style={{ background: riskStyle.bg, border: `1px solid ${riskStyle.border}`, borderRadius: "1px", padding: "1rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div>
                  <h3 className="font-display" style={{ fontSize: "1rem", color: "#e0f0ff", margin: 0, letterSpacing: "0.08em" }}>
                    {highestRiskNEO.name}
                  </h3>
                  <p style={{ color: "#7090b0", fontSize: "0.75rem", margin: "0.2rem 0 0 0", fontFamily: "'Barlow', sans-serif" }}>
                    {highestRiskNEO.risk_description}
                  </p>
                </div>
                <div
                  className={`${riskStyle.badge} ${isCritical ? "pulse-threat" : ""} font-display`}
                  style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem", letterSpacing: "0.15em", borderRadius: "1px", whiteSpace: "nowrap" }}
                >
                  {highestRiskNEO.risk_level}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.5rem" }}>
                <MetricCard label="Risk Score" value={`${highestRiskNEO.risk_score}/100`} />
                <MetricCard label="Diameter" value={`${highestRiskNEO.size_km.toFixed(3)} km`} />
                <MetricCard label="Miss Distance" value={`${highestRiskNEO.miss_distance_lunar} LD`} sub="Lunar distances" />
                <MetricCard label="Velocity" value={`${(highestRiskNEO.velocity_kmh / 1000).toFixed(0)}k km/h`} />
              </div>

              {highestRiskNEO.is_nasa_hazardous && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "rgba(255,23,68,0.08)", border: "1px solid rgba(255,23,68,0.25)", borderRadius: "1px" }}>
                  <span style={{ color: "#ff4565", fontSize: "0.9rem" }}>▲</span>
                  <span className="font-display" style={{ fontSize: "0.78rem", color: "#ff4565", letterSpacing: "0.08em" }}>
                    NASA Classified: Potentially Hazardous Asteroid
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid #1a3050" }}>
          <button className="btn-primary" onClick={fetchRiskAssessment}>Refresh Data</button>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
