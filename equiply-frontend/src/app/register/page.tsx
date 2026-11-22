'use client';

import Link from 'next/link';

import { useState } from 'react';

export default function Register() { const [message, setMessage] = useState('');
 return <div className="wrap section authwrap"><div className="authside"><p className="eyebrow">Join the marketplace</p><h1 className="h2">Rent what you need.<br />Share what you own.</h1><p>One account to discover equipment or start earning from your own gear.</p><div className="authpill">✓ Create a free account</div></div><div className="card authcard"><p className="eyebrow">Get started</p><h2 className="h2">Create account</h2><p className="muted">Fill in your details to join Equiply.</p><form onSubmit={e => { e.preventDefault();
 setMessage('Registration is not connected yet. Your form is ready for the authentication phase.');
 }} className="authform"><label>Full name<input required placeholder="Your name" autoComplete="name"/></label><label>Email address<input type="email" required placeholder="you@example.com" autoComplete="email"/></label><label>Password<input type="password" required minLength={6} placeholder="At least 6 characters" autoComplete="new-password"/></label><label>Account type<select defaultValue="customer"><option value="customer">I want to rent equipment</option><option value="owner">I want to list equipment</option></select></label><button className="btn" type="submit">Create account</button><button className="btn-outline" type="button" onClick={() => setMessage('Google sign-up will be connected in the authentication phase.')}>Sign up with Google</button>{message && <p className="notice" role="status">{message}</p>}</form><p className="authfoot">Already have an account? <Link href="/login">Sign in</Link></p></div></div>;
 }
