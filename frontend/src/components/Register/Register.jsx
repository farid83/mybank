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
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

const Icon = ({ name, size = 20, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {icons[name]?.split(" M").map((d, i) => (
      <path key={i} d={(i === 0 ? d : "M" + d)} />
    ))}
  </svg>
);

// ─── REGISTER SCREEN ─────────────────────────────────────────────────────────
export default function Register({ onRegister, onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onRegister({ fullName, email });
    }, 1500);
  };

  return (
    <>
      <style>{globalStyle}</style>
      <div style={{
        minHeight: "100vh", display: "flex", background: T.offwhite,
        fontFamily: "Montserrat, sans-serif",
      }}>
        {/* Left panel (Illustration/Branding) */}
        <div style={{
          flex: "1 1 45%", background: `linear-gradient(145deg, ${T.dark} 0%, ${T.teal} 100%)`,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: 48, position: "relative", overflow: "hidden",
        }}>
          {/* Decorative elements */}
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(0,196,154,0.05)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 200, height: 200, borderRadius: "50%", background: "rgba(248,225,108,0.08)" }} />
          
          <div className="fade-up" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <Logo size={80} />
            <h1 style={{ color: T.white, fontWeight: 900, fontSize: 48, marginTop: 24, letterSpacing: "-0.04em" }}>Join myBank</h1>
            <p style={{ color: T.mint, fontWeight: 700, fontSize: 14, letterSpacing: "0.15em", marginTop: 8, textTransform: "uppercase" }}>Start your journey</p>
            
            <div style={{ height: 3, width: 60, background: T.yellow, borderRadius: 3, margin: "32px auto" }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 340 }}>
              {[
                { title: "No hidden fees", desc: "Transparent banking for everyone." },
                { title: "Smart Analytics", desc: "Visualize where your money goes." },
                { title: "Top-tier Security", desc: "Your data is encrypted and safe." }
              ].map((item, i) => (
                <div key={i} className="fade-up" style={{ animationDelay: `${0.2 + i * 0.1}s`, display: "flex", gap: 16, textAlign: "left" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="check" size={20} color={T.mint} />
                  </div>
                  <div>
                    <h4 style={{ color: T.white, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel (Form) */}
        <div style={{
          flex: "1 1 55%", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 48, background: T.white,
        }}>
          <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontWeight: 900, fontSize: 32, color: T.dark, marginBottom: 12, letterSpacing: "-0.02em" }}>Create Account</h2>
              <p style={{ color: T.gray, fontSize: 15, fontWeight: 500 }}>Step into a smarter financial future.</p>
            </div>

            {error && (
              <div className="pop" style={{ background: T.danger + "12", border: `1px solid ${T.danger}30`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, color: T.danger, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.danger, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>!</div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Input 
                label="Full Name" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                placeholder="John Doe" 
                required 
              />
              
              <Input 
                label="Email Address" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="john@example.com" 
                required 
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.gray, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontFamily: "Montserrat", fontWeight: 500, border: `2px solid #E0EEEF`, outline: "none", background: T.white, color: T.dark }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.gray, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Confirm</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontFamily: "Montserrat", fontWeight: 500, border: `2px solid #E0EEEF`, outline: "none", background: T.white, color: T.dark }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -4 }}>
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  style={{ background: "none", border: "none", padding: 0, color: T.teal, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Icon name={showPw ? "eyeOff" : "eye"} size={16} />
                  {showPw ? "Hide passwords" : "Show passwords"}
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <Btn variant="primary" size="lg" type="submit" onClick={handleSubmit} disabled={loading} style={{ width: "100%" }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `3px solid ${T.dark}20`, borderTopColor: T.dark, animation: "spin 0.8s linear infinite" }} />
                      Creating account…
                    </span>
                  ) : "Create Account"}
                </Btn>
              </div>
            </form>

            <p style={{ textAlign: "center", marginTop: 32, color: T.gray, fontSize: 14, fontWeight: 500 }}>
              Already have an account?{" "}
              <button 
                onClick={onSwitchToLogin} 
                style={{ background: "none", border: "none", padding: 0, color: T.mint, fontWeight: 800, cursor: "pointer", fontSize: 14 }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
