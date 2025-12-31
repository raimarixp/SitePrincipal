import { createContext, type ReactNode, useState, useEffect, useContext } from 'react';

// === 1. TIPAGENS ===
export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  featured?: boolean;
  requiresQuote?: boolean;
  isConsultation?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

// Interface que o restante do App espera receber
interface CartContextData {
  cartItems: CartItem[]; // Renomeado de 'cart' para 'cartItems' para compatibilidade
  cartTotal: number;     // Renomeado de 'total' para 'cartTotal'
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void; // Alterado para receber a nova quantidade direta
  clearCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

// === 2. CRIAÇÃO DO CONTEXTO ===
const CartContext = createContext<CartContextData>({} as CartContextData);

// === 3. PROVIDER ===
export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
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

  // Persistência no LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@Empresa:cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    // 🔒 BLOQUEIO DE SEGURANÇA (Mantido da sua lógica)
    if (product.requiresQuote || product.isConsultation) {
      console.warn("Este produto requer orçamento e não pode ser adicionado ao carrinho.");
      return;
    }

    setCartItems((prevCart) => {
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
    setCartItems((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // Atualiza para uma quantidade específica (Compatível com inputs numéricos e botões +/-)
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevCart) => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('@Empresa:cart');
  };

  // Cálculos derivados
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems,      // Padronizado
        cartTotal,      // Padronizado
        cartCount, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// === 4. HOOK ===
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
};