import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para mesclar classes do Tailwind de forma inteligente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para formatar preço em Reais (R$)
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};