"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Plus, 
  LogIn, 
  Users, 
  Calendar as CalendarIcon,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin
} from 'lucide-react';

const TopBar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const menuRef = useRef(null);
  const calendarRef = useRef(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Buscar eventos para o calendário
  useEffect(() => {
    if (isCalendarOpen) {
      fetchEvents();
    }
  }, [isCalendarOpen]);

  const fetchEvents = async () => {
    setCalendarLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/evento');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Agrupar eventos por data
  const eventsByDate = events.reduce((acc, event) => {
    if (event.dataInicio) {
      const date = event.dataInicio.split(' ')[0]; // Pega apenas a data (dd/MM/yyyy)
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
    }
    return acc;
  }, {});

  // Ordenar datas
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/').map(Number);
    const [dayB, monthB, yearB] = b.split('/').map(Number);
    return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
  });

  const menuItems = [
    { href: '/', icon: Home, label: 'Página Inicial' },
    { href: '/evento/create', icon: Plus, label: 'Cadastrar Evento' },
    { href: '/usuarios', icon: Users, label: 'Listar Usuários' },
    { href: '/cadastro', icon: Plus, label: 'Cadastrar Usuário' },
    { href: '/login', icon: LogIn, label: 'Entrar' },
  ];

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    const [, time] = dateTime.split(' ');
    return time.substring(0, 5); // HH:mm
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-purple-950/90 backdrop-blur-xl shadow-2xl border-b border-white/10'
            : 'bg-gradient-to-r from-purple-900/50 via-purple-800/50 to-purple-950/50 backdrop-blur-lg'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Lado Esquerdo */}
            <Link
              href="/"
              className="flex items-center gap-3 text-white hover:text-purple-200 transition-colors duration-200 group"
            >
              <div className="p-2 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-lg group-hover:scale-110 transition-transform duration-200 backdrop-blur-sm border border-white/20">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight">Events Manager</span>
                <span className="text-xs text-purple-300 opacity-80">Gerencie seus eventos</span>
              </div>
            </Link>

  

            {/* Botões Direita */}
            <div className="flex items-center gap-3">
              {/* Botão Calendário */}
              <button
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setIsMenuOpen(false);
                }}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 relative ${
                  isScrolled
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <CalendarIcon className="w-5 h-5 text-purple-300" />
                {events.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {events.length}
                  </span>
                )}
              </button>

              {/* Botão Hambúrguer */}
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setIsCalendarOpen(false);
                }}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                  isScrolled
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-purple-300" />
                ) : (
                  <Menu className="w-5 h-5 text-purple-300" />
                )}
              </button>

              {/* Botão Entrar (Desktop) */}
              <Link
                href="/login"
                className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                  isScrolled
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Hambúrguer Dropdown */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed top-16 right-4 z-50 w-64 bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl"
        >
          <div className="p-4">
            <div className="mb-4 pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Menu de Navegação</h3>
              <p className="text-sm text-purple-300">Acesse todas as funcionalidades</p>
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20'
                      : 'hover:bg-white/10 border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <item.icon className={`w-4 h-4 ${
                      pathname === item.href ? 'text-white' : 'text-purple-300'
                    }`} />
                  </div>
                  <span className={`flex-1 font-medium ${
                    pathname === item.href ? 'text-white' : 'text-purple-200'
                  }`}>
                    {item.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${
                    pathname === item.href ? 'text-white' : 'text-purple-400 opacity-0 group-hover:opacity-100'
                  } transition-opacity duration-200`} />
                </Link>
              ))}
            </div>

            {/* Estatísticas rápidas */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{events.length}</div>
                  <div className="text-xs text-purple-300">Eventos</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-xs text-purple-300">Páginas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendário Dropdown */}
      {isCalendarOpen && (
        <div 
          ref={calendarRef}
          className="fixed top-16 right-4 z-50 w-80 bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl max-h-[80vh] overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Calendário de Eventos</h3>
                <p className="text-sm text-purple-300">Próximos eventos agendados</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-purple-300" />
              </div>
            </div>

            {calendarLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              </div>
            ) : sortedDates.length > 0 ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {sortedDates.map((date) => (
                  <div key={date} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="mb-3">
                      <h4 className="font-bold text-white text-lg">
                        {formatDate(date)}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-sm text-purple-300">
                          {eventsByDate[date].length} evento{eventsByDate[date].length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {eventsByDate[date].map((event, index) => (
                        <div 
                          key={index}
                          className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-white truncate">{event.nome}</h5>
                            <span className="text-xs px-2 py-1 bg-purple-500/30 text-purple-200 rounded-full">
                              {event.tipo}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-3 h-3 text-purple-400" />
                              <span className="text-purple-300">
                                {formatTime(event.dataInicio)} - {formatTime(event.dataFinal)}
                              </span>
                            </div>
                            
                            {event.local && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3 h-3 text-purple-400" />
                                <span className="text-purple-300 truncate">{event.local}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
                <p className="text-purple-300">Nenhum evento agendado</p>
                <Link
                  href="/evento/create"
                  onClick={() => setIsCalendarOpen(false)}
                  className="inline-block mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Criar Primeiro Evento
                </Link>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/"
                onClick={() => setIsCalendarOpen(false)}
                className="flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-colors duration-200 text-sm"
              >
                <span>Ver todos os eventos</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;