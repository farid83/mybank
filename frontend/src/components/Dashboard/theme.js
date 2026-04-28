// theme.js
export const T = {
  teal:     '#156064',
  mint:     '#00C49A',
  yellow:   '#F8E16C',
  white:    '#FFFFFF',
  offwhite: '#F4F9F9',
  light:    '#E8F5F5',
  gray:     '#8BA5A7',
  dark:     '#0D3D40',
  danger:   '#FF6B6B',
};

export const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });