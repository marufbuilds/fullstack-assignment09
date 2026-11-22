'use client';

import Link from 'next/link';

import { useState } from 'react';

export default function Login() { const [show, setShow] = useState(false);
 const [message, setMessage] = useState('');
 return <div className="wrap section authwrap"><div className="authside"><p className="eyebrow">Your next project starts here</p><h1 className="h2">Get the gear.<br />Get it done.</h1><p>Find the equipment you need from people in your community.</p><div className="authpill">✓ Flexible rentals · Local owners · Simple booking</div></div><div className="card authcard"><p className="eyebrow">Welcome back</p><h2 className="h2">Sign in</h2><p className="muted">Sign in to manage your rentals and listings.</p><form onSubmit={e => { e.preventDefault();
 setMessage('Authentication is not connected yet. This form is ready for the auth integration phase.');
 }} className="authform"><label>Email address<input type="email" required placeholder="you@example.com" autoComplete="email"/></label><label>Password<div className="passwordfield"><input type={show ? 'text' : 'password'} required minLength={6} placeholder="Your password" autoComplete="current-password"/><button type="button" className="textbutton" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div></label><div className="authrow"><label className="checklabel"><input type="checkbox"/> Remember me</label><span className="muted">Forgot password?</span></div><button className="btn" type="submit">Sign in</button><button className="btn-outline" type="button" onClick={() => setMessage('Google sign-in will be connected in the authentication phase.')}>Continue with Google</button>{message && <p className="notice" role="status">{message}</p>}</form><p className="authfoot">New to Equiply? <Link href="/register">Create an account</Link></p></div></div>;
 }
