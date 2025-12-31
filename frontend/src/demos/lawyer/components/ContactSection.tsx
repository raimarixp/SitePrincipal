import React from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

export const ContactSection = () => {
  return (
    <section id="contato" className="py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-lg shadow-xl overflow-hidden">
          
          {/* Lado Esquerdo: Texto Institucional */}
          <div className="bg-slate-900 p-12 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-serif mb-6">Precisa de orientação jurídica?</h2>
            <p className="text-slate-300 mb-8 leading-relaxed font-sans">
              Cada caso é único. Agende uma consulta preliminar para analisarmos a melhor estratégia para a sua defesa. Garantimos sigilo absoluto.
            </p>
            
            <div className="space-y-4 font-sans">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                  <EnvelopeIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Email</p>
                  <p className="font-medium">contato@justech.com.br</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Formulário Acessível */}
          <div className="p-12">
            <form className="space-y-6 font-sans" onSubmit={(e) => e.preventDefault()}>
              
              {/* CAMPO 1: NOME */}
              <div>
                <label 
                  htmlFor="contact-name" 
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Nome Completo
                </label>
                <input 
                  id="contact-name"       // Vincula com o htmlFor da label
                  name="name"             // Identifica o dado
                  autoComplete="name"     // Permite autofill do navegador
                  type="text" 
                  className="w-full border border-slate-300 rounded-sm p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              {/* CAMPO 2: TELEFONE */}
              <div>
                <label 
                  htmlFor="contact-phone" 
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Telefone / WhatsApp
                </label>
                <input 
                  id="contact-phone"
                  name="phone"
                  autoComplete="tel"
                  type="tel" 
                  className="w-full border border-slate-300 rounded-sm p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              {/* CAMPO 3: MENSAGEM */}
              <div>
                <label 
                  htmlFor="contact-message" 
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Breve relato do caso
                </label>
                <textarea 
                  id="contact-message"
                  name="message"
                  rows={4}
                  className="w-full border border-slate-300 rounded-sm p-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="Descreva brevemente sua situação..."
                  required
                ></textarea>
              </div>

              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-sm transition-all shadow-lg">
                Solicitar Contato
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};