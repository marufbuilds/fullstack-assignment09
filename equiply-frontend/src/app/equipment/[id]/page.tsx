'use client';

import Link from 'next/link';

import { useParams } from 'next/navigation';

import { useMemo, useState } from 'react';

import { Heart, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';

import { demoEquipment } from '@/lib/demo-equipment';

export default function EquipmentDetails() { const params = useParams<{
    id: string;

}>();
 const item = useMemo(() => demoEquipment.find(x => x._id === params.id), [params.id]);
 const [start, setStart] = useState('');
 const [end, setEnd] = useState('');
 const [saved, setSaved] = useState(false);
 const [message, setMessage] = useState('');
 const [booked, setBooked] = useState(false);
 const today = new Date().toISOString().slice(0, 10);
 const days = start && end ? Math.max(0, Math.ceil((new Date(end + 'T00:00:00').getTime() - new Date(start + 'T00:00:00').getTime()) / 86400000)) : 0;
 const total = days * (item?.price || 0);
 if (!item)
    return <div className="wrap section"><h1>Listing not found</h1><Link className="btn" href="/equipment">Browse equipment</Link></div>;
 function save() { try {
    const fav = JSON.parse(localStorage.getItem('equiply-favorites') || '[]');

    const exists = fav.some((x: any) => x.id === item!._id);

    const next = exists ? fav.filter((x: any) => x.id !== item!._id) : [...fav, { id: item!._id, name: item!.name, image: item!.image, category: item!.category, price: item!.price }];

    localStorage.setItem('equiply-favorites', JSON.stringify(next));

    setSaved(!exists);

    setMessage(exists ? 'Removed from favorites' : 'Saved to favorites');

}
catch {
    setMessage('Unable to save favorites in this browser');

} } function requestBooking() { if (!start || !end) {
    setMessage('Please select both rental dates.');

    return;

} if (start < today) {
    setMessage('The start date cannot be in the past.');

    return;

} if (end <= start) {
    setMessage('The end date must be after the start date.');

    return;

} try {
    const bookings = JSON.parse(localStorage.getItem('equiply-bookings') || '[]');

    const booking = { id: `booking-${Date.now()}`, equipmentId: item!._id, name: item!.name, image: item!.image, owner: item!.owner, start, end, days, total, status: 'Requested', createdAt: new Date().toISOString() };

    localStorage.setItem('equiply-bookings', JSON.stringify([booking, ...bookings]));

    setBooked(true);

    setMessage('Your demo booking request was saved in this browser.');

}
catch {
    setMessage('Could not save this request in your browser.');

} } return <div className="wrap section"><Link href="/equipment" className="muted">← Back to marketplace</Link><div className="detailsgrid" style={{ marginTop: 24 }}><div><img className="detailsimage" src={item.image} alt={item.name}/><div className="card" style={{ padding: 24, marginTop: 22 }}><h2 style={{ fontSize: 22, fontWeight: 800 }}>About this equipment</h2><p style={{ lineHeight: 1.8, marginTop: 12 }}>{item.description}</p><div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 18 }}><ShieldCheck color="#236b51"/><span className="muted">Demo listing · final availability will be confirmed by the server</span></div></div></div><aside><div className="eyebrow">{item.category}</div><h1 className="h2" style={{ marginTop: 8 }}>{item.name}</h1><p className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}><MapPin size={17}/>{item.location}</p><div style={{ margin: '20px 0' }}><span className="rating">★ {item.rating} · {item.reviews} reviews</span></div><h2 style={{ fontSize: 32, fontWeight: 900 }}>${item.price}<small className="muted" style={{ fontSize: 16, fontWeight: 500 }}> / {item.rentalType.toLowerCase()}</small></h2><div className="card" style={{ padding: 22, marginTop: 24 }}><h3 style={{ fontWeight: 800, fontSize: 18 }}>Request a rental</h3><label style={{ display: 'block', marginTop: 16 }}>Start date<input className="forminput" type="date" min={today} value={start} onChange={e => { setStart(e.target.value);
 setBooked(false);
 }}/></label><label style={{ display: 'block', marginTop: 14 }}>End date<input className="forminput" type="date" min={start || today} value={end} onChange={e => { setEnd(e.target.value);
 setBooked(false);
 }}/></label>{days > 0 && <div style={{ marginTop: 16, padding: 14, background: 'var(--surface, #f5f7f6)', borderRadius: 12 }}><div className="muted">{days} day(s) × ${item.price}</div><strong style={{ fontSize: 22 }}>Estimated total: ${total}</strong></div>}<button className="btn" disabled={booked} style={{ width: '100%', marginTop: 18, opacity: booked ? .6 : 1 }} onClick={requestBooking}><CalendarDays size={18}/> {booked ? 'Request saved' : 'Request booking'}</button><button className="btn-outline" style={{ width: '100%', marginTop: 12 }} onClick={save}><Heart size={18}/> Save to favorites</button>{message && <p role="status" className="muted" style={{ marginTop: 12 }}>{message}</p>}<p className="muted" style={{ fontSize: 13, marginTop: 16 }}>This is a browser demo only. No payment or owner notification occurs.</p>{booked && <Link className="btn-outline" style={{ display: 'inline-flex', marginTop: 12 }} href="/my-rentals">View my rentals</Link>}</div><div style={{ marginTop: 24 }}><div className="muted">Listed by</div><b>{item.owner}</b><p className="muted">{item.quantity} item(s) shown available</p></div></aside></div></div>;
 }
