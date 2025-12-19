import { createContext, type ReactNode, useState, useEffect, useContext } from 'react';

// === TIPAGENS ===
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextData {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, amount: number) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
}

interface CartProviderProps {
  children: ReactNode;
}

// === CRIAÇÃO DO CONTEXTO ===
export const CartContext = createContext<CartContextData>({} as CartContextData);

// === PROVIDER (O Cérebro do Carrinho) ===
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Tenta recuperar do LocalStorage ao iniciar
    const storagedCart = localStorage.getItem('@Empresa:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  // Salva no LocalStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('@Empresa:cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product) => {
    const productInCart = cart.find(item => item.id === product.id);

    if (productInCart) {
      // Se já existe, aumenta a quantidade
      const updatedCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      // Se não existe, adiciona com quantidade 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: string, amount: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;
        if (newQuantity <= 0) return item; // Não deixa baixar de 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('@Empresa:cart');
  };

  // Cálculos
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        total, 
        cartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// === HOOK PERSONALIZADO (A SOLUÇÃO DO SEU ERRO) ===
// Agora exportamos o useCart diretamente daqui!
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
};