import { createContext, type ReactNode, useState, useEffect, useContext } from 'react';

// === TIPAGENS (Podem ser exportadas sem problemas) ===
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  requiresQuote?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, amount: number) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
}

interface CartProviderProps {
  children: ReactNode;
}

// === CRIAÇÃO DO CONTEXTO (SEM EXPORT) ===
// Mudança aqui: Removemos o 'export'. O Contexto agora é privado deste arquivo.
const CartContext = createContext<CartContextData>({} as CartContextData);

// === PROVIDER ===
export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const storagedCart = localStorage.getItem('@Empresa:cart');
      if (storagedCart) {
        try {
          return JSON.parse(storagedCart);
        } catch (e) {
          console.error("Erro ao ler carrinho", e);
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@Empresa:cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product) => {

    // 🔒 BLOQUEIO DE SEGURANÇA
    if (product.requiresQuote) {
    console.warn("Este produto requer orçamento e não pode ser adicionado ao carrinho.");
    return;
  }

    setCart((prevCart) => {
      const productInCart = prevCart.find(item => item.id === product.id);

      if (productInCart) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('@Empresa:cart');
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
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

// === HOOK ===
// Esta é a única forma de acessar o contexto agora.
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
};