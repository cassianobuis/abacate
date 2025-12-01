"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, LogIn, Users } from 'lucide-react';

const TopBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-purple-900/80 via-purple-800/80 to-purple-950/80 backdrop-blur-xl shadow-2xl border-b border-white/10'
          : 'bg-gradient-to-r from-purple-900/40 via-purple-800/40 to-purple-950/40 backdrop-blur-lg'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Home - Lado Esquerdo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-purple-200 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-lg group-hover:scale-110 transition-transform duration-200 backdrop-blur-sm border border-white/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl transition-all duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-95'
              }`}>
                Events Manager
              </span>
            </div>
          </Link>

          {/* Menu Central */}
          <div className="flex-1 flex justify-center items-center gap-4">
            {/* Link Listar Usuários */}
            <Link
              href="/usuarios/listar"
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                isScrolled
                  ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-lg'
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Listar Usuários</span>
            </Link>

            {/* Botão Cadastrar Evento */}
            <Link
              href="/evento/create"
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                isScrolled
                  ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white shadow-2xl hover:shadow-3xl border border-white/20'
                  : 'bg-white/10 text-white shadow-lg hover:bg-white/20 border border-white/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Evento</span>
            </Link>
          </div>

          {/* Botão Direita - Entrar */}
          <Link
            href="/login"
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
              isScrolled
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 shadow-xl'
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;