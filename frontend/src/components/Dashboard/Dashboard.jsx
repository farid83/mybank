import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import Expenses from '../Expenses/Expenses';
import ExpenseForm from '../Expenses/ExpenseForm';
import { T, fmt, fmtDate } from './theme';


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

  .delay-1  { animation-delay: 0.05s; }
  .delay-2  { animation-delay: 0.10s; }
  .delay-3  { animation-delay: 0.15s; }
  .delay-4  { animation-delay: 0.20s; }
  .delay-5  { animation-delay: 0.25s; }
  .delay-6  { animation-delay: 0.30s; }

  input, select, textarea {
    font-family: 'Montserrat', sans-serif;
  }

  button { cursor: pointer; font-family: 'Montserrat', sans-serif; }
`;

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_CATEGORIES = [
  { id: 1, title: 'Alimentation', color: T.mint },
  { id: 2, title: 'Transport', color: T.teal },
  { id: 3, title: 'Loisirs', color: T.yellow },
  { id: 4, title: 'Santé', color: '#FF8FAB' },
  { id: 5, title: 'Shopping', color: '#A78BFA' },
];

const SEED_EXPENSES = [
  { id: 1, label: 'Lunch at Café', amount: 14.5, date: '2025-04-22', categoryId: 1 },
  { id: 2, label: 'Metro monthly pass', amount: 86.4, date: '2025-04-20', categoryId: 2 },
  { id: 3, label: 'Cinema tickets', amount: 22.0, date: '2025-04-19', categoryId: 3 },
  { id: 4, label: 'Grocery run', amount: 53.2, date: '2025-04-18', categoryId: 1 },
  { id: 5, label: 'Pharmacy', amount: 18.9, date: '2025-04-17', categoryId: 4 },
  { id: 6, label: 'New sneakers', amount: 79.99, date: '2025-04-15', categoryId: 5 },
  { id: 7, label: 'Spotify Premium', amount: 9.99, date: '2025-04-14', categoryId: 3 },
  { id: 8, label: 'Burger & fries', amount: 12.3, date: '2025-04-12', categoryId: 1 },
  { id: 9, label: 'Uber ride', amount: 7.6, date: '2025-04-11', categoryId: 2 },
  { id: 10, label: 'Book purchase', amount: 16.0, date: '2025-04-10', categoryId: 5 },
];

const BALANCE = 1847.35;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
export const Btn = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, style: sx = {} }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, fontWeight: 700, letterSpacing: '0.02em', border: 'none',
    borderRadius: 50, cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(.22,.68,0,1.2)',
    fontFamily: 'Montserrat, sans-serif', opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: '8px 18px', fontSize: 13 },
    md: { padding: '12px 26px', fontSize: 14 },
    lg: { padding: '16px 36px', fontSize: 16 },
  };
  const variants = {
    primary: { background: T.mint, color: T.dark },
    secondary: { background: T.teal, color: T.white },
    outline: { background: 'transparent', color: T.teal, border: `2px solid ${T.teal}` },
    danger: { background: T.danger, color: T.white },
    ghost: { background: 'transparent', color: T.gray },
    yellow: { background: T.yellow, color: T.dark },
  };
  const hoverMap = {
    primary: { filter: 'brightness(1.08)', transform: 'translateY(-1px)', boxShadow: `0 8px 24px ${T.mint}55` },
    secondary: { filter: 'brightness(1.15)', transform: 'translateY(-1px)' },
    yellow: { filter: 'brightness(1.06)', transform: 'translateY(-1px)' },
    danger: { filter: 'brightness(1.08)', transform: 'translateY(-1px)' },
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

export const Card = ({ children, style: sx = {}, className = '', onClick }) => (
  <div
    className={className}
    onClick={onClick}
    style={{
      background: T.white, borderRadius: 20, padding: 24,
      boxShadow: '0 2px 20px rgba(21,96,100,0.07)',
      ...sx, cursor: onClick ? 'pointer' : 'default',
    }}
  >
    {children}
  </div>
);

export const Input = ({ label, value, onChange, type = 'text', placeholder, required, options }) => {
  const [focus, setFocus] = useState(false);
  const base = {
    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
    fontFamily: 'Montserrat, sans-serif', fontWeight: 500,
    border: `2px solid ${focus ? T.mint : '#E0EEEF'}`,
    outline: 'none', background: T.white, color: T.dark,
    transition: 'border-color 0.2s',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: T.gray, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}{required && ' *'}</label>}
      {type === 'select' ? (
        <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={base}>
          {options?.map(o => <option key={String(o.value)} value={String(o.value)}>{o.label}</option>)}
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

export const Badge = ({ color, label }) => (
  <span style={{
    display: 'inline-block', padding: '3px 10px', borderRadius: 50,
    background: color + '22', color, fontSize: 11, fontWeight: 700,
    letterSpacing: '0.04em',
  }}>{label}</span>
);

export const Logo = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: `linear-gradient(135deg, ${T.mint} 0%, ${T.teal} 100%)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <span style={{ color: T.white, fontWeight: 900, fontSize: size * 0.38, letterSpacing: '-0.03em' }}>m</span>
  </div>
);

