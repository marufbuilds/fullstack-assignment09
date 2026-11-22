'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

import { demoEquipment } from '@/lib/demo-equipment';

const categories = ['All', 'Construction', 'Photography', 'Vehicles & Transportation', 'Agriculture', 'Electronics', 'Event Equipment'];

export default function EquipmentPage() { const [q, setQ] = useState('');
 const [category, setCategory] = useState('All');
 const [sort, setSort] = useState('recent');
 const [maxPrice, setMaxPrice] = useState('');
 const [place, setPlace] = useState('');
 const items = useMemo(() => demoEquipment.filter(x => (category === 'All' || x.category === category) && (!q || `${x.name} ${x.category} ${x.location}`.toLowerCase().includes(q.toLowerCase())) && (!place || x.location.toLowerCase().includes(place.toLowerCase())) && (!maxPrice || x.price <= Number(maxPrice))).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : 0), [q, category, sort, maxPrice, place]);
 return <div className="wrap section"><div className="eyebrow">Marketplace</div><h1 className="h2">Find equipment for your next project</h1><p className="muted">Search, compare and explore demo listings. Live listings will be connected in the backend phase.</p><div className="card" style={{ padding: 20, margin: '28px 0' }}><div className="filterbar"><label className="searchbox"><Search size={18}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search equipment, category…"/></label><label className="searchbox"><MapPin size={18}/><input value={place} onChange={e => setPlace(e.target.value)} placeholder="Location"/></label><select className="filterselect" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select><select className="filterselect" value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}><SlidersHorizontal size={16}/><label style={{ fontWeight: 600 }}>Maximum daily price:</label><input className="priceinput" type="number" min="0" placeholder="Any" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/><button className="btn-outline" onClick={() => { setQ('');
 setCategory('All');
 setSort('recent');
 setMaxPrice('');
 setPlace('');
 }}>Clear filters</button></div></div><p className="muted" style={{ marginBottom: 20 }}>{items.length} equipment listings</p>{items.length === 0 ? <div className="card" style={{ padding: 30 }}>No equipment matches those filters. Try changing your search.</div> : <div className="grid3">{items.map(i => <Link href={`/equipment/${i._id}`} className="card listing" key={i._id}><img src={i.image} alt={i.name}/><div className="listingbody"><span className="eyebrow">{i.category}</span><h3>{i.name}</h3><p className="muted">{i.location} · {i.quantity} available</p><div className="listprice"><b>${i.price}<small> / {i.rentalType.toLowerCase()}</small></b><span className="rating">★ {i.rating} ({i.reviews})</span></div></div></Link>)}</div>}</div>;
 }
