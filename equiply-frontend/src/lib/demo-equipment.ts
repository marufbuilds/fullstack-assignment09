export type EquipmentItem = {
    _id: string;

    name: string;

    category: string;

    location: string;

    price: number;

    rentalType: string;

    quantity: number;

    image: string;

    description: string;

    owner: string;

    rating: number;

    reviews: number;

};

export const demoEquipment: EquipmentItem[] = [
    { _id: 'demo-excavator', name: 'Compact Excavator', category: 'Construction', location: 'Rajshahi', price: 180, rentalType: 'Day', quantity: 2, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85', description: 'Compact excavator suitable for landscaping, digging and small construction projects. Flexible daily rental.', owner: 'Rahman Equipment', rating: 4.8, reviews: 18 },
    { _id: 'demo-camera', name: 'Professional Camera Kit', category: 'Photography', location: 'Dhaka', price: 65, rentalType: 'Day', quantity: 1, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85', description: 'A versatile camera kit for events, portraits and commercial shoots. Includes a camera body and basic accessories.', owner: 'Lens House', rating: 4.9, reviews: 24 },
    { _id: 'demo-trailer', name: 'Utility Trailer', category: 'Vehicles & Transportation', location: 'Pabna', price: 45, rentalType: 'Day', quantity: 3, image: 'https://images.unsplash.com/photo-1592833159157-2c6a3f7a8c8?auto=format&fit=crop&w=1000&q=85', description: 'Utility trailer for moving tools, materials and supplies. Check towing compatibility before renting.', owner: 'Local Rentals', rating: 4.6, reviews: 11 },
    { _id: 'demo-generator', name: 'Portable Generator 7kW', category: 'Electronics', location: 'Chattogram', price: 55, rentalType: 'Day', quantity: 2, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5acb9?auto=format&fit=crop&w=1000&q=85', description: 'Portable generator for backup power at worksites and events. Please review fuel and operating requirements.', owner: 'Power & Tools', rating: 4.7, reviews: 15 },
    { _id: 'demo-lift', name: 'Scissor Lift', category: 'Construction', location: 'Dhaka', price: 220, rentalType: 'Day', quantity: 1, image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1000&q=85', description: 'Elevated work platform for indoor maintenance and construction. Operator safety requirements apply.', owner: 'Rahman Equipment', rating: 4.5, reviews: 9 },
    { _id: 'demo-tent', name: 'Event Tent (20×30)', category: 'Event Equipment', location: 'Rajshahi', price: 80, rentalType: 'Day', quantity: 4, image: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85', description: 'Spacious event tent for outdoor gatherings, ceremonies and community events.', owner: 'Celebration Rentals', rating: 4.8, reviews: 21 },
    { _id: 'demo-drone', name: 'Agricultural Drone', category: 'Agriculture', location: 'Bogura', price: 150, rentalType: 'Day', quantity: 1, image: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=1000&q=85', description: 'Drone for agricultural field surveying. Availability and permitted use should be confirmed with the owner.', owner: 'AgriTech Rentals', rating: 4.4, reviews: 7 },
    { _id: 'demo-sound', name: 'PA Sound System', category: 'Event Equipment', location: 'Dhaka', price: 90, rentalType: 'Day', quantity: 2, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=85', description: 'Sound system for meetings, parties and small outdoor events.', owner: 'Celebration Rentals', rating: 4.7, reviews: 13 },
];
