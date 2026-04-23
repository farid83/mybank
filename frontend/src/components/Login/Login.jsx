import { useState } from 'react'

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  teal:    "#156064",
  mint:    "#00C49A",
  yellow:  "#F8E16C",
  white:   "#FFFFFF",
  offwhite:"#F4F9F9",
  light:   "#E8F5F5",
  gray:    "#8BA5A7",
  dark:    "#0D3D40",
  danger:  "#FF6B6B",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Montserrat', sans-serif;
    background: ${T.offwhite};
    color: ${T.dark};
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.light}; }
  ::-webkit-scrollbar-thumb { background: ${T.mint}; border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pop {
    0%   { transform: scale(0.92); opacity: 0; }
    60%  { transform: scale(1.03); }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up  { animation: fadeUp  0.45s cubic-bezier(.22,.68,0,1.2) both; }
  .fade-in  { animation: fadeIn  0.35s ease both; }
  .pop      { animation: pop     0.4s  cubic-bezier(.22,.68,0,1.2) both; }

  input, select, textarea {
    font-family: 'Montserrat', sans-serif;
  }

  button { cursor: pointer; font-family: 'Montserrat', sans-serif; }
`;

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

// Button
const Btn = ({ children, variant = "primary", size = "md", onClick, type = "button", disabled, style: sx = {} }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, fontWeight: 700, letterSpacing: "0.02em", border: "none",
    borderRadius: 50, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s cubic-bezier(.22,.68,0,1.2)",
    fontFamily: "Montserrat, sans-serif",
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: "8px 18px",  fontSize: 13 },
    md: { padding: "12px 26px", fontSize: 14 },
    lg: { padding: "16px 36px", fontSize: 16 },
  };
  const variants = {
    primary:   { background: T.mint,   color: T.dark },
    secondary: { background: T.teal,   color: T.white },
    outline:   { background: "transparent", color: T.teal, border: `2px solid ${T.teal}` },
    danger:    { background: T.danger, color: T.white },
    ghost:     { background: "transparent", color: T.gray },
    yellow:    { background: T.yellow, color: T.dark },
  };
  const hoverMap = {
    primary:   { filter: "brightness(1.08)", transform: "translateY(-1px)", boxShadow: `0 8px 24px ${T.mint}55` },
    secondary: { filter: "brightness(1.15)", transform: "translateY(-1px)" },
    yellow:    { filter: "brightness(1.06)", transform: "translateY(-1px)" },
    danger:    { filter: "brightness(1.08)", transform: "translateY(-1px)" },
  };
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...(hover ? hoverMap[variant] || {} : {}), ...sx }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
};

// Input
const Input = ({ label, value, onChange, type = "text", placeholder, required, options }) => {
  const [focus, setFocus] = useState(false);
  const base = {
    width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
    fontFamily: "Montserrat, sans-serif", fontWeight: 500,
    border: `2px solid ${focus ? T.mint : "#E0EEEF"}`,
    outline: "none", background: T.white, color: T.dark,
    transition: "border-color 0.2s",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: T.gray, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}{required && " *"}</label>}
      {type === "select" ? (
        <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={base}>
          <option value="">— Select —</option>
          {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          required={required} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={base}
        />
      )}
    </div>
  );
};

// Avatar / Logo
const Logo = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, ${T.mint} 0%, ${T.teal} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  }}>
    <span style={{ color: T.white, fontWeight: 900, fontSize: size * 0.38, letterSpacing: "-0.03em" }}>m</span>
  </div>
);

// Icon (SVG paths)
const icons = {
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeOff:   "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19 M1 1l22 22",
  check:    "M20 6L9 17l-5-5",
};

const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {icons[name]?.split(" M").map((d, i) => (
      <path key={i} d={(i === 0 ? d : "M" + d)} />
    ))}
  </svg>
);

// ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{
        minHeight: "100vh", display: "flex", background: T.offwhite,
        fontFamily: "Montserrat, sans-serif",
      }}>
        {/* Left panel */}
        <div style={{
          flex: "1 1 50%", background: `linear-gradient(145deg, ${T.teal} 0%, ${T.dark} 100%)`,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: 48, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: [300,200,150][i], height: [300,200,150][i],
              borderRadius: "50%", border: `1px solid rgba(255,255,255,${[0.05,0.08,0.04][i]})`,
              top: ["10%","60%","30%"][i], left: ["60%","-10%","70%"][i],
            }} />
          ))}
          <div style={{ position: "absolute", top: "25%", left: "15%", width: 80, height: 80, borderRadius: "50%", background: T.mint + "30" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 40, height: 40, borderRadius: "50%", background: T.yellow + "40" }} />

          <div className="fade-up" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <Logo size={64} />
            <h1 style={{ color: T.white, fontWeight: 900, fontSize: 42, marginTop: 20, letterSpacing: "-0.03em" }}>myBank</h1>
            <p style={{ color: T.mint, fontWeight: 600, fontSize: 14, letterSpacing: "0.12em", marginTop: 4 }}>PERSONAL FINANCE</p>
            <div style={{ height: 2, width: 48, background: T.yellow, borderRadius: 2, margin: "24px auto" }} />
            <p className="delay-2 fade-up" style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
              Take control of your money.<br/>Track every expense, understand your habits.
            </p>
            {/* Feature bullets */}
            {["Smart expense tracking", "Category insights", "Real-time balance"].map((f, i) => (
              <div key={i} className="fade-up" style={{ animationDelay: `${0.3 + i * 0.08}s`, display: "flex", alignItems: "center", gap: 10, marginTop: 14, justifyContent: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.mint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="check" size={11} color={T.dark} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          flex: "1 1 50%", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 48,
        }}>
          <div className="fade-up" style={{ width: "100%", maxWidth: 400 }}>
            <h2 style={{ fontWeight: 800, fontSize: 28, color: T.dark, marginBottom: 8 }}>Welcome back 👋</h2>
            <p style={{ color: T.gray, fontSize: 14, marginBottom: 36 }}>Sign in to your account to continue</p>

            {error && (
              <div style={{ background: T.danger + "18", border: `1px solid ${T.danger}40`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: T.danger, fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.gray, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: "100%", padding: "12px 48px 12px 16px", borderRadius: 12, fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 500, border: `2px solid #E0EEEF`, outline: "none", background: T.white, color: T.dark }}
                  />
                  <button onClick={() => setShowPw(s => !s)} type="button" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.gray, display: "flex" }}>
                    <Icon name={showPw ? "eyeOff" : "eye"} size={18} color={T.gray} />
                  </button>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right", marginTop: 10, marginBottom: 28 }}>
              <span style={{ color: T.mint, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
            </div>

            <Btn variant="primary" size="lg" onClick={handleSubmit} disabled={loading} style={{ width: "100%" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${T.dark}40`, borderTopColor: T.dark, animation: "spin 0.7s linear infinite" }} />
                  Signing in…
                </span>
              ) : "Sign In"}
            </Btn>

            {/* Demo hint */}
            <div style={{ marginTop: 24, padding: "14px 16px", background: T.light, borderRadius: 12, fontSize: 12, color: T.gray, fontWeight: 500, lineHeight: 1.6 }}>
              <strong style={{ color: T.teal }}>Demo:</strong> Enter any email & password to log in.
            </div>

            <p style={{ textAlign: "center", marginTop: 28, color: T.gray, fontSize: 13 }}>
              Don't have an account? <span style={{ color: T.mint, fontWeight: 700, cursor: "pointer" }}>Sign up</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
