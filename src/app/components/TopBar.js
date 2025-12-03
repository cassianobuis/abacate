"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  MapPin,
  Search,
  CheckCircle,
  ExternalLink,
  Star,
  CalendarDays,
  Tag,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Shield,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Users as UsersIcon,
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const NexusLogo = () => (
  <Image 
    src="/favicon.ico"
    alt="Nexus Logo"
    width={32}
    height={32}
    className="w-8 h-8 object-contain"
  />
);

const TopBar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  const menuRef = useRef(null);
  const calendarRef = useRef(null);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const carouselRef = useRef(null);

  // Simulação de dados de notificações (substitua com chamada API real)
  const mockNotifications = [
    {
      id: 1,
      type: 'new_event',
      title: 'Novo Evento Criado',
      message: 'Festa de Ano Novo foi criado por João Silva',
      eventId: 101,
      eventName: 'Festa de Ano Novo',
      timestamp: '2024-12-25T14:30:00',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'event_update',
      title: 'Evento Atualizado',
      message: 'Conferência Tech 2024 teve sua data alterada',
      eventId: 102,
      eventName: 'Conferência Tech 2024',
      timestamp: '2024-12-24T10:15:00',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'event_reminder',
      title: 'Lembrete de Evento',
      message: 'Workshop de React acontece amanhã às 14h',
      eventId: 103,
      eventName: 'Workshop de React',
      timestamp: '2024-12-23T16:45:00',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'old_event',
      title: 'Evento Passado',
      message: 'Meetup de Desenvolvedores foi realizado há 3 dias',
      eventId: 104,
      eventName: 'Meetup de Desenvolvedores',
      timestamp: '2024-12-20T09:00:00',
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'new_event',
      title: 'Novo Evento Criado',
      message: 'Hackathon Inovação 2024 foi criado por Maria Santos',
      eventId: 105,
      eventName: 'Hackathon Inovação 2024',
      timestamp: '2024-12-22T11:20:00',
      read: false,
      priority: 'high'
    }
  ];

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
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

  // Buscar eventos para o calendário e pesquisa
  useEffect(() => {
    if (isCalendarOpen || isSearchOpen) {
      fetchEvents();
    }
  }, [isCalendarOpen, isSearchOpen]);

  // Carregar notificações
  useEffect(() => {
    loadNotifications();
  }, []);

  // Auto-rotacionar carrossel
  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        nextCarouselSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length, currentCarouselIndex]);

  // Atualizar contador de não lidas
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents([]);
      return;
    }

    const searchEvents = async () => {
      setSearchLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/evento');
        const data = await response.json();
        
        const query = searchQuery.toLowerCase();
        const filtered = data.filter(event => 
          event.nome?.toLowerCase().includes(query) ||
          event.descricao?.toLowerCase().includes(query) ||
          event.local?.toLowerCase().includes(query) ||
          event.tipo?.toLowerCase().includes(query)
        );
        
        setFilteredEvents(filtered.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchEvents, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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

  const loadNotifications = async () => {
    setNotificationsLoading(true);
    try {
      // Simulação de API - substitua com sua chamada real
      setTimeout(() => {
        setNotifications(mockNotifications);
        setNotificationsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setNotificationsLoading(false);
    }
  };

  // Funções do carrossel
  const nextCarouselSlide = () => {
    if (events.length > 0) {
      setCurrentCarouselIndex((prev) => (prev + 1) % Math.min(3, events.length));
    }
  };

  const prevCarouselSlide = () => {
    if (events.length > 0) {
      setCurrentCarouselIndex((prev) => (prev - 1 + Math.min(3, events.length)) % Math.min(3, events.length));
    }
  };

  // Funções de notificação
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as notificações?')) {
      setNotifications([]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_event': return <Plus className="w-4 h-4" />;
      case 'event_update': return <AlertTriangle className="w-4 h-4" />;
      case 'event_reminder': return <BellRing className="w-4 h-4" />;
      case 'old_event': return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours} h atrás`;
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return notifTime.toLocaleDateString('pt-BR');
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navegar para o evento relacionado
    if (notification.eventId) {
      window.location.href = `/eventos/${notification.eventId}`;
    }
    setIsNotificationsOpen(false);
  };

  // Agrupar eventos por data para o calendário
  const eventsByDate = events.reduce((acc, event) => {
    if (event.dataInicio) {
      const date = event.dataInicio.split(' ')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/').map(Number);
    const [dayB, monthB, yearB] = b.split('/').map(Number);
    return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
  });

  const menuItems = [
    { href: '/', icon: Home, label: 'Página Inicial' },
    { href: '/evento/create', icon: Plus, label: 'Cadastrar Evento' },
    { href: '/usuarios/listar', icon: Users, label: 'Listar Usuários' },
    { href: '/usuario/create', icon: Plus, label: 'Cadastrar Usuário' },
    ...(isAdmin ? [
      { href: '/cancelar', icon: AlertTriangle, label: 'Cancelar Eventos', adminOnly: true }
    ] : []),
    { href: '/login', icon: LogIn, label: 'Entrar' },
  ];

  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    const [, time] = dateTime.split(' ');
    return time.substring(0, 5);
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

  const formatDateShort = (dateTime) => {
    if (!dateTime) return '';
    const [date] = dateTime.split(' ');
    const [day, month, year] = date.split('/');
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(
      event.dataInicio.split(' ')[0].split('/').reverse().join('-')
    );
    
    if (eventDate > now) {
      const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
      return `${diffDays} dias`;
    }
    return 'Hoje';
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsCalendarOpen(false);
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
    if (!isSearchOpen) {
      setSearchQuery('');
      setFilteredEvents([]);
    }
  };

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsCalendarOpen(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Função para cancelar evento (simulação)
  const handleCancelEvent = (eventId) => {
    if (window.confirm('Tem certeza que deseja cancelar este evento?')) {
      console.log(`Cancelando evento ${eventId}`);
      alert('Evento cancelado com sucesso!');
    }
  };

  // Pegar os 3 eventos principais para o carrossel
  const featuredEvents = events.slice(0, 3);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-purple-950/95 backdrop-blur-xl shadow-2xl border-b border-white/10'
            : 'bg-gradient-to-r from-purple-900/60 via-purple-800/60 to-purple-950/60 backdrop-blur-lg'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 text-white hover:text-purple-200 transition-colors duration-200 group"
            >
              <div className="p-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl group-hover:scale-110 transition-transform duration-200 backdrop-blur-sm border border-white/20">
                <NexusLogo />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight">Nexus Eventos</span>
                <span className="text-xs text-purple-300 opacity-80">Gerencie seus eventos</span>
              </div>
            </Link>

            {/* Área Central - Barra de Pesquisa (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Pesquisar eventos por nome, local ou tipo..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-purple-400 hover:text-purple-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Botões Direita */}
            <div className="flex items-center gap-3">
              {/* Botão Pesquisar (Mobile) */}
              <button
                onClick={handleSearchClick}
                className={`md:hidden p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                  isScrolled
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                } ${isSearchOpen ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' : ''}`}
              >
                <Search className="w-5 h-5 text-purple-300" />
              </button>

              {/* Botão Notificações */}
              <button
                onClick={handleNotificationsClick}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 relative ${
                  isScrolled
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                } ${isNotificationsOpen ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' : ''}`}
              >
                {unreadCount > 0 ? (
                  <BellRing className="w-5 h-5 text-purple-300 animate-pulse" />
                ) : (
                  <Bell className="w-5 h-5 text-purple-300" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Botão Calendário */}
              <button
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setIsMenuOpen(false);
                  setIsSearchOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 relative ${
                  isScrolled
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                } ${isCalendarOpen ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' : ''}`}
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
                  setIsSearchOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                  isScrolled
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                } ${isMenuOpen ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' : ''}`}
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

      {/* Notificações Dropdown */}
      {isNotificationsOpen && (
        <div
          ref={notificationsRef}
          className="fixed top-16 right-4 z-50 w-96 bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl max-h-[80vh] overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Notificações</h3>
                <p className="text-sm text-purple-300">
                  {unreadCount > 0 
                    ? `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}` 
                    : 'Todas lidas'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Marcar todas como lidas"
                  >
                    <CheckCheck className="w-4 h-4 text-purple-300" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                    title="Limpar todas"
                  >
                    <Trash2 className="w-4 h-4 text-purple-300" />
                  </button>
                )}
              </div>
            </div>

            {notificationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white/5 rounded-xl p-4 border transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                      notification.read 
                        ? 'border-white/5 hover:border-white/10' 
                        : 'border-purple-500/30 bg-purple-500/5 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-sm text-purple-300">{notification.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-400">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                        >
                          <X className="w-3 h-3 text-purple-400" />
                        </button>
                      </div>
                    </div>

                    {/* Informações do Evento */}
                    {notification.eventName && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">{notification.eventName}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority === 'high' ? 'Alta' : 
                             notification.priority === 'medium' ? 'Média' : 'Baixa'}
                          </div>
                        </div>
                        {notification.type === 'old_event' && (
                          <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Evento já realizado
                          </div>
                        )}
                        {notification.type === 'new_event' && (
                          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Novo evento disponível
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ações */}
                    <div className="mt-3 flex items-center justify-between">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-purple-300 rounded-lg transition-colors duration-200 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Marcar como lida
                        </button>
                      )}
                      {notification.read && (
                        <div className="text-xs px-3 py-1 bg-white/5 text-purple-400 rounded-lg flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Lida
                        </div>
                      )}
                      {notification.eventId && (
                        <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg">
                          ID: {notification.eventId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
                <p className="text-purple-300">Nenhuma notificação</p>
                <p className="text-sm text-purple-400 mt-1">Novas notificações aparecerão aqui</p>
              </div>
            )}

            {/* Estatísticas de Notificações */}
            {notifications.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{notifications.length}</div>
                    <div className="text-xs text-purple-300">Total</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">{unreadCount}</div>
                    <div className="text-xs text-purple-300">Não lidas</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">
                      {notifications.filter(n => n.type === 'new_event').length}
                    </div>
                    <div className="text-xs text-purple-300">Novos eventos</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      // Aqui você pode adicionar uma página de histórico de notificações
                      console.log('Ver histórico completo');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-sm text-purple-300 hover:text-white transition-colors duration-200"
                  >
                    Ver histórico completo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Hambúrguer Dropdown */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-16 right-4 z-50 w-64 bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl"
        >
          <div className="p-4">
            <div className="mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white mb-2">Menu de Navegação</h3>
                {isAdmin && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                    <Shield className="w-3 h-3 text-purple-300" />
                    <span className="text-xs text-purple-300">Admin</span>
                  </div>
                )}
              </div>
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
                  } ${item.adminOnly ? 'border-l-4 border-l-red-500/50' : ''}`}
                >
                  <div className={`p-2 rounded-lg ${
                    pathname === item.href
                      ? item.adminOnly 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : item.adminOnly
                      ? 'bg-red-500/20 group-hover:bg-red-500/30'
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <item.icon className={`w-4 h-4 ${
                      pathname === item.href ? 'text-white' : 
                      item.adminOnly ? 'text-red-300' : 'text-purple-300'
                    }`} />
                  </div>
                  <span className={`flex-1 font-medium ${
                    pathname === item.href ? 'text-white' : 
                    item.adminOnly ? 'text-red-200' : 'text-purple-200'
                  }`}>
                    {item.label}
                  </span>
                  {item.adminOnly && (
                    <Shield className="w-3 h-3 text-red-400" />
                  )}
                  <ChevronRight className={`w-4 h-4 ${
                    pathname === item.href ? 'text-white' : 
                    item.adminOnly ? 'text-red-400 opacity-0 group-hover:opacity-100' : 
                    'text-purple-400 opacity-0 group-hover:opacity-100'
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
                  <div className="text-2xl font-bold text-white">{unreadCount}</div>
                  <div className="text-xs text-purple-300">Notificações</div>
                </div>
              </div>
              {isAdmin && (
                <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-red-300">Modo Administrador Ativo</span>
                  </div>
                </div>
              )}
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

                          {isAdmin && (
                            <button
                              onClick={() => handleCancelEvent(event.id)}
                              className="mt-2 w-full text-xs px-2 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              Cancelar Evento
                            </button>
                          )}
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

      {/* Dropdown de Pesquisa */}
      {isSearchOpen && (
        <div
          ref={searchRef}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl max-h-[80vh] overflow-hidden mx-4"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <Search className="w-5 h-5 text-purple-300" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar eventos por nome, descrição, local ou tipo..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            {/* Resultados da Pesquisa */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {searchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              ) : searchQuery.trim() === '' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-purple-400/50" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Buscar Eventos</h4>
                  <p className="text-purple-300 mb-4">
                    Digite palavras-chave para encontrar eventos
                  </p>
                  
                  {/* Carrossel de Eventos em Destaque */}
                  {featuredEvents.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-purple-300 mb-3">Eventos em Destaque</h5>
                      <div className="relative overflow-hidden rounded-xl bg-white/5 p-2">
                        <div className="flex transition-transform duration-500">
                          {featuredEvents.map((event, index) => (
                            <div
                              key={index}
                              className="flex-shrink-0 w-full"
                              style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
                            >
                              <div className="bg-white/10 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h6 className="font-bold text-white">{event.nome}</h6>
                                    <p className="text-xs text-purple-300 mt-1">{event.local}</p>
                                  </div>
                                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                                    {event.tipo}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-purple-300">
                                  <CalendarDays className="w-3 h-3" />
                                  <span>{formatDateShort(event.dataInicio)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {featuredEvents.length > 1 && (
                          <>
                            <button
                              onClick={prevCarouselSlide}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/20 backdrop-blur-sm rounded-full"
                            >
                              <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={nextCarouselSlide}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/20 backdrop-blur-sm rounded-full"
                            >
                              <ChevronRightIcon className="w-4 h-4 text-white" />
                            </button>
                            <div className="flex justify-center gap-1 mt-3">
                              {featuredEvents.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentCarouselIndex(index)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    index === currentCarouselIndex
                                      ? 'bg-white w-4'
                                      : 'bg-white/30'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">{events.length}</div>
                      <div className="text-xs text-purple-300">Eventos disponíveis</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">4</div>
                      <div className="text-xs text-purple-300">Categorias</div>
                    </div>
                  </div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-white">
                        Resultados da Pesquisa
                      </h4>
                      <span className="text-sm text-purple-300 bg-white/10 px-3 py-1 rounded-full">
                        {filteredEvents.length} encontrado{filteredEvents.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-purple-300">
                      Pesquisando por: <span className="text-white font-medium">"{searchQuery}"</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {filteredEvents.map((event, index) => (
                      <Link
                        key={index}
                        href={`/eventos/${event.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="block bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.02] group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-bold text-white group-hover:text-purple-200 transition-colors duration-200">
                                {event.nome}
                              </h5>
                              {index === 0 && (
                                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  Destaque
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-purple-300 line-clamp-2 mb-3">
                              {event.descricao}
                            </p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300">
                              {formatDateShort(event.dataInicio)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300">
                              {formatTime(event.dataInicio)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 truncate">{event.local}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Tag className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 capitalize">{event.tipo}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full">
                            {getEventStatus(event)} restante{getEventStatus(event) !== '1' && getEventStatus(event) !== 'Hoje' ? 's' : ''}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-purple-300">
                            <CheckCircle className="w-3 h-3" />
                            <span>Vagas disponíveis</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-purple-400/50" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Nenhum resultado encontrado</h4>
                  <p className="text-purple-300">
                    Não encontramos eventos para: <span className="text-white">"{searchQuery}"</span>
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-purple-300 mb-2">Tente:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => setSearchQuery('festa')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors duration-200"
                      >
                        Festa
                      </button>
                      <button
                        onClick={() => setSearchQuery('conferência')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors duration-200"
                      >
                        Conferência
                      </button>
                      <button
                        onClick={() => setSearchQuery('workshop')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors duration-200"
                      >
                        Workshop
                      </button>
                      <button
                        onClick={() => setSearchQuery('São Paulo')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors duration-200"
                      >
                        São Paulo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações de busca */}
            {(filteredEvents.length > 0 || searchQuery.trim() !== '') && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-300">
                    Pesquisando em tempo real
                  </span>
                  <Link
                    href={`/eventos?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <span>Ver todos os resultados</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fundo da Tela Inicial */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Gradiente principal - Roxo mais forte em baixo */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-800 via-purple-900 to-purple-950"></div>
        
        {/* Sombra roxa no fundo */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-purple-950/80 via-purple-900/60 to-transparent"></div>
        
        {/* Efeitos de luz/sombra */}
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-purple-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-3xl"></div>
        
        {/* Partículas animadas */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Estilos CSS para animações */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
        }
        .animate-float {
          animation: float infinite linear;
        }
      `}</style>
    </>
  );
};

export default TopBar;