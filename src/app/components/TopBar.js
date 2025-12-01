"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, LogIn } from 'lucide-react';

const TopBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Home - Lado Esquerdo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-800 hover:text-orange-600 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl transition-all duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-90'
              }`}>
                Events Manager
              </span>
            </div>
          </Link>

          {/* Botão Central - Cadastrar Evento */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/evento/create"
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white/90 text-gray-800 shadow-lg hover:bg-white backdrop-blur-sm'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Evento</span>
            </Link>
          </div>

          {/* Botão Direita - Entrar */}
          <Link
            href="/login"
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              isScrolled
                ? 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-md'
                : 'bg-white/90 text-gray-800 shadow-lg hover:bg-white backdrop-blur-sm'
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