export const Dot = ({ color }) => (
  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
);

const icons = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  plus: 'M12 5v14M5 12h14',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  chevronR: 'M9 18l6-6-6-6',
  wallet: 'M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z M16 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  eyeOff: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19 M1 1l22 22',
  close: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
};

export const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {icons[name]?.split(' M').map((d, i) => (
      <path key={i} d={(i === 0 ? d : 'M' + d)} />
    ))}
  </svg>
);

const Toast = ({ message, type = 'success', onClose }) => (
  <div className="pop" style={{
    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
    background: type === 'success' ? T.mint : T.danger,
    color: type === 'success' ? T.dark : T.white,
    borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 700, fontSize: 14, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', maxWidth: 320,
  }}>
    <Icon name={type === 'success' ? 'check' : 'close'} size={18} color="currentColor" />
    {message}
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', opacity: 0.7 }}>
      <Icon name="close" size={16} color="currentColor" />
    </button>
  </div>
);

export const Empty = ({ label }) => (
  <div style={{ textAlign: 'center', padding: '40px 20px', color: T.gray }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>🫙</div>
    <p style={{ fontWeight: 600, fontSize: 15 }}>{label}</p>
  </div>
);

export const DeleteModal = ({ label, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(13,61,64,0.45)', zIndex: 999,
    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)',
  }}>
    <Card className="pop" style={{ maxWidth: 360, width: '90%', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
      <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: T.dark }}>Delete "{label}"?</h3>
      <p style={{ color: T.gray, fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
      </div>
    </Card>
  </div>
);

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'expenses', label: 'Expenses', icon: 'list' },
  { id: 'categories', label: 'Categories', icon: 'tag' },
];

