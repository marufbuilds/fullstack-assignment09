'use client';

import { useState } from 'react';

export default function Profile() { const [saved, setSaved] = useState(false);
 return <main className="wrap section" style={{ maxWidth: 760 }}><p className="eyebrow">Account settings</p><h1 className="h2">My profile</h1><p className="muted">Preview your profile settings. Updates are local UI only at this stage.</p><form className="card profileform" onSubmit={e => { e.preventDefault();
 setSaved(true);
 }}><div className="avatar">E</div><label>Full name<input defaultValue="Equiply Member"/></label><label>Email address<input type="email" defaultValue="member@example.com"/></label><label>Phone number<input type="tel" placeholder="Add phone number"/></label><label>Location<input placeholder="City, country"/></label><label>About me<textarea rows={3} placeholder="Tell equipment owners or renters a little about yourself."/></label><button className="btn" type="submit">Save changes</button>{saved && <p className="notice">Changes saved in this UI preview (not to a server).</p>}</form></main>;
 }
