import { useState } from 'react';
import { Card, Btn, Input, T, Icon } from '../Dashboard/Dashboard';

export default function ExpenseForm({
  expense,
  categories,
  onSave,
  onCancel,
  isMobile
}) {
  const isEdit = !!expense;
  const [label, setLabel] = useState(expense?.label || '');
  const [amount, setAmount] = useState(expense?.amount || '');
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split('T')[0]);
  const [catId, setCatId] = useState(expense?.categoryId || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!label.trim()) e.label = 'Label is required';
    if (!amount || +amount <= 0) e.amount = 'Enter a valid amount';
    if (!date) e.date = 'Date is required';
    if (!catId) e.catId = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...expense,
        label: label.trim(),
        amount: parseFloat(amount),
        date,
        categoryId: Number(catId)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-in" style={{ padding: isMobile ? '20px 16px 90px' : '32px 36px', maxWidth: 600, margin: '0 auto' }}>
      <button
        onClick={onCancel}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.gray, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        Back to Expenses
      </button>

      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontWeight: 900, fontSize: isMobile ? 24 : 30, color: T.dark, letterSpacing: '-0.02em' }}>
          {isEdit ? 'Edit Expense' : 'Add Expense'}
        </h1>
        <p style={{ color: T.gray, fontSize: 13, fontWeight: 500, marginTop: 6 }}>
          {isEdit ? 'Update the details below.' : 'Fill in the details of your new expense.'}
        </p>
      </div>

      <Card className="fade-up">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <Input label="Label" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Lunch at Café" required />
            {errors.label && <p style={{ color: T.danger, fontSize: 12, fontWeight: 600, marginTop: 4 }}>{errors.label}</p>}
          </div>
          <div>
            <Input label="Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
            {errors.amount && <p style={{ color: T.danger, fontSize: 12, fontWeight: 600, marginTop: 4 }}>{errors.amount}</p>}
          </div>
          <div>
            <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            {errors.date && <p style={{ color: T.danger, fontSize: 12, fontWeight: 600, marginTop: 4 }}>{errors.date}</p>}
          </div>
          <div>
            <Input label="Category" type="select" value={catId} onChange={e => setCatId(e.target.value)} options={[
              { value: '', label: '— Select —' },
              ...categories.map(c => ({ value: String(c.id), label: c.title }))
            ]} required />
            {errors.catId && <p style={{ color: T.danger, fontSize: 12, fontWeight: 600, marginTop: 4 }}>{errors.catId}</p>}
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <Btn variant="outline" onClick={onCancel} style={{ flex: 1 }}>Cancel</Btn>
            <Btn variant="primary" onClick={handleSave} disabled={saving} style={{ flex: 2 }}>
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${T.dark}40`, borderTopColor: T.dark, animation: 'spin 0.7s linear infinite' }} />
                  Saving…
                </span>
              ) : (isEdit ? 'Save Changes' : 'Add Expense')}
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