const Sidebar = ({ screen, setScreen, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 72 : 220, minHeight: '100vh', background: T.teal,
      display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(.22,.68,0,1.2)',
      flexShrink: 0, position: 'relative', boxShadow: '4px 0 24px rgba(21,96,100,0.12)', zIndex: 10,
    }}>
      <div style={{ padding: collapsed ? '20px 16px' : '24px 24px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Logo size={36} />
        {!collapsed && (
          <div>
            <div style={{ color: T.white, fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em' }}>myBank</div>
            <div style={{ color: T.mint, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em' }}>PERSONAL FINANCE</div>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: 'absolute', right: -14, top: 72, width: 28, height: 28, borderRadius: '50%',
          background: T.yellow, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.3s', transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.dark} strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              title={collapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px' : '12px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: active ? T.yellow : 'transparent', color: active ? T.dark : 'rgba(255,255,255,0.75)',
                fontWeight: active ? 700 : 500, fontSize: 14, transition: 'all 0.18s', justifyContent: collapsed ? 'center' : 'flex-start', width: '100%',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon name={item.icon} size={18} color={active ? T.dark : 'rgba(255,255,255,0.75)'} />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div style={{ padding: '0 16px 16px' }}>
          <Btn variant="yellow" size="sm" onClick={() => setScreen('add-expense')} style={{ width: '100%', borderRadius: 14 }}>
            <Icon name="plus" size={16} color={T.dark} /> Add Expense
          </Btn>
        </div>
      )}

      <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={onLogout}
          title="Logout"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px' : '12px 16px',
            borderRadius: 14, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.5)',
            fontWeight: 500, fontSize: 14, transition: 'all 0.18s', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <Icon name="logout" size={18} color="currentColor" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

const MobileNav = ({ screen, setScreen }) => (
  <nav style={{
    position: 'fixed', bottom: 0, left: 0, right: 0, background: T.white,
    borderTop: `1px solid ${T.light}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    padding: '8px 0 16px', zIndex: 100, boxShadow: '0 -4px 20px rgba(21,96,100,0.1)',
  }}>
    {NAV_ITEMS.map(item => {
      const active = screen === item.id;
      return (
        <button
          key={item.id} onClick={() => setScreen(item.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: active ? T.mint : T.gray, fontWeight: active ? 700 : 500, fontSize: 10,
            transition: 'color 0.15s',
          }}
        >
          <div style={{
            background: active ? T.mint + '20' : 'transparent', padding: '6px 14px', borderRadius: 12,
            transition: 'background 0.15s',
          }}>
            <Icon name={item.icon} size={20} color={active ? T.mint : T.gray} />
          </div>
          {item.label}
        </button>
      );
    })}
    <button
      onClick={() => setScreen('add-expense')}
      style={{
        background: T.mint, border: 'none', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${T.mint}88`,
      }}
    >
      <Icon name="plus" size={22} color={T.dark} />
    </button>
  </nav>
);

const DashboardScreen = ({ expenses, categories, setScreen, setEditExpense, isMobile }) => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const catData = categories.map(cat => ({
    name: cat.title, color: cat.color,
    value: +expenses.filter(e => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0).toFixed(2),
  })).filter(d => d.value > 0);

  const getCat = (id) => categories.find(c => c.id === id);

  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px 90px' : '32px 36px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p style={{ color: T.gray, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Good morning 🌤️</p>
        <h1 style={{ fontWeight: 900, fontSize: isMobile ? 24 : 30, color: T.dark, letterSpacing: '-0.02em' }}>Dashboard</h1>
      </div>

      <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ background: `linear-gradient(135deg, ${T.teal} 0%, ${T.dark} 100%)`, color: T.white, gridColumn: isMobile ? '1 / -1' : '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, marginBottom: 8 }}>TOTAL BALANCE</p>
              <p style={{ fontWeight: 900, fontSize: isMobile ? 30 : 36, letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(BALANCE - total)}</p>
              <p style={{ fontSize: 12, opacity: 0.6, marginTop: 6, fontWeight: 500 }}>After {expenses.length} expenses</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 12 }}>
              <Icon name="wallet" size={24} color={T.yellow} />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 16 }}>
            <div>
              <p style={{ fontSize: 10, opacity: 0.6, fontWeight: 600, letterSpacing: '0.06em' }}>INCOME</p>
              <p style={{ fontWeight: 800, fontSize: 16, color: T.mint }}>{fmt(BALANCE)}</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div>
              <p style={{ fontSize: 10, opacity: 0.6, fontWeight: 600, letterSpacing: '0.06em' }}>SPENT</p>
              <p style={{ fontWeight: 800, fontSize: 16, color: T.yellow }}>{fmt(total)}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.gray, letterSpacing: '0.08em', marginBottom: 10 }}>TOTAL SPENT</p>
          <p style={{ fontWeight: 900, fontSize: 24, color: T.dark }}>{fmt(total)}</p>
          <p style={{ fontSize: 12, color: T.gray, marginTop: 4 }}>This month</p>
          <div style={{ height: 3, background: T.light, borderRadius: 2, marginTop: 14 }}>
            <div style={{ height: '100%', width: `${Math.min((total / BALANCE) * 100, 100)}%`, background: T.mint, borderRadius: 2, transition: 'width 1s' }} />
          </div>
        </Card>

        <Card>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.gray, letterSpacing: '0.08em', marginBottom: 10 }}>TRANSACTIONS</p>
          <p style={{ fontWeight: 900, fontSize: 24, color: T.dark }}>{expenses.length}</p>
          <p style={{ fontSize: 12, color: T.gray, marginTop: 4 }}>Total expenses</p>
          <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
            {[...Array(Math.min(expenses.length, 7))].map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: T.mint, opacity: 0.4 + i * 0.08 }} />
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 20 }}>
        <Card className="fade-up delay-2">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, fontSize: 17, color: T.dark }}>Recent Expenses</h2>
            <Btn variant="ghost" size="sm" onClick={() => setScreen('expenses')} style={{ color: T.mint, fontWeight: 700 }}>
              See all <Icon name="chevronR" size={14} color={T.mint} />
            </Btn>
          </div>
          {recent.length === 0 ? <Empty label="No expenses yet" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recent.map((exp, i) => {
                const cat = getCat(exp.categoryId);
                return (
                  <div
                    key={exp.id}
                    className="fade-up"
                    style={{ animationDelay: `${0.25 + i * 0.06}s`, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < recent.length - 1 ? `1px solid ${T.light}` : 'none', cursor: 'pointer' }}
                    onClick={() => { setEditExpense(exp); setScreen('add-expense'); }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: (cat?.color || T.mint) + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="tag" size={18} color={cat?.color || T.mint} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: T.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.label}</p>
                      <p style={{ fontSize: 11, color: T.gray, marginTop: 2 }}>{fmtDate(exp.date)}</p>
                    </div>
                    {cat && <Badge color={cat.color} label={cat.title} />}
                    <span style={{ fontWeight: 800, fontSize: 15, color: T.dark, flexShrink: 0 }}>-{fmt(exp.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="fade-up delay-3">
          <h2 style={{ fontWeight: 800, fontSize: 17, color: T.dark, marginBottom: 4 }}>By Category</h2>
          <p style={{ fontSize: 12, color: T.gray, marginBottom: 20 }}>Spending distribution</p>
          {catData.length === 0 ? <Empty label="No data yet" /> : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, marginBottom: 20, justifyContent: 'space-around' }}>
                {catData.map((d, i) => {
                  const maxValue = Math.max(...catData.map(x => x.value));
                  const height = (d.value / maxValue) * 140;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                      <div
                        style={{
                          width: '100%', height: height, background: d.color, borderRadius: '6px 6px 0 0',
                          transition: 'all 0.2s', cursor: 'pointer',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
                      />
                      <span style={{ fontSize: 10, fontWeight: 600, color: T.gray, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {d.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {catData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Dot color={d.color} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.dark }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.dark }}>{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};


const PALETTE = [T.mint, T.teal, T.yellow, '#FF8FAB', '#A78BFA', '#F97316', '#06B6D4', '#84CC16'];

const CategoriesScreen = ({ categories, setCategories, expenses, showToast, isMobile }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState(PALETTE[0]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState('');

  const expCount = (id) => expenses.filter(e => e.categoryId === id).length;

  const handleAdd = async () => {
    if (!newTitle.trim()) { setError('Category name is required.'); return; }
    if (categories.find(c => c.title.toLowerCase() === newTitle.trim().toLowerCase())) { setError('Category already exists.'); return; }

    try {
      const result = await api.createCategory(newTitle.trim());
      setCategories(prev => [...prev, result]);
      setNewTitle(''); setError('');
      showToast('Category added!', 'success');
    } catch (_) {
      showToast('Failed to add category', 'error');
    }
  };

  const handleUpdate = (cat) => {
    if (!editTitle.trim()) return;
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, title: editTitle.trim() } : c));
    setEditId(null);
    showToast('Category updated!', 'success');
  };

  const handleDelete = (cat) => {
    setCategories(prev => prev.filter(c => c.id !== cat.id));
    setDeleteTarget(null);
    showToast('Category deleted.', 'success');
  };

  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px 90px' : '32px 36px', maxWidth: 720, margin: '0 auto' }}>
      {deleteTarget && <DeleteModal label={deleteTarget.title} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}

      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p style={{ color: T.gray, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{categories.length} categories</p>
        <h1 style={{ fontWeight: 900, fontSize: isMobile ? 24 : 30, color: T.dark, letterSpacing: '-0.02em' }}>Categories</h1>
      </div>

      <Card className="fade-up delay-1" style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 16, color: T.dark, marginBottom: 16 }}>New Category</h2>
        {error && <div style={{ background: T.danger + '18', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: T.danger, fontSize: 13, fontWeight: 600 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Health" required />
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: T.gray, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PALETTE.map(c => (
                <button
                  key={c} onClick={() => setNewColor(c)}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', background: c,
                    border: newColor === c ? `3px solid ${T.dark}` : '3px solid transparent', cursor: 'pointer', transition: 'transform 0.15s',
                    transform: newColor === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
          <Btn variant="primary" onClick={handleAdd} style={{ alignSelf: 'flex-start' }}>
            <Icon name="plus" size={16} color={T.dark} /> Add Category
          </Btn>
        </div>
      </Card>

      <Card className="fade-up delay-2" style={{ padding: 0, overflow: 'hidden' }}>
        {categories.length === 0 ? (
          <div style={{ padding: 24 }}><Empty label="No categories yet" /></div>
        ) : (
          categories.map((cat, i) => (
            <div
              key={cat.id}
              className="fade-up"
              style={{
                animationDelay: `${0.3 + i * 0.05}s`, display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 24px', borderBottom: i < categories.length - 1 ? `1px solid ${T.light}` : 'none',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: cat.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Dot color={cat.color} />
              </div>
              {editId === cat.id ? (
                <input
                  autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat); if (e.key === 'Escape') setEditId(null); }}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: `2px solid ${T.mint}`, fontSize: 14, fontFamily: 'Montserrat', fontWeight: 600, color: T.dark, outline: 'none' }}
                />
              ) : (
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: T.dark }}>{cat.title}</p>
                  <p style={{ fontSize: 11, color: T.gray, marginTop: 2 }}>{expCount(cat.id)} expense{expCount(cat.id) !== 1 ? 's' : ''}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                {editId === cat.id ? (
                  <>
                    <Btn variant="primary" size="sm" onClick={() => handleUpdate(cat)}>Save</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setEditId(null)}>Cancel</Btn>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditId(cat.id); setEditTitle(cat.title); }} style={{ background: T.teal + '15', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', display: 'flex' }}>
                      <Icon name="edit" size={15} color={T.teal} />
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} style={{ background: T.danger + '15', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', display: 'flex' }}>
                      <Icon name="trash" size={15} color={T.danger} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

const TopBar = ({ screen, onLogout }) => {
  const labels = { dashboard: 'Dashboard', expenses: 'Expenses', 'add-expense': 'Add Expense', categories: 'Categories' };
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50, background: T.white, borderBottom: `1px solid ${T.light}`,
      padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 2px 12px rgba(21,96,100,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={28} />
        <span style={{ fontWeight: 800, fontSize: 16, color: T.dark }}>{labels[screen] || 'myBank'}</span>
      </div>
      <button onClick={onLogout} style={{ background: T.light, border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: T.gray, fontWeight: 600, fontSize: 12, fontFamily: 'Montserrat' }}>
        <Icon name="logout" size={14} color={T.gray} /> Logout
      </button>
    </div>
  );
};

export default function Dashboard({ onLogout }) {
  const [screen, setScreen] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editExpense, setEditExpense] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const toastTimer = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ops, cats] = await Promise.all([
          api.getOperations(),
          api.getCategories()
        ]);

        // Transform backend data to frontend format if necessary
        // Backend uses 'wording', frontend uses 'label'
        // Backend uses 'amount' as string, frontend uses as number
        const transformedOps = ops.map(op => ({
          id: op.id,
          label: op.wording,
          amount: parseFloat(op.amount),
          date: op.date.split('T')[0],
          categoryId: op.category.id
        }));

        setExpenses(transformedOps);
        setCategories(cats);
      } catch (_) {
        showToast("Failed to load data from server", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSaveExpense = async (data) => {
    try {
      const isEdit = !!editExpense;
      let result;
      const payload = {
        wording: data.label,
        amount: data.amount,
        date: data.date,
        categoryId: data.categoryId
      };
      if (isEdit) {
        result = await api.updateOperation(editExpense.id, payload);
      } else {
        result = await api.createOperation(payload);
      }

      const transformedResult = {
        id: result.id,
        label: result.wording,
        amount: parseFloat(result.amount),
        date: result.date.split('T')[0],
        categoryId: result.category.id
      };

      setExpenses(prev => isEdit
        ? prev.map(e => e.id === editExpense.id ? transformedResult : e)
        : [transformedResult, ...prev]
      );

      showToast(isEdit ? 'Expense updated!' : 'Expense added!', 'success');
      setScreen('expenses');
    } catch (_) {
      showToast(_.message || "Failed to save expense", "error");
    }
  };

  const handleDeleteExpense = async (exp) => {
    try {
      await api.deleteOperation(exp.id);
      setExpenses(prev => prev.filter(e => e.id !== exp.id));
      setDeleteTarget(null);
      showToast('Expense deleted', 'success');
    } catch (_) {
      showToast('Failed to delete expense', 'error');
    }
  };

  const handleDeleteCategory = async (cat) => {
    try {
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      setDeleteTarget(null);
      showToast('Category deleted', 'success');
    } catch (_) {
      showToast('Failed to delete category', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleNavTo = (s) => { if (s !== 'add-expense') setEditExpense(null); setScreen(s); };

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <DashboardScreen expenses={expenses} categories={categories} setScreen={handleNavTo} setEditExpense={setEditExpense} isMobile={isMobile} />;
      case 'expenses':
        return (
          <Expenses
            expenses={expenses}
            categories={categories}
            onAddExpense={() => { setEditExpense(null); setScreen('add-expense'); }}
            onEditExpense={(exp) => { setEditExpense(exp); setScreen('add-expense'); }}
            onDeleteExpense={setDeleteTarget}
            isMobile={isMobile}
          />
        );
      case 'add-expense':
        return (
          <ExpenseForm
            expense={editExpense}
            categories={categories}
            isMobile={isMobile}
            onCancel={() => setScreen('expenses')}
            onSave={handleSaveExpense}
          />
        );
      case 'categories': return <CategoriesScreen categories={categories} setCategories={setCategories} expenses={expenses} showToast={showToast} isMobile={isMobile} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.offwhite, flexDirection: 'column', gap: 20 }}>
        <Logo size={60} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', border: `3px solid ${T.mint}40`, borderTopColor: T.mint, animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontWeight: 700, color: T.dark, letterSpacing: '0.05em' }}>CONNECTING TO BANK...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{globalStyle}</style>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <DeleteModal label={deleteTarget.label || deleteTarget.title} onConfirm={() => (deleteTarget.label ? handleDeleteExpense(deleteTarget) : handleDeleteCategory(deleteTarget))} onCancel={() => setDeleteTarget(null)} />}

      {isMobile ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: T.offwhite }}>
          <TopBar screen={screen} onLogout={onLogout} />
          <main style={{ flex: 1 }}>{renderScreen()}</main>
          <MobileNav screen={screen} setScreen={handleNavTo} />
        </div>
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh', background: T.offwhite }}>
          <Sidebar screen={screen} setScreen={handleNavTo} onLogout={onLogout} />
          <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>{renderScreen()}</main>
        </div>
      )}
    </>
  );
}
