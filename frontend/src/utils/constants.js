export const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'UtensilsCrossed' },
  { id: 'taco', name: 'Taco', icon: 'CircleDot' },
  { id: 'burrito', name: 'Burrito', icon: 'Wind' },
  { id: 'nachos', name: 'Nachos', icon: 'Flame' },
  { id: 'side', name: 'Side Food', icon: 'Salad' },
  { id: 'dessert', name: 'Dessert', icon: 'Cookie' },
  { id: 'drink', name: 'Drink', icon: 'GlassWater' },
];

export const FOOD_STATUS = {
  BEST_SELLER: 'best seller',
  ONLINE_ONLY: 'online only',
  NEW_DISHES: 'new dishes',
  SEASONAL_DISHES: 'seasonal dishes',
};

export const ORDER_STATUS = {
  CANCEL: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  CHECKING: 3,
  DELIVERING: 4,
  DELIVERED: 5,
  COMPLETED: 6,
};

export const ORDER_STATUS_LABELS = [
  'Cancelled',
  'Confirmed',
  'Preparing',
  'Checking',
  'Delivering',
  'Delivered',
  'Completed',
];

export const DELIVERY_FEE = 15;
