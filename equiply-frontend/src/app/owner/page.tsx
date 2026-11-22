'use client';

import Link from 'next/link';

const items = [{ name: 'Cordless Drill Kit', category: 'Construction', status: 'Approved', rentals: 8, earnings: 240 }, { name: 'DSLR Camera Bundle', category: 'Photography', status: 'Pending review', rentals: 3, earnings: 150 }, { name: 'Camping Tent', category: 'Outdoor', status: 'Approved', rentals: 5, earnings: 110 }];

export default function OwnerPage() { return <main className="wrap section"><p className="eyebrow">Owner workspace</p><h1 className="h2">Manage your equipment</h1><p className="muted">Manage listings, track rentals and review your demo earnings.</p><div className="grid3" style={{ margin: '28px 0' }}>{[['Listings', '3'], ['Rental requests', '4'], ['Demo earnings', '$500']].map(([a, b]) => <div className="card stat" key={a}><p className="muted">{a}</p><h2>{b}</h2></div>)}</div><Link className="btn" href="/add-equipment">+ Add equipment</Link><div className="card" style={{ padding: 20, marginTop: 25 }}><h3>Your listings</h3>{items.map(i => <div className="rentrow" key={i.name}><div><strong>{i.name}</strong><small className="muted" style={{ display: 'block' }}>{i.category}</small></div><span className="status">{i.status}</span><span>{i.rentals} rentals</span><strong>${i.earnings}</strong></div>)}</div></main>;
 }
