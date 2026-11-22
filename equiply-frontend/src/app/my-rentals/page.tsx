'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

type Booking = {
    id: string;

    name: string;

    image: string;

    start: string;

    end: string;

    days: number;

    total: number;

    status: string;

    createdAt: string;

};

function fmt(d: string) { return new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
 }

export default function MyRentals() { const [tab, setTab] = useState('All');
 const [rentals, setRentals] = useState<Booking[]>([]);
 useEffect(() => { try {
    setRentals(JSON.parse(localStorage.getItem('equiply-bookings') || '[]'));

}
catch {
    setRentals([]);

} }, []);
 const filtered = rentals.filter(r => tab === 'All' || (tab === 'Upcoming' && r.status !== 'Completed') || (tab === 'Completed' && r.status === 'Completed'));
 return <main className="wrap section"><p className="eyebrow">Customer workspace</p><h1 className="h2">My rentals</h1><p className="muted">Review upcoming rentals and keep track of your booking requests.</p><div className="tabs">{['All', 'Upcoming', 'Completed'].map(t => <button className={tab === t ? 'tabactive' : 'tab'} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>{!filtered.length ? <div className="card" style={{ padding: 24, marginTop: 18 }}><h3>No {tab === 'All' ? 'rental requests' : tab.toLowerCase() + ' rentals'} yet</h3><p className="muted" style={{ margin: '12px 0' }}>Browse equipment and try the demo booking flow.</p><Link href="/equipment" className="btn">Explore equipment</Link></div> : <div className="card" style={{ padding: 20, marginTop: 18 }}><div className="rentrow renthead"><span>Equipment</span><span>Rental dates</span><span>Status</span><span>Total</span></div>{filtered.map(r => <div className="rentrow" key={r.id}><strong>{r.name}</strong><span>{fmt(r.start)} – {fmt(r.end)}</span><span className="status pendingstatus">{r.status}</span><strong>${r.total}</strong></div>)}</div>}<p className="muted" style={{ marginTop: 16, fontSize: 13 }}>Requests are stored locally in this browser for the frontend demo. They are not sent to an owner or backend.</p></main>;
 }
