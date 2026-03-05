import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Risk Assessment" },
    { path: "/visualizations", label: "Visualizations" },
    { path: "/individual-neo", label: "Individual NEO" },
  ];

  return (
    <nav className="mb-6">
      <div
        style={{
          background: "linear-gradient(135deg, #080e1a 0%, #0d1e38 100%)",
          border: "1px solid #1a3050",
          borderRadius: "2px",
          boxShadow: "0 0 40px rgba(0, 212, 255, 0.06), inset 0 1px 0 rgba(0, 212, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, #00d4ff 30%, rgba(0, 212, 255, 0.4) 70%, transparent 100%)",
          }}
        />

        <div className="flex flex-wrap items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                background: "rgba(0, 212, 255, 0.08)",
                border: "1px solid rgba(0, 212, 255, 0.25)",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 14px rgba(0, 212, 255, 0.15)",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M21 3l-5 9h5l-6.891 7.086a6.5 6.5 0 1 1 -8.855 -9.506l7.746 -6.58l-1 5l9 -5z" />
                <path d="M9.5 14.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" fill="#00d4ff" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#00d4ff",
                  lineHeight: 1.1,
                }}
              >
                Asteroid Risk
              </div>
              <div
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#4a6280",
                  lineHeight: 1.2,
                }}
              >
                Assessment Dashboard
              </div>
            </div>
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            style={{
              background: "transparent",
              border: "1px solid #1a3050",
              borderRadius: "2px",
              padding: "6px 8px",
              color: "#7090b0",
              cursor: "pointer",
            }}
            aria-controls="navbar-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="w-5 h-5"
              style={{
                transition: "transform 0.3s ease",
                transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          {/* Nav links */}
          <div
            id="navbar-menu"
            className={`${isMenuOpen ? "block" : "hidden"} md:block w-full md:w-auto mt-4 md:mt-0`}
          >
            <ul
              className="flex flex-col md:flex-row"
              style={{ gap: 0, margin: 0, padding: 0, listStyle: "none" }}
            >
              {navLinks.map(({ path, label }) => {
                const active = isActiveRoute(path);
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      style={{
                        display: "block",
                        padding: "0.5rem 1.25rem",
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        color: active ? "#00d4ff" : "#7090b0",
                        background: active ? "rgba(0, 212, 255, 0.06)" : "transparent",
                        borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = "#b0d0f0";
                          e.currentTarget.style.background = "rgba(0, 212, 255, 0.03)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.color = "#7090b0";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
