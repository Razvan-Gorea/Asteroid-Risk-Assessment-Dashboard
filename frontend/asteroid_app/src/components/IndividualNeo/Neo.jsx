import { useState, useEffect } from "react";
import { neoService } from "../../api/client";

const DataCard = ({ label, value, sub }) => (
  <div className="stat-card bracket" style={{ textAlign: "center" }}>
    <div className="section-label" style={{ marginBottom: "0.4rem" }}>{label}</div>
    <div className="font-mono-data" style={{ fontSize: "1rem", color: "#00d4ff" }}>{value}</div>
    {sub && <div style={{ fontSize: "0.75rem", color: "#6a8aaa", marginTop: "0.2rem", fontFamily: "'Barlow', sans-serif" }}>{sub}</div>}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="neo-card">
    <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #1a3050" }}>
      <div className="font-display" style={{ fontSize: "0.82rem", color: "#6a8aaa", letterSpacing: "0.1em" }}>{title}</div>
    </div>
    <div style={{ padding: "1rem 1.25rem" }}>{children}</div>
  </div>
);

const EXAMPLE_IDS = ["2000433", "3542519", "2001620", "2162038"];

const Neo = () => {
  const [neoId, setNeoId] = useState("");
  const [selectedNeoId, setSelectedNeoId] = useState(null);
  const [neoData, setNeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (neoId.trim()) setSelectedNeoId(neoId.trim());
  };

  const handleClose = () => {
    setSelectedNeoId(null);
    setNeoData(null);
    setError(null);
    setNeoId("");
  };

  useEffect(() => {
    if (selectedNeoId) fetchNeoDetails();
  }, [selectedNeoId]);

  const fetchNeoDetails = async () => {
    if (!selectedNeoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await neoService.getNeoById(selectedNeoId);
      setNeoData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch NEO details");
      console.error("NEO fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (distance) => parseFloat(distance).toLocaleString();
  const formatDiameter = (diameterObj) => {
    if (!diameterObj?.kilometers) return "Unknown";
    const min = parseFloat(diameterObj.kilometers.estimated_diameter_min || 0).toFixed(2);
    const max = parseFloat(diameterObj.kilometers.estimated_diameter_max || 0).toFixed(2);
    return `${min} – ${max} km`;
  };
  const formatVelocity = (velocity) => parseFloat(velocity).toFixed(2);

  // Search form
  if (!selectedNeoId) {
    return (
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0.5rem" }}>
        <div className="neo-card glow-cyan">
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1a3050" }}>
            <div className="section-label" style={{ marginBottom: "0.25rem" }}>Object Lookup</div>
            <h2 className="font-display" style={{ fontSize: "1.2rem", color: "#e0f0ff", margin: 0, fontWeight: 700 }}>
              NEO Details Viewer
            </h2>
            <p style={{ color: "#4a6280", fontSize: "0.8rem", margin: "0.3rem 0 0 0", fontFamily: "'Barlow', sans-serif" }}>
              Enter a Near Earth Object ID to retrieve detailed telemetry
            </p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <div className="section-label" style={{ marginBottom: "0.5rem" }}>NEO Reference ID</div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  id="neoId"
                  type="text"
                  value={neoId}
                  onChange={(e) => setNeoId(e.target.value)}
                  placeholder="e.g. 2000433"
                  className="neo-input"
                  style={{ flex: 1, fontSize: "0.9rem", padding: "0.6rem 0.9rem" }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!neoId.trim()}
                  className="btn-primary"
                  style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem", opacity: neoId.trim() ? 1 : 0.4, cursor: neoId.trim() ? "pointer" : "not-allowed" }}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="neo-card" style={{ padding: "0.9rem 1rem" }}>
              <div className="section-label" style={{ marginBottom: "0.5rem" }}>Example IDs</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {EXAMPLE_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => { setNeoId(id); setSelectedNeoId(id); }}
                    className="font-mono-data"
                    style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", padding: "0.3rem 0.75rem", fontSize: "0.8rem", borderRadius: "1px", cursor: "pointer", transition: "all 0.2s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.06)"; }}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0.5rem" }}>
        <div className="neo-card" style={{ padding: "2rem" }}>
          <div style={{ height: "2px", background: "linear-gradient(90deg, #00d4ff, transparent)", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div className="scanner-line" style={{ position: "absolute", inset: 0, background: "rgba(0,212,255,0.6)", height: "100%" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[280, 220, 180].map((w, i) => (
              <div key={i} style={{ height: "14px", width: `${w}px`, background: "rgba(0,212,255,0.06)", borderRadius: "1px" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginTop: "2rem" }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: "80px", background: "rgba(0,212,255,0.04)", borderRadius: "1px" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0.5rem" }}>
        <div className="neo-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <div style={{ color: "#ff4565", fontSize: "1.2rem" }}>⚠</div>
            <div>
              <div className="font-display" style={{ color: "#ff4565", fontSize: "0.8rem", marginBottom: "0.3rem" }}>Object Not Found</div>
              <div style={{ color: "#7090b0", fontSize: "0.8rem", fontFamily: "'Share Tech Mono', monospace", marginBottom: "0.75rem" }}>{error}</div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn-primary" onClick={fetchNeoDetails}>Retry</button>
                <button className="btn-ghost" onClick={handleClose}>Back to Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!neoData) return null;

  const neo = neoData;
  const now = new Date();
  const futureApproaches = neo.close_approach_data?.filter((a) => new Date(a.close_approach_date) > now) || [];
  const closeApproach = futureApproaches.length > 0 ? futureApproaches[0] : neo.close_approach_data?.[0];
  const isHazardous = neo.is_potentially_hazardous_asteroid;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0.5rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* Header card */}
        <div className="neo-card glow-cyan">
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1a3050", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
            <div>
              <div className="section-label" style={{ marginBottom: "0.25rem" }}>Object Profile · <span className="font-mono-data" style={{ fontSize: "0.65rem" }}>{neo.id}</span></div>
              <h2 className="font-display" style={{ fontSize: "1.3rem", color: "#e0f0ff", margin: 0, fontWeight: 700 }}>{neo.name}</h2>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              {isHazardous && (
                <div
                  className="pulse-threat font-display"
                  style={{ padding: "0.3rem 0.85rem", fontSize: "0.75rem", letterSpacing: "0.1em", borderRadius: "1px", background: "rgba(255,23,68,0.12)", border: "1px solid rgba(255,23,68,0.4)", color: "#ff4565" }}
                >
                  ▲ Potentially Hazardous
                </div>
              )}
              <button className="btn-ghost" onClick={handleClose}>Back to Search</button>
            </div>
          </div>
          <div style={{ padding: "1rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
            <DataCard
              label="Hazard Status"
              value={isHazardous ? "Hazardous" : "Safe"}
              sub={isHazardous ? "NASA Classified PHA" : "No significant risk"}
            />
            <DataCard
              label="Size Range"
              value={formatDiameter(neo.estimated_diameter)}
              sub="Estimated diameter"
            />
            <DataCard
              label="Orbital Period"
              value={neo.orbital_data?.orbital_period ? `${parseFloat(neo.orbital_data.orbital_period).toFixed(1)} days` : "Unknown"}
              sub="One complete orbit"
            />
          </div>
        </div>

        {/* Close Approach */}
        {closeApproach && (
          <SectionCard title={futureApproaches.length > 0 ? "Next Close Approach" : "Most Recent Close Approach"}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
              <DataCard label="Approach Date" value={closeApproach.close_approach_date_full || closeApproach.close_approach_date} sub={futureApproaches.length > 0 ? "Future approach" : "Past approach"} />
              <DataCard label="Miss Distance" value={`${formatDistance(closeApproach.miss_distance?.kilometers)} km`} sub={`${parseFloat(closeApproach.miss_distance?.lunar).toFixed(2)} lunar dist.`} />
              <DataCard label="Approach Speed" value={`${formatVelocity(closeApproach.relative_velocity?.kilometers_per_hour)} km/h`} sub={`Relative to ${closeApproach.orbiting_body}`} />
              <DataCard label="Approaching" value={closeApproach.orbiting_body} sub="Planet being approached" />
            </div>
          </SectionCard>
        )}

        {/* Physical + Classification */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          <SectionCard title="Physical Properties">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <DataCard label="Absolute Magnitude" value={neo.absolute_magnitude_h} />
              <DataCard label="Diameter (km)" value={formatDiameter(neo.estimated_diameter)} />
              {neo.estimated_diameter?.meters && (
                <DataCard label="Diameter (m)" value={`${parseFloat(neo.estimated_diameter.meters.estimated_diameter_min).toFixed(0)} – ${parseFloat(neo.estimated_diameter.meters.estimated_diameter_max).toFixed(0)} m`} />
              )}
            </div>
          </SectionCard>
          <SectionCard title="Classification">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <DataCard label="NEO Reference ID" value={neo.neo_reference_id} />
              <div className="stat-card bracket">
                <div className="section-label" style={{ marginBottom: "0.35rem" }}>NASA JPL</div>
                <a
                  href={neo.nasa_jpl_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-data"
                  style={{ fontSize: "0.8rem", color: "#00d4ff", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  View on NASA JPL →
                </a>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Orbital Data */}
        {neo.orbital_data && (
          <SectionCard title="Orbital Characteristics">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.6rem" }}>
              {[
                neo.orbital_data.orbital_period && { l: "Orbital Period", v: `${parseFloat(neo.orbital_data.orbital_period).toFixed(1)} days` },
                neo.orbital_data.minimum_orbit_intersection && { l: "Min Orbit Intersection", v: `${parseFloat(neo.orbital_data.minimum_orbit_intersection).toFixed(6)} AU` },
                neo.orbital_data.eccentricity && { l: "Eccentricity", v: parseFloat(neo.orbital_data.eccentricity).toFixed(6) },
                neo.orbital_data.semi_major_axis && { l: "Semi-major Axis", v: `${parseFloat(neo.orbital_data.semi_major_axis).toFixed(6)} AU` },
                neo.orbital_data.inclination && { l: "Inclination", v: `${parseFloat(neo.orbital_data.inclination).toFixed(2)}°` },
                neo.orbital_data.ascending_node_longitude && { l: "Ascending Node", v: `${parseFloat(neo.orbital_data.ascending_node_longitude).toFixed(2)}°` },
              ].filter(Boolean).map(({ l, v }) => (
                <DataCard key={l} label={l} value={v} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* All Close Approaches Table */}
        {neo.close_approach_data?.length > 1 && (
          <SectionCard title="All Recorded Close Approaches">
            <p style={{ color: "#4a6280", fontSize: "0.75rem", margin: "0 0 0.75rem 0", fontFamily: "'Barlow', sans-serif" }}>
              Historical and predicted close encounters as this asteroid orbits the Sun
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Approach Date</th>
                    <th>Miss Distance (km)</th>
                    <th>Speed (km/h)</th>
                    <th>Planet</th>
                  </tr>
                </thead>
                <tbody>
                  {neo.close_approach_data.map((approach, index) => (
                    <tr key={index}>
                      <td>{approach.close_approach_date}</td>
                      <td>{formatDistance(approach.miss_distance?.kilometers)}</td>
                      <td>{formatVelocity(approach.relative_velocity?.kilometers_per_hour)}</td>
                      <td>{approach.orbiting_body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {/* Footer actions */}
        <div style={{ display: "flex", gap: "0.5rem", paddingBottom: "0.5rem" }}>
          <button className="btn-primary" onClick={fetchNeoDetails}>Refresh Data</button>
          <button className="btn-ghost" onClick={handleClose}>Back to Search</button>
        </div>
      </div>
    </div>
  );
};

export default Neo;
