'use client';

import { useEffect, useState } from 'react';

import { EquiplyListing, readListings, writeListings } from '@/lib/listing-store';

const seed = [['Cordless Drill Kit', 'Maruf', 'Approved'], ['DSLR Camera Bundle', 'Nadia', 'Pending'], ['Portable Generator', 'Samir', 'Pending']];

export default function AdminPage() { const [items, setItems] = useState<EquiplyListing[]>([]);
 useEffect(() => setItems(readListings()), []);
 function act(id: string, status: 'Approved' | 'Rejected') { const next = items.map(x => x.id === id ? { ...x, status } : x);
 setItems(next);
 writeListings(next);
 } return <main className="wrap section"><p className="eyebrow">Administration</p><h1 className="h2">Platform overview</h1><p className="muted">Demo admin panel. Newly submitted local listings appear below.</p><div className="grid3" style={{ margin: '28px 0' }}>{[['Demo users', '128'], ['Demo listings', String(42 + items.length)], ['Demo booking requests', '19']].map(([a, b]) => <div className="card stat" key={a}><p className="muted">{a}</p><h2>{b}</h2></div>)}</div><div className="card" style={{ padding: 20 }}><h3>Equipment review queue</h3>{items.length === 0 ? <p className="muted">No submissions from this browser yet.</p> : items.map(item => <div className="rentrow" key={item.id}><strong>{item.name}</strong><span>{item.owner} · {item.category}</span><span className={item.status === 'Approved' ? 'status' : 'status pendingstatus'}>{item.status}</span><div className="adminbuttons">{item.status === 'Pending review' ? <><button className="btn-outline" onClick={() => act(item.id, 'Approved')}>Approve</button><button className="btn-outline" onClick={() => act(item.id, 'Rejected')}>Reject</button></> : <span className="muted">Reviewed</span>}</div></div>)}{seed.map(([name, owner, status]) => <div className="rentrow" key={name}><strong>{name}</strong><span>{owner}</span><span className="status">{status}</span><span className="muted">Demo record</span></div>)}<p className="muted" style={{ marginTop: 16, fontSize: 13 }}>Approval changes are stored locally in this browser. Real role-protected moderation will be implemented with the backend.</p></div></main>;
 }
