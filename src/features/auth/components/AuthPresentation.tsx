import React from 'react';
import { motion } from 'motion/react';

interface AuthPresentationProps {
  isLogin: boolean;
}

export const AuthPresentation: React.FC<AuthPresentationProps> = ({ isLogin }) => {
  return (
    <aside className="relative p-8 md:p-16 lg:p-24 flex flex-col flex-1 w-full justify-center items-start">
      <motion.div 
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col max-w-[520px] mx-auto w-full"
      >
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] mb-8 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Controle Financeiro Pessoal</span>
        </div>

        <h1 className="text-[40px] lg:text-[48px] leading-[1.1] font-black tracking-tight mb-4 text-white">
          Clareza total sobre a sua <span className="text-primary">vida financeira.</span>
        </h1>

        <h2 className="text-[18px] lg:text-[20px] text-white/90 font-medium mb-6">
          Organize, acompanhe e decida com mais confiança.
        </h2>

        <div className="text-[14px] lg:text-[15px] leading-relaxed text-slate-400 mb-10 space-y-4">
          <p>O Equilibra ajuda você a reunir entradas, despesas, dívidas e objetivos num só lugar.</p>
          <p>Acompanhe sua evolução financeira com uma visão clara, elegante e prática para o dia a dia.</p>
        </div>

        <ul className="grid gap-4 mb-12">
          {[
            "Registre entradas, despesas e pagamentos com simplicidade.",
            "Visualize sua evolução mensal e entenda melhor os seus hábitos financeiros.",
            "Organize dívidas e objetivos com mais clareza e controle."
          ].map((benefit, i) => (
            <li key={i} className="flex items-start gap-4 text-[13px] lg:text-[14px] text-slate-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8 border-t border-white/[0.04]">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
            Clareza • Segurança • Controle
          </div>
        </div>
      </motion.div>
    </aside>
  );
};
