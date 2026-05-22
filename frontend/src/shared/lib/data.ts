export const categories = [
  { id: "keramogranit", name: "Керамогранит", count: 10, image: "/images/categories/keramogranit.jpg" },
  { id: "ceramic-tile", name: "Керамическая плитка", count: 10, image: "/images/categories/ceramic-tile.jpg" },
  { id: "large-formats", name: "Крупные форматы", count: 10, image: "/images/categories/large-formats.jpg" },
  { id: "wallpaper", name: "Обои", count: 10, image: "/images/categories/wallpaper.jpg" },
  { id: "baguette", name: "Багет", count: 10, image: "/images/categories/baguette.jpg" },
  { id: "dry-mixes", name: "Сухие смеси", count: 10, image: "/images/categories/dry-mixes.jpg" },
  { id: "paint", name: "Лакокрасочные изделия", count: 10, image: "/images/categories/paint.jpg" },
];

export const brands = [
  { id: "cezares", name: "Cezares", logo: "/images/brands/cezares.svg" },
  { id: "italon", name: "Italon", logo: "/images/brands/italon.svg" },
  { id: "keramin", name: "Keramin", logo: "/images/brands/keramin.svg" },
  { id: "grasaro", name: "Grasaro", logo: "/images/brands/grasaro.svg" },
];

export const advantages = [
  {
    title: "Премиальное качество",
    description: "Только сертифицированная продукция от ведущих мировых производителей",
    icon: "shield",
  },
  {
    title: "Профессиональный подбор",
    description: "Поможем выбрать идеальное решение для вашего проекта",
    icon: "stars",
  },
  {
    title: "Быстрая доставка",
    description: "Доставка по Иркутску и области в течение 24 часов",
    icon: "truck",
  },
  {
    title: "3D-визуализация",
    description: "Бесплатный 3D-проект вашего интерьера с нашей плиткой",
    icon: "cube",
  },
];

export const projects = [
  {
    id: 1,
    title: "Квартира в ЖК «Панорама»",
    description: "Современный интерьер с использованием крупноформатного керамогранита Grasaro Marmo Classico 120×278 см.",
    image: "/images/projects/project-1.jpg",
    area: "78 м²",
    products: ["Grasaro Marmo", "Italon Prestige"],
  },
  {
    id: 2,
    title: "Загородный дом в стиле лофт",
    description: "Сочетание керамогранита под бетон и натурального дерева. Общая площадь отделки — 156 м².",
    image: "/images/projects/project-2.jpg",
    area: "156 м²",
    products: ["Italon Prestige", "Italon Wood"],
  },
  {
    id: 3,
    title: "Ванная комната премиум-класса",
    description: "Эксклюзивный дизайн с использованием керамической плитки Keramin Impression и мраморного керамогранита.",
    image: "/images/projects/project-3.jpg",
    area: "12 м²",
    products: ["Keramin Impression", "Cezares Marble Lux"],
  },
  {
    id: 4,
    title: "Торговый центр «Сибирь»",
    description: "Коммерческий проект. Укладка керамогранита Cezares Stone Collection общей площадью 1200 м².",
    image: "/images/projects/project-4.jpg",
    area: "1200 м²",
    products: ["Cezares Stone"],
  },
];

export const reviews = [
  {
    id: 1,
    name: "Анна Петрова",
    city: "Иркутск",
    text: "Очень довольна ремонтом! Плитка превзошла все ожидания. Отдельное спасибо дизайнеру за 3D-проект — сразу было понятно, как будет выглядеть готовая работа.",
    rating: 5,
    date: "2025-12-15",
  },
  {
    id: 2,
    name: "Сергей Иванов",
    city: "Ангарск",
    text: "Заказывал керамогранит для пола в коридоре. Консультанты помогли с выбором, всё быстро доставили. Качество отличное, уже полгода — никаких нареканий.",
    rating: 5,
    date: "2025-11-20",
  },
  {
    id: 3,
    name: "Елена Соколова",
    city: "Иркутск",
    text: "Прекрасный магазин с большим выбором. Цены выше среднего, но качество соответствующее. Понравилось, что делают замеры и резку прямо в магазине.",
    rating: 4,
    date: "2025-10-05",
  },
  {
    id: 4,
    name: "Дмитрий Козлов",
    city: "Шелехов",
    text: "Хороший выбор плитки, приветливый персонал. Заказывал плитку для кухни и ванной. Всё подобрали, рассчитали количество. Рекомендую!",
    rating: 5,
    date: "2025-09-18",
  },
];

const API = 'http://localhost:3001/api';

export async function fetchProducts(query?: string): Promise<any[]> {
  const res = await fetch(`${API}/products${query ? '?' + query : ''}`, { cache: 'no-store' });
  return res.json();
}

export async function fetchProduct(id: number): Promise<any | null> {
  const res = await fetch(`${API}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const res = await fetch(`${API}/products`, { cache: 'no-store' });
  const products: any[] = await res.json();
  const counts: Record<string, number> = {};
  for (const p of products) {
    const cat = p.category;
    if (cat) counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}
