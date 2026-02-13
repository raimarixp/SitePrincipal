// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  stock: number;
  isQuoteOnly?: boolean;
  // Controle de Orçamento
  requiresQuote?: boolean;
  isConsultation?: boolean;

  // ✨ NOVOS CAMPOS
  features?: string[]; // Array para a lista de checkmarks (ex: ["SEO Otimizado", "Design Responsivo"])
  demoUrl?: string;    // URL para ver o site modelo ao vivo (Portfólio)
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}


export type OrderStatus = 'briefing' | 'design' | 'development' | 'review' | 'completed';

export interface OrderStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export interface ClientOrder {
  id: string;
  projectName: string;
  serviceType: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  previewUrl?: string;
  steps: OrderStep[];
}