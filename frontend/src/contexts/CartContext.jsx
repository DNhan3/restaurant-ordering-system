import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'qfood_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (food, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.foodId === food.food_id);
      if (existing) {
        return prev.map(item =>
          item.foodId === food.food_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        foodId: food.food_id,
        name: food.food_name,
        price: parseFloat(food.food_price),
        discount: parseFloat(food.food_discount || 0),
        image: food.food_image,
        quantity
      }];
    });
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.foodId === foodId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (foodId) => {
    setItems(prev => prev.filter(item => item.foodId !== foodId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = item.price - item.discount;
      return sum + (price * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return items.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
  };

  const value = {
    items,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getSubtotal,
    getTotalDiscount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
