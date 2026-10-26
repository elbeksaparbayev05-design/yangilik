import type { CatalogItem, MakerService, PortfolioItem, User } from '../types';

export const seedMakers: User[] = [
  {
    id: 'maker-1',
    name: 'Sardor Usta',
    email: 'sardor@mebelchi.uz',
    role: 'maker',
    avatarColor: '#1a7a4a',
    createdAt: '2025-09-01T10:00:00Z',
    specialization: 'Oshxona mebellari',
    experienceYears: 12,
    bio: 'Zamonaviy oshxona va shkaf mebellari bo\'yicha tajribali usta.',
    location: 'Toshkent',
    phone: '+998 90 123 45 67',
  },
  {
    id: 'maker-2',
    name: 'Jasur Mebel',
    email: 'jasur@mebelchi.uz',
    role: 'maker',
    avatarColor: '#8b5e34',
    createdAt: '2025-10-01T10:00:00Z',
    specialization: 'Yotoqxona mebellari',
    experienceYears: 8,
    bio: 'Yog\'ochdan klassik va zamonaviy yotoqxona garnituralari.',
    location: 'Samarqand',
    phone: '+998 91 234 56 78',
  },
  {
    id: 'maker-3',
    name: 'Mebel Art Studio',
    email: 'art@mebelchi.uz',
    role: 'maker',
    avatarColor: '#3a5a8c',
    createdAt: '2025-11-01T10:00:00Z',
    specialization: 'Ofis mebellari',
    experienceYears: 15,
    bio: 'Ofis va tijorat binolari uchun funksional mebel yechimlari.',
    location: 'Toshkent',
    phone: '+998 93 345 67 89',
  },
];

export const seedCatalog: CatalogItem[] = [
  { id: 'cat-1', name: 'Oshxona shkafi "Modern"', category: 'Oshxona', price: 12500000, material: 'MDF', style: 'Modern', image: '/furniture/kitchen.svg', makerId: 'maker-1', description: 'Modulli oshxona garnitura, yumshoq yopiluvchi eshiklar bilan.' },
  { id: 'cat-2', name: 'Yotoqxona shkafi "Klassik"', category: 'Yotoqxona', price: 9800000, material: 'Yog\'och', style: 'Klassik', image: '/furniture/wardrobe.svg', makerId: 'maker-2', description: 'Uch eshikli shkaf, tabiiy yog\'ochdan.' },
  { id: 'cat-3', name: 'Yozuv stoli "Minimal"', category: 'Ofis', price: 2400000, material: 'Laminat', style: 'Minimal', image: '/furniture/desk.svg', makerId: 'maker-3', description: 'Ixcham yozuv stoli, saqlash qutilari bilan.' },
  { id: 'cat-4', name: 'TV zona "Loft"', category: 'Mehmonxona', price: 5600000, material: 'MDF', style: 'Loft', image: '/furniture/tv.svg', makerId: 'maker-1', description: 'Devorga o\'rnatiladigan TV stend.' },
  { id: 'cat-5', name: 'Bolalar to\'shagi', category: 'Bolalar xonasi', price: 4200000, material: 'Yog\'och', style: 'Zamonaviy', image: '/furniture/bed.svg', makerId: 'maker-2', description: 'Xavfsiz va mustahkam bolalar to\'shagi.' },
  { id: 'cat-6', name: 'Kitob javoni', category: 'Mehmonxona', price: 1800000, material: 'Laminat', style: 'Minimal', image: '/furniture/shelf.svg', makerId: 'maker-3', description: 'Ochiq javonli kitob tokchasi.' },
];

export const seedPortfolio: PortfolioItem[] = [
  { id: 'pf-1', makerId: 'maker-1', title: 'Oshxona "Elita" loyihasi', description: 'Buyurtma asosida oq MDF oshxona garnitura.', image: '/furniture/kitchen.svg', category: 'Oshxona' },
  { id: 'pf-2', makerId: 'maker-1', title: 'Ofis uchun stellajlar', description: 'IT kompaniya ofisiga 12 ta stellaj.', image: '/furniture/shelf.svg', category: 'Ofis' },
  { id: 'pf-3', makerId: 'maker-2', title: 'Klassik yotoqxona', description: 'Yong\'oq yog\'ochidan to\'liq yotoqxona to\'plami.', image: '/furniture/bed.svg', category: 'Yotoqxona' },
  { id: 'pf-4', makerId: 'maker-3', title: 'Konferensiya xonasi', description: '20 o\'rinli uchrashuvlar xonasi mebellari.', image: '/furniture/desk.svg', category: 'Ofis' },
];

export const seedServices: MakerService[] = [
  { id: 'svc-1', makerId: 'maker-1', name: 'Oshxona mebeli yasash', description: 'O\'lchamga mos to\'liq oshxona garnitura.', priceFrom: 8000000, categories: ['Oshxona'] },
  { id: 'svc-2', makerId: 'maker-1', name: 'Shkaf-kupe yasash', description: 'Har qanday o\'lchamda shkaf-kupe.', priceFrom: 5000000, categories: ['Yotoqxona', 'Dahliz'] },
  { id: 'svc-3', makerId: 'maker-2', name: 'Yotoqxona garnitura', description: 'To\'shak, shkaf va tumba to\'plami.', priceFrom: 7000000, categories: ['Yotoqxona'] },
  { id: 'svc-4', makerId: 'maker-3', name: 'Ofis mebeli', description: 'Ish stollari, stellajlar, shkaf tizimlari.', priceFrom: 2000000, categories: ['Ofis'] },
];
