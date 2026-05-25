export const CATEGORIES = [
  { id: 'all', name: 'Tất Cả', icon: 'UtensilsCrossed' },
  { id: 'pho', name: 'Phở & Bún', icon: 'CircleDot' },
  { id: 'com', name: 'Cơm', icon: 'Wind' },
  { id: 'banhmi', name: 'Bánh Mì', icon: 'Flame' },
  { id: 'cuon', name: 'Cuốn & Khai Vị', icon: 'Salad' },
  { id: 'douong', name: 'Đồ Uống', icon: 'GlassWater' },
  { id: 'combo', name: 'Combo', icon: 'Gift' },
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
  'Đã Hủy',
  'Đã Xác Nhận',
  'Đang Chuẩn Bị',
  'Đang Kiểm Tra',
  'Đang Giao',
  'Đã Giao',
  'Hoàn Thành',
];

export const DELIVERY_FEE = 15000; // 15,000 VND
