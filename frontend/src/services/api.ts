import type { Product } from '../types';

// Simulando um banco de dados
export const PRODUCTS_MOCK: Product[] = [
  {
    id: '1',
    name: 'Headphone Noise Cancelling Pro',
    description: 'Isolamento acústico premium com bateria de 30h.',
    price: 1299.90,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'],
    category: 'Áudio',
    featured: true,
    stock: 10
  },
  {
    id: '2',
    name: 'Smartwatch Series 5',
    description: 'Monitore sua saúde e notificações.',
    price: 899.00,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'],
    category: 'Wearables',
    featured: true,
    stock: 5
  },
  {
    id: '3',
    name: 'Cadeira Ergonômica Office',
    description: 'Conforto para longas jornadas de trabalho.',
    price: 1599.00,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600'],
    category: 'Escritório',
    featured: false,
    stock: 3
  },
  {
    id: '4',
    name: 'Teclado Mecânico RGB',
    description: 'Switches blue para máxima precisão.',
    price: 450.00,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b91a05c?auto=format&fit=crop&q=80&w=600'],
    category: 'Periféricos',
    featured: false,
    stock: 15
  },
  {
    id: '5',
    name: 'Monitor Ultrawide 29"',
    description: 'Aumente sua produtividade com mais tela.',
    price: 1899.00,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600'],
    category: 'Periféricos',
    featured: true,
    stock: 8
  },
  {
    id: '6',
    name: 'Mouse Wireless Ergo',
    description: 'Design vertical para prevenir lesões.',
    price: 199.90,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600'],
    category: 'Periféricos',
    featured: false,
    stock: 20
  }
];

export const getProducts = async (): Promise<Product[]> => {
  // Simula delay de rede de 500ms
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS_MOCK), 500);
  });
};