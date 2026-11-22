'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { readListings, writeListings, EquiplyListing } from '@/lib/listing-store';

const cats = ['Construction', 'Photography', 'Vehicles & Transportation', 'Agriculture', 'Electronics', 'Event Equipment'];

export default function AddEquipment() { const router = useRouter();
 const [error, setError] = useState('');
 const [preview, setPreview] = useState('');
 const [form, setForm] = useState({ name: '', category: '', description: '', image: '', price: '', unit: 'day', location: '', quantity: '1' });
 function change(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v }));
 if (k === 'image')
    setPreview(v);
 } function submit(e: React.FormEvent) { e.preventDefault();
 const price = Number(form.price), qty = Number(form.quantity);
 if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(qty) || qty < 1) {
    setError('Enter a positive price and a whole-number quantity.');

    return;

} const item: EquiplyListing = { ...form, id: crypto.randomUUID(), price, quantity: qty, status: 'Pending review', owner: 'Demo owner', createdAt: new Date().toISOString() };
 writeListings([...readListings(), item]);
 setError('');
 router.push('/owner/listings');
 } return <main className="wrap section" style={{ maxWidth: 1000 }}><p className="eyebrow">Owner workspace</p><h1 className="h2">List your equipment</h1><p className="muted">Fill in the details. Your listing will be saved in this browser and marked for review.</p><div className="grid2" style={{ alignItems: 'start', marginTop: 24 }}><form className="card" style={{ padding: 26, display: 'grid', gap: 16 }} onSubmit={submit}><label>Equipment name<input required maxLength={100} value={form.name} onChange={e => change('name', e.target.value)} placeholder="e.g. Compact excavator"/></label><label>Category<select required value={form.category} onChange={e => change('category', e.target.value)}><option value="">Select category</option>{cats.map(c => <option key={c}>{c}</option>)}</select></label><label>Description<textarea required minLength={20} maxLength={2000} rows={4} value={form.description} onChange={e => change('description', e.target.value)} placeholder="Describe condition, features and usage (at least 20 characters)..."/></label><label>Image URL<input type="url" value={form.image} onChange={e => change('image', e.target.value)} placeholder="https://..."/></label><div className="grid2"><label>Rental price<input type="number" min="1" step="0.01" required value={form.price} onChange={e => change('price', e.target.value)} placeholder="Price"/></label><label>Rental unit<select value={form.unit} onChange={e => change('unit', e.target.value)}><option value="day">Per day</option><option value="hour">Per hour</option><option value="week">Per week</option></select></label></div><label>Location<input required value={form.location} onChange={e => change('location', e.target.value)} placeholder="City or area"/></label><label>Available quantity<input type="number" min="1" step="1" required value={form.quantity} onChange={e => change('quantity', e.target.value)}/></label>{error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}<button className="btn" type="submit">Submit for review</button><Link href="/owner/listings" className="btn-outline" style={{ textAlign: 'center' }}>Cancel</Link></form><aside className="card" style={{ padding: 20 }}><p className="eyebrow">Listing preview</p>{preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12 }} onError={() => setPreview('')}/> : <div style={{ height: 220, borderRadius: 12, background: '#eef2ee', display: 'grid', placeItems: 'center', color: '#68766f' }}>Image preview</div>}<h3>{form.name || 'Equipment name'}</h3><p className="muted">{form.category || 'Category'} · {form.location || 'Location'}</p><p>{form.description || 'Your description will appear here.'}</p><strong>{form.price ? `$${form.price}` : 'Price'} / {form.unit}</strong><p className="muted" style={{ fontSize: 13, marginTop: 14 }}>Listings are pending review in this UI demo.</p></aside></div></main>;
 }
