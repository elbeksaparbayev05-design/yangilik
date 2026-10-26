import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deleteDesign, getDesignsForCustomer, saveDesign } from '../../services/store';
import { Empty, formatDate, formatSum } from '../../components/ui';
import type { DesignRequest } from '../../types';

const FURNITURE_TYPES = ['Shkaf', 'Oshxona garnitura', 'To\'shak', 'Stol', 'TV zona', 'Bolalar mebeli', 'Kitob javoni'];
const ROOMS = ['Yotoqxona', 'Oshxona', 'Mehmonxona', 'Bolalar xonasi', 'Ofis', 'Dahliz'];
const MATERIALS = ['MDF', "Yog'och", 'Laminat', 'Metall + MDF'];
const COLORS = ['Oq', 'Yong\'oq', 'Eman', 'Kulrang', 'Qora', 'Jigarrang'];
const STYLES = ['Zamonaviy', 'Minimal', 'Klassik', 'Loft', 'Skandinaviya'];

export default function AiDesign() {
  const { user } = useAuth();
  const [form, setForm] = useState({ furnitureType: FURNITURE_TYPES[0], room: ROOMS[0], width: '', height: '', depth: '', material: MATERIALS[0], color: COLORS[0], style: STYLES[0], budget: '', notes: '' });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<DesignRequest | null>(null);
  const [saved, setSaved] = useState(0);

  if (!user) return null;
  const designs = getDesignsForCustomer(user.id);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setResult(null);
    // DEMO: simulated generation delay. No real AI service is connected.
    // Integration point: replace with a call to a design-generation API.
    setTimeout(() => {
      const concept = `${form.room} uchun ${form.style.toLowerCase()} uslubda ${form.color.toLowerCase()} rangli ${form.material.toLowerCase()} ${form.furnitureType.toLowerCase()}${
        form.width ? ` — ${form.width}×${form.height || '—'}×${form.depth || '—'} sm` : ''
      }. ${form.budget ? `Byudjet: ${formatSum(Number(form.budget))}.` : ''}`;
      const design = saveDesign({
        customerId: user.id,
        furnitureType: form.furnitureType,
        room: form.room,
        width: form.width ? Number(form.width) : undefined,
        height: form.height ? Number(form.height) : undefined,
        depth: form.depth ? Number(form.depth) : undefined,
        material: form.material,
        color: form.color,
        style: form.style,
        budget: form.budget ? Number(form.budget) : undefined,
        notes: form.notes || undefined,
        resultConcept: concept,
      });
      setResult(design);
      setGenerating(false);
      setSaved((n) => n + 1);
    }, 1200);
  };

  return (
    <div>
      <div className="alert alert-success" style={{ background: '#fff8e6', color: '#8a6d1a' }}>
        ⚠️ Demo rejim: AI xizmati ulanmagan. Natija shablon asosida shakllantiriladi — keyin haqiqiy AI API ulash uchun tayyor nuqta qoldirilgan.
      </div>
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <form className="card" onSubmit={submit}>
          <h3>Mebel parametrlari</h3>
          <div className="field"><label>Mebel turi</label>
            <select value={form.furnitureType} onChange={(e) => set('furnitureType', e.target.value)}>{FURNITURE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div className="field"><label>Xona / joylashuv</label>
            <select value={form.room} onChange={(e) => set('room', e.target.value)}>{ROOMS.map((r) => <option key={r}>{r}</option>)}</select>
          </div>
          <div className="grid grid-3">
            <div className="field"><label>Eni (sm)</label><input type="number" min={0} value={form.width} onChange={(e) => set('width', e.target.value)} placeholder="240" /></div>
            <div className="field"><label>Balandligi</label><input type="number" min={0} value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="250" /></div>
            <div className="field"><label>Chuqurligi</label><input type="number" min={0} value={form.depth} onChange={(e) => set('depth', e.target.value)} placeholder="60" /></div>
          </div>
          <div className="grid grid-3">
            <div className="field"><label>Material</label>
              <select value={form.material} onChange={(e) => set('material', e.target.value)}>{MATERIALS.map((m) => <option key={m}>{m}</option>)}</select>
            </div>
            <div className="field"><label>Rang</label>
              <select value={form.color} onChange={(e) => set('color', e.target.value)}>{COLORS.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            <div className="field"><label>Uslub</label>
              <select value={form.style} onChange={(e) => set('style', e.target.value)}>{STYLES.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
          </div>
          <div className="field"><label>Byudjet (so'm)</label><input type="number" min={0} value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="12 500 000" /></div>
          <div className="field"><label>Qo'shimcha talablar</label>
            <textarea rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Masalan: yumshoq yopiluvchi eshiklar, ichki yoritgich..." />
          </div>
          <button className="btn btn-primary" type="submit" disabled={generating} style={{ width: '100%' }}>
            {generating ? '⏳ Dizayn yaratilmoqda...' : '✨ AI dizayn yaratish'}
          </button>
        </form>

        <div>
          {result ? (
            <div className="card">
              <h3>Natija</h3>
              <div className="result-visual">
                <img src="/furniture/wardrobe.svg" alt="Dizayn konsepsiyasi" />
                <p style={{ fontWeight: 600 }}>{result.resultConcept}</p>
                <p className="small muted">Demo konsepsiya tasviri</p>
              </div>
              <p className="small muted">Dizayn saqlandi ✓ Ustaga buyurtma berishda ushbu parametrlarni ishlatishingiz mumkin.</p>
            </div>
          ) : (
            <Empty icon="🎨" text="Parametrlarni tanlab «AI dizayn yaratish» tugmasini bosing." />
          )}

          <div className="section-head"><h2>Saqlangan dizaynlar</h2></div>
          {designs.length === 0 ? (
            <Empty icon="📁" text="Hali saqlangan dizaynlar yo'q" />
          ) : (
            <div className="grid" key={saved}>
              {designs.map((d) => (
                <div className="card" key={d.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <strong>{d.furnitureType} — {d.room}</strong>
                    <button className="btn btn-danger btn-sm" onClick={() => { deleteDesign(d.id); setSaved((n) => n + 1); }}>O'chirish</button>
                  </div>
                  <div className="small muted">{d.material} · {d.color} · {d.style} · {formatDate(d.createdAt)}</div>
                  {d.resultConcept && <p className="small">{d.resultConcept}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
