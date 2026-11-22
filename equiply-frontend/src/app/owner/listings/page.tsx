'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

import { EquiplyListing, readListings, writeListings } from '@/lib/listing-store';

type Demo = {
    name: string;

    cat: string;

    status: string;

    price: number;

};

const seed: Demo[] = [{ name: 'Cordless Drill Kit', cat: 'Construction', status: 'Approved', price: 30 }, { name: 'DSLR Camera Bundle', cat: 'Photography', status: 'Pending review', price: 45 }, { name: 'Portable Generator', cat: 'Electronics', status: 'Approved', price: 55 }];

export default function OwnerListings() { const [items, setItems] = useState<EquiplyListing[]>([]);
 const [legacy, setLegacy] = useState<Demo[]>(seed);
 useEffect(() => { setItems(readListings());
 }, []);
 function remove(id: string) { const next = items.filter(x => x.id !== id);
 setItems(next);
 writeListings(next);
 } return <main className="wrap section"><p className="eyebrow">Owner workspace</p><h1 className="h2">My equipment listings</h1><p className="muted">Review the status of your equipment and manage your listings.</p><div style={{ margin: '25px 0' }}><Link href="/add-equipment" className="btn">+ Add equipment</Link></div><div className="card listingtable">{items.length === 0 ? <p className="muted">No listings created in this browser yet. Start with Add equipment.</p> : <><div className="listinghead"><span>Equipment</span><span>Category</span><span>Price</span><span>Status</span><span>Action</span></div>{items.map(i => <div className="listingrow" key={i.id}><strong>{i.name}</strong><span>{i.category}</span><span>${i.price}/{i.unit}</span><span className={i.status === 'Approved' ? 'status' : 'status pendingstatus'}>{i.status}</span><button className="btn-outline" onClick={() => remove(i.id)}>Remove</button></div>)}</>}</div><div className="card listingtable" style={{ marginTop: 20 }}><p className="eyebrow">Sample data</p>{legacy.map(i => <div className="listingrow" key={i.name}><strong>{i.name}</strong><span>{i.cat}</span><span>${i.price}/day</span><span className={i.status === 'Approved' ? 'status' : 'status pendingstatus'}>{i.status}</span><span className="muted">Sample</span></div>)}</div><p className="muted" style={{ marginTop: 15 }}>Local demo listing data persists in this browser only. Server-side listing management will be implemented later.</p></main>;
 }
