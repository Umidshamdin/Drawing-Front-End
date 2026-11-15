import type { ArtworkCard, Category, HomeData, Slide } from '../lib/types';

export const demoCategories: Category[] = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'Yağlı boya', slug: 'yagli-boya', displayOrder: 1 },
  { id: '10000000-0000-0000-0000-000000000002', name: 'Akvarel', slug: 'akvarel', displayOrder: 2 },
  { id: '10000000-0000-0000-0000-000000000003', name: 'Abstrakt sənət', slug: 'abstrakt', displayOrder: 3 },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Mənzərə', slug: 'menzere', displayOrder: 4 }
];
export const demoArtworks: ArtworkCard[] = [
  ['Sükutun rəngləri', 480, 'Aylin Məmmədova', 'art-1.svg'],
  ['Bakı səhəri', 720, 'Murad Əliyev', 'art-2.svg'],
  ['Səmanın yaddaşı', 350, 'Nigar Hüseynli', 'art-3.svg'],
  ['Payızın nəfəsi', 590, 'Leyla Rzayeva', 'art-4.svg'],
  ['Üfüqlər', 840, 'Fərid Qasımov', 'art-5.svg'],
  ['İçimdəki bahar', 425, 'Sevinc Abbasova', 'art-6.svg'],
  ['Küləkli sahil', 640, 'Elvin Hacıyev', 'art-7.svg'],
  ['İşığın izi', 310, 'Günel Səfərova', 'art-8.svg']
].map(([title, price, artistName, file], i) => ({ id: `20000000-0000-0000-0000-00000000000${i + 1}`, title: String(title), price: Number(price), artistName: String(artistName), city: 'Bakı', saleStatus: 'Available', mainImageUrl: `/artworks/${file}`, publishedAt: new Date(2026, 10, i + 1).toISOString() }));
export const demoSlides: Slide[] = [
  { id: 's1', title: 'Hər əsərin bir hekayəsi var.', subtitle: 'Yerli rəssamların yaratdığı orijinal əsərləri kəşf edin və sənətə öz məkanınızda yer açın.', imageUrl: '/artworks/art-hero.svg', buttonText: 'Qalereyanı kəşf et', linkUrl: '/artworks' },
  { id: 's2', title: 'Evinizin ruhunu dəyişən sənət.', subtitle: 'Hisslərinizi ifadə edən əsəri Azərbaycan rəssamlarının kolleksiyasından tapın.', imageUrl: '/artworks/art-6.svg', buttonText: 'Əsərlərə bax', linkUrl: '/artworks' }
];
export const demoHome: HomeData = { slides: demoSlides, categories: demoCategories.map((category, i) => ({ category, artworks: [...demoArtworks.slice(i * 2), ...demoArtworks.slice(0, i * 2)].slice(0, 6) })), featuredArtworks: demoArtworks.slice(0, 4) };
