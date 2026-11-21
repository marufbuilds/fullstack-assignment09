import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
export const metadata: Metadata = { title: 'Equiply | Equipment, when you need it', description: 'A practical marketplace for renting equipment.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Navbar/><main>{children}</main><footer className="wrap" style={{padding:'35px 0',borderTop:'1px solid #dce3dd',display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}><b>Equiply</b><span className="muted">Rent smarter. Build more.</span><span className="muted">© 2026 Equiply</span></footer></body></html> }
