'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

interface Fav {
    id: string;

    name: string;

    image?: string;

    category?: string;

    price?: number;

}

export default function Favorites() { const [items, setItems] = useState<Fav[]>([]);
 useEffect(() => { try {
    setItems(JSON.parse(localStorage.getItem('equiply-favorites') || '[]'));

}
catch { } }, []);
 return <div className="wrap section"><div className="eyebrow">Saved listings</div><h1 className="h2">Your favorites</h1>{!items.length ? <div className="card" style={{ padding: 30, marginTop: 25 }}><p>No favorites saved yet.</p><Link className="btn" href="/equipment">Explore equipment</Link></div> : <div className="grid3" style={{ marginTop: 25 }}>{items.map(i => <article className="card" key={i.id}><img src={i.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80'} alt={i.name} style={{ width: '100%', height: 220, objectFit: 'cover' }}/><div style={{ padding: 20 }}><div className="eyebrow">{i.category}</div><h3>{i.name}</h3><b>${i.price || 0}</b><button className="btn-outline" style={{ marginTop: 12 }} onClick={() => { const next = items.filter(x => x.id !== i.id);
 setItems(next);
 localStorage.setItem('equiply-favorites', JSON.stringify(next));
 }}>Remove</button></div></article>)}</div>}</div>;
 }
