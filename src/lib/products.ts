export interface CoffeeProduct {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tasteNotes: string[];
  roastLevel?: string;
  purpose?: string;
  packageSize: string;
  price: number;
  priceFormatted: string;
  image: string;
  badge?: string;
  isSubscription?: boolean;
}

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: 'ethiopia',
    name: 'Эфиопия Иргачеффе',
    shortName: 'Эфиопия Иргачеффе',
    category: 'Моносорт свежей обжарки',
    tasteNotes: ['цветочный аромат', 'бергамот'],
    roastLevel: 'светлая',
    packageSize: '250 г',
    price: 32,
    priceFormatted: '32 BYN',
    image: '/images/product_ethiopia.jpg',
    badge: 'Светлая обжарка',
  },
  {
    id: 'colombia',
    name: 'Колумбия Уила',
    shortName: 'Колумбия Уила',
    category: 'Моносорт свежей обжарки',
    tasteNotes: ['карамель', 'красное яблоко'],
    packageSize: '250 г',
    price: 29,
    priceFormatted: '29 BYN',
    image: '/images/product_colombia.jpg',
    badge: 'Яркий баланс',
  },
  {
    id: 'brazil',
    name: 'Бразилия Серрадо',
    shortName: 'Бразилия Серрадо',
    category: 'Моносорт свежей обжарки',
    tasteNotes: ['орех', 'шоколад'],
    purpose: 'под эспрессо',
    packageSize: '250 г',
    price: 26,
    priceFormatted: '26 BYN',
    image: '/images/product_brazil.jpg',
    badge: 'Под эспрессо',
  },
  {
    id: 'drips',
    name: 'Дрип-пакеты, ассорти',
    shortName: 'Дрип-пакеты, ассорти',
    category: 'Кофе без кофеварки',
    tasteNotes: ['ассорти сортов в фильтр-пакетах'],
    packageSize: '10 штук',
    price: 18,
    priceFormatted: '18 BYN',
    image: '/images/product_drips.jpg',
    badge: 'Удобно в дороге и офисе',
  },
  {
    id: 'subscription',
    name: 'Кофейная подписка',
    shortName: 'Подписка «Кварта»',
    category: 'Регулярная доставка',
    tasteNotes: ['2 свежие пачки по 250 г раз в месяц', 'бесплатная доставка'],
    packageSize: '2 пачки по 250 г',
    price: 54,
    priceFormatted: '54 BYN в месяц',
    image: '/images/product_subscription.jpg',
    badge: 'Бесплатная доставка',
    isSubscription: true,
  },
];

export interface OrderCalculation {
  totalCount: number;
  totalPrice: number;
  selectedItems: {
    product: CoffeeProduct;
    quantity: number;
    subtotal: number;
  }[];
  summaryText: string;
  isFreeDelivery: boolean;
}

export function calculateOrderSummary(quantities: Record<string, number>): OrderCalculation {
  const selectedItems = COFFEE_PRODUCTS.map((product) => {
    const qty = quantities[product.id] || 0;
    return {
      product,
      quantity: qty,
      subtotal: qty * product.price,
    };
  }).filter((item) => item.quantity > 0);

  const totalCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const hasSubscription = (quantities['subscription'] || 0) > 0;
  const isFreeDelivery = totalPrice >= 50 || hasSubscription;

  const summaryText =
    selectedItems.length > 0
      ? selectedItems
          .map((item) => `${item.product.name} (${item.product.packageSize}) × ${item.quantity}`)
          .join(', ') + ` — Итого: ${totalPrice} BYN`
      : '';

  return {
    totalCount,
    totalPrice,
    selectedItems,
    summaryText,
    isFreeDelivery,
  };
}
