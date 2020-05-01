import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storedProducts = await AsyncStorage.getItem('cart');
      if (storedProducts) setProducts(JSON.parse(storedProducts));
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async newProduct => {
    let cartHasProduct = false;

    setProducts(
      products.map(product => {
        if (product?.id === newProduct.id) {
          product.quantity++;
          cartHasProduct = true;
        }
        return product;
      }),
    );

    if (!cartHasProduct) {
      newProduct.quantity = 1;
      setProducts([...products, newProduct]);
    }

    AsyncStorage.setItem('cart', JSON.stringify(products));
  }, [products]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    const quantityString = await AsyncStorage.getItem(id);
    const quantityNum = Number(quantityString) || 0;
    const newQuantity = (quantityNum + 1).toString();

    await AsyncStorage.setItem(id, newQuantity);
  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
