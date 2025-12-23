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

// Função para criar link de WhatsApp para orçamento
export const createWhatsAppLink = (productName: string) => {
  const phone = "5568999082029"; // SUBSTITUA PELO SEU NÚMERO (apenas números)
  const message = `Olá! Gostaria de solicitar um orçamento para o produto: *${productName}*.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};