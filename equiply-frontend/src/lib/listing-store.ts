export type EquiplyListing = {
    id: string;

    name: string;

    category: string;

    description: string;

    image: string;

    price: number;

    unit: string;

    location: string;

    quantity: number;

    status: 'Pending review' | 'Approved' | 'Rejected';

    owner: string;

    createdAt: string;

};

export const LISTING_KEY = 'equiply-listings-v1';

export function readListings(): EquiplyListing[] { if (typeof window === 'undefined')
    return [];
 try {
    return JSON.parse(localStorage.getItem(LISTING_KEY) || '[]');

}
catch {
    return [];

} }

export function writeListings(items: EquiplyListing[]) { localStorage.setItem(LISTING_KEY, JSON.stringify(items));
 }
