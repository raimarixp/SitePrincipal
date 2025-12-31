import React from 'react';
import { ScaleIcon, BuildingOfficeIcon, UserGroupIcon, DocumentTextIcon, BanknotesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const areas = [
  {
    title: "Direito Empresarial",
    desc: "Assessoria completa para empresas, fusões, aquisições e contratos corporativos complexos.",
    icon: BuildingOfficeIcon
  },
  {
    title: "Direito de Família",
    desc: "Divórcios, guarda, pensão e planejamento sucessório com total discrição e empatia.",
    icon: UserGroupIcon
  },
  {
    title: "Direito Civil",
    desc: "Indenizações, responsabilidade civil, contratos e disputas patrimoniais.",
    icon: ScaleIcon
  },
  {
    title: "Direito Tributário",
    desc: "Planejamento fiscal, defesa em execuções fiscais e recuperação de créditos.",
    icon: BanknotesIcon
  },
  {
    title: "Direito Imobiliário",
    desc: "Regularização de imóveis, contratos de locação e assessoria em grandes empreendimentos.",
    icon: DocumentTextIcon
  },
  {
    title: "Compliance",
    desc: "Implementação de programas de integridade e adequação à LGPD.",
    icon: ShieldCheckIcon
  }
];

export const PracticeAreas = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-amber-600 font-bold uppercase tracking-widest text-xs mb-2 block">
            Nossas Especialidades
          </span>
          <h2 className="text-4xl font-serif text-slate-900 mb-4">Áreas de Atuação</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-slate-600 font-sans">
            Atuamos de forma estratégica nas principais áreas do direito, oferecendo soluções completas para pessoas físicas e jurídicas.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => (
            <div 
              key={index} 
              className="group bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-amber-600 rounded-sm relative overflow-hidden"
            >
              {/* Ícone com Círculo de Fundo */}
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
                <area.icon className="w-8 h-8 text-slate-700 group-hover:text-amber-600 transition-colors" />
              </div>
              
              <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                {area.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed mb-6 font-sans text-sm">
                {area.desc}
              </p>
              
              <a href="#" className="text-amber-600 font-bold uppercase text-xs tracking-wider flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Saiba Mais <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};