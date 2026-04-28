import { useState } from 'react';
import { Card, Btn, Input, Badge, Icon, Empty, Dot, T, fmt, fmtDate } from '../Dashboard/Dashboard'; // Reusing base components

export default function Expenses({
  expenses,
  categories,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  isMobile
}) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const filtered = expenses
    .filter(exp => {
      const matchSearch = exp.label.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === '' || exp.categoryId === Number(filterCat);
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const totalFiltered = filtered.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px 90px' : '32px 36px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ color: T.gray, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            {filtered.length} of {expenses.length} transactions
          </p>
          <h1 style={{ fontWeight: 900, fontSize: isMobile ? 24 : 32, color: T.dark, letterSpacing: '-0.02em' }}>Expenses</h1>
        </div>
        <Btn variant="primary" onClick={onAddExpense}>
          <Icon name="plus" size={16} color={T.dark} /> Add Expense
        </Btn>
      </div>

      {/* Stats Summary for Filtered Results */}
      <div className="fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ background: T.teal, color: T.white }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.8, marginBottom: 8 }}>FILTERED TOTAL</p>
          <p style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>{fmt(totalFiltered)}</p>
        </Card>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: T.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="list" size={20} color={T.teal} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.gray, letterSpacing: '0.08em' }}>AVG. TRANSACTION</p>
            <p style={{ fontWeight: 800, fontSize: 18, color: T.dark }}>{fmt(filtered.length ? totalFiltered / filtered.length : 0)}</p>
          </div>
        </Card>
      </div>

      {/* Filters & Sorting */}
      <Card className="fade-up delay-2" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 180px 180px', gap: 12, alignItems: 'end' }}>
          <Input label="Search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..." />

          <Input
            label="Category"
            type="select"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            options={[
              { value: '', label: 'All categories' },
              ...categories.map(c => ({ value: String(c.id), label: c.title }))
            ]}
          />

          <Input label="Sort By" type="select" value={sortBy} onChange={e => setSortBy(e.target.value)}
            options={[
              { value: 'date-desc', label: 'Newest First' },
              { value: 'date-asc', label: 'Oldest First' },
              { value: 'amount-desc', label: 'Highest Amount' },
              { value: 'amount-asc', label: 'Lowest Amount' },
            ]}
          />
        </div>
      </Card>

      {/* List */}
      <Card className="fade-up delay-3" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40 }}><Empty label="No transactions found" /></div>
        ) : (
          <div>
            {!isMobile && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 140px 160px 110px', gap: 12, padding: '14px 24px', borderBottom: `1px solid ${T.light}`, background: T.offwhite }}>
                {['Label', 'Amount', 'Date', 'Category', 'Actions'].map((h, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 700, color: T.gray, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>
            )}
            {filtered.map((exp, i) => {
              const cat = categories.find(c => c.id === exp.categoryId);
              return (
                <div
                  key={exp.id}
                  className="fade-up"
                  style={{
                    animationDelay: `${0.35 + i * 0.03}s`, display: isMobile ? 'flex' : 'grid',
                    gridTemplateColumns: isMobile ? undefined : '1fr 130px 140px 160px 110px',
                    flexDirection: isMobile ? 'column' : undefined, gap: 12, padding: isMobile ? '16px' : '16px 24px',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.light}` : 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.offwhite; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {isMobile ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, color: T.dark }}>{exp.label}</p>
                          <p style={{ fontSize: 12, color: T.gray, marginTop: 4 }}>{fmtDate(exp.date)}</p>
                        </div>
                        <p style={{ fontWeight: 800, fontSize: 16, color: T.dark }}>{fmt(exp.amount)}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        {cat ? <Badge color={cat.color} label={cat.title} /> : <span />}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => onEditExpense(exp)} style={{ background: T.teal + '15', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: T.teal, transition: '0.2s' }}>
                            <Icon name="edit" size={14} color={T.teal} />
                          </button>
                          <button onClick={() => onDeleteExpense(exp)} style={{ background: T.danger + '15', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: T.danger }}>
                            <Icon name="trash" size={14} color={T.danger} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ fontWeight: 700, fontSize: 14, color: T.dark, alignSelf: 'center' }}>{exp.label}</p>
                      <p style={{ fontWeight: 800, fontSize: 15, color: T.dark, alignSelf: 'center' }}>{fmt(exp.amount)}</p>
                      <p style={{ fontSize: 13, color: T.gray, alignSelf: 'center' }}>{fmtDate(exp.date)}</p>
                      <div style={{ alignSelf: 'center' }}>{cat ? <Badge color={cat.color} label={cat.title} /> : '—'}</div>
                      <div style={{ display: 'flex', gap: 8, alignSelf: 'center', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => onEditExpense(exp)}
                          title="Edit"
                          style={{ background: T.teal + '12', border: 'none', borderRadius: 10, padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = T.teal + '20'}
                          onMouseLeave={e => e.currentTarget.style.background = T.teal + '12'}
                        >
                          <Icon name="edit" size={16} color={T.teal} />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp)}
                          title="Delete"
                          style={{ background: T.danger + '12', border: 'none', borderRadius: 10, padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = T.danger + '20'}
                          onMouseLeave={e => e.currentTarget.style.background = T.danger + '12'}
                        >
                          <Icon name="trash" size={16} color={T.danger} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
