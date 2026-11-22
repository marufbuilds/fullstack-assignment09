const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function api<T>(path: string, options: RequestInit = {}) { const res = await fetch(`${BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, cache: 'no-store' });
 if (!res.ok) {
    const data = await res.json().catch(() => ({ message: 'Request failed' }));

    throw new Error(data.message || `HTTP ${res.status}`);

} return res.json() as Promise<T>;
 }
