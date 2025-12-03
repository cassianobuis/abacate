"use client";

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  CheckCircle,
  Trash2,
  Shield,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Mail,
  Bell,
  Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const CancelarEventosPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [showCanceled, setShowCanceled] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    canceled: 0,
    upcoming: 0
  });

  useEffect(() => {
    checkAdmin();
    fetchEvents();
  }, []);

  useEffect(() => {
    filterAndSearchEvents();
  }, [events, searchQuery, selectedFilter, showCanceled]);

  const checkAdmin = async () => {
    // Simular verificação de admin
    // Na prática, você faria uma chamada à sua API
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken || true); // Para teste, deixamos true
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/evento');
      if (!response.ok) throw new Error('Erro ao buscar eventos');
      
      const data = await response.json();
      
      // Adicionar status (na prática viria do backend com campo "cancelado")
      const eventsWithStatus = data.map(event => ({
        ...event,
        cancelado: event.cancelado || false, // Campo do backend
        participantes: Math.floor(Math.random() * 100) + 20,
        capacidade: 100
      }));
      
      setEvents(eventsWithStatus);
      updateStats(eventsWithStatus);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      alert('Erro ao carregar eventos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (eventsList) => {
    const total = eventsList.length;
    const active = eventsList.filter(e => !e.cancelado).length;
    const canceled = eventsList.filter(e => e.cancelado).length;
    const today = new Date();
    const upcoming = eventsList.filter(e => {
      if (e.cancelado) return false;
      const [day, month, year] = e.dataInicio.split(' ')[0].split('/');
      const eventDate = new Date(year, month - 1, day);
      return eventDate > today;
    }).length;

    setStats({ total, active, canceled, upcoming });
  };

  const filterAndSearchEvents = () => {
    let filtered = [...events];

    // Filtrar por status cancelado
    if (!showCanceled) {
      filtered = filtered.filter(event => !event.cancelado);
    }

    // Filtrar por tipo selecionado
    if (selectedFilter !== 'todos') {
      filtered = filtered.filter(event => event.tipo === selectedFilter);
    }

    // Filtrar por busca
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.nome.toLowerCase().includes(query) ||
        event.local.toLowerCase().includes(query) ||
        event.descricao.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Resetar para primeira página ao filtrar
  };

  const formatDate = (dateString) => {
    return dateString;
  };

  const getDiasRestantes = (dataInicio) => {
    const hoje = new Date();
    const partesData = dataInicio.split(' ')[0].split('/');
    const dataEvento = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    const diffTime = dataEvento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCancelEvent = (event) => {
    if (!isAdmin) {
      alert('Apenas administradores podem cancelar eventos.');
      return;
    }
    
    setSelectedEvent(event);
    setCancelReason('');
    setNotificationMessage(`Lamentamos informar que o evento "${event.nome}" foi cancelado.`);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }

    setCancelling(true);
    try {
      // Chamada real para o endpoint de cancelamento
      const cancelData = {
        eventoId: selectedEvent.id,
        motivo: cancelReason,
        enviarNotificacao: sendNotification,
        mensagemNotificacao: notificationMessage
      };

      console.log('Enviando dados de cancelamento:', cancelData);

      // IMPORTANTE: Aqui você precisa criar um endpoint no backend para cancelar eventos
      // Exemplo: POST /api/v1/evento/{id}/cancelar
      const response = await fetch(`http://localhost:8080/api/v1/evento/${selectedEvent.id}/cancelar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancelData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao cancelar evento');
      }

      // Se o backend retornar sucesso, atualizar localmente
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? { 
              ...event, 
              cancelado: true,
              motivoCancelamento: cancelReason,
              dataCancelamento: new Date().toISOString()
            }
          : event
      );
      
      setEvents(updatedEvents);
      updateStats(updatedEvents);
      
      // Remover da lista imediatamente (não mostrar na tela inicial)
      const newFilteredEvents = filteredEvents.filter(e => e.id !== selectedEvent.id);
      setFilteredEvents(newFilteredEvents);
      
      // Feedback para o usuário
      alert('✅ Evento cancelado com sucesso! Ele foi removido da tela inicial.');
      
      // Fechar modal e resetar
      setCancelModalOpen(false);
      setCancelReason('');
      setNotificationMessage('');
      setSelectedEvent(null);
      
    } catch (error) {
      console.error('Erro ao cancelar evento:', error);
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const restoreEvent = async (eventId) => {
    if (!isAdmin) {
      alert('Apenas administradores podem restaurar eventos.');
      return;
    }

    if (!window.confirm('Deseja restaurar este evento? Ele voltará a aparecer na tela inicial.')) {
      return;
    }

    try {
      // Chamada para restaurar evento
      const response = await fetch(`http://localhost:8080/api/v1/evento/${eventId}/restaurar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao restaurar evento');
      }

      // Atualizar localmente
      const updatedEvents = events.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              cancelado: false,
              motivoCancelamento: '',
              dataCancelamento: null
            }
          : event
      );
      
      setEvents(updatedEvents);
      updateStats(updatedEvents);
      
      alert('✅ Evento restaurado com sucesso! Ele voltará a aparecer na tela inicial.');
      
    } catch (error) {
      console.error('Erro ao restaurar evento:', error);
      alert('❌ Erro ao restaurar evento.');
    }
  };

  // Função para deletar permanentemente (opcional)
  const deleteEventPermanently = async (eventId) => {
    if (!isAdmin) {
      alert('Apenas administradores podem excluir eventos permanentemente.');
      return;
    }

    if (!window.confirm('ATENÇÃO: Esta ação é irreversível! Deseja excluir permanentemente este evento?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/evento/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir evento');
      }

      // Remover completamente da lista
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      updateStats(updatedEvents);
      
      alert('🗑️ Evento excluído permanentemente!');
      
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('❌ Erro ao excluir evento.');
    }
  };

  // Paginação
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const tiposEventos = ['todos', ...new Set(events.map(e => e.tipo).filter(Boolean))];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
            <p className="text-purple-300 mb-6">
              Esta área é exclusiva para administradores do sistema.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 w-full"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950">
      {/* Efeitos de fundo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-purple-700/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-purple-950/40 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Cancelar Eventos
                </h1>
              </div>
              <p className="text-purple-300">
                Eventos cancelados são automaticamente removidos da tela inicial
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-500/20">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-red-300 text-sm font-medium">Modo Admin</span>
              </div>
              <button
                onClick={fetchEvents}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-colors duration-200"
                title="Atualizar lista"
              >
                <RefreshCw className="w-5 h-5 text-purple-300" />
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300">Total</span>
                <BarChart3 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300">Ativos</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
              <div className="text-xs text-purple-400 mt-1">
                {stats.active > 0 ? 'Visíveis na tela inicial' : 'Nenhum ativo'}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300">Cancelados</span>
                <X className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.canceled}</div>
              <div className="text-xs text-purple-400 mt-1">
                {stats.canceled > 0 ? 'Ocultos da tela inicial' : 'Nenhum cancelado'}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300">Próximos</span>
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.upcoming}</div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar eventos por nome, local ou descrição..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/5 border border-white/20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {tiposEventos.map(tipo => (
                      <option key={tipo} value={tipo} className="bg-purple-900 text-white">
                        {tipo === 'todos' ? 'Todos os tipos' : tipo}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => setShowCanceled(!showCanceled)}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                    showCanceled
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-white/5 text-purple-300 border-white/20 hover:bg-white/10'
                  }`}
                >
                  {showCanceled ? (
                    <>
                      <EyeOff className="w-5 h-5" />
                      <span className="hidden sm:inline">Ocultar Cancelados</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      <span className="hidden sm:inline">Mostrar Cancelados</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="mb-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto"></div>
              <p className="text-purple-300 mt-4">Carregando eventos...</p>
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-purple-400/50" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {showCanceled ? 'Nenhum evento cancelado' : 'Nenhum evento encontrado'}
              </h3>
              <p className="text-purple-300">
                {searchQuery || selectedFilter !== 'todos'
                  ? 'Tente ajustar seus filtros de busca.'
                  : showCanceled
                  ? 'Todos os eventos estão ativos.'
                  : 'Não há eventos para exibir no momento.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-[1.02] group ${
                      event.cancelado
                        ? 'border-red-500/30 bg-red-500/5'
                        : 'border-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                            {event.nome}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.cancelado
                                ? 'bg-red-500/30 text-red-300'
                                : 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300'
                            }`}>
                              {event.tipo}
                            </span>
                            {event.cancelado && (
                              <span className="px-3 py-1 bg-red-500/30 text-red-300 rounded-full text-xs font-medium">
                                Cancelado
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {event.cancelado ? (
                            <>
                              <button
                                onClick={() => restoreEvent(event.id)}
                                className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors duration-200"
                                title="Restaurar Evento"
                              >
                                <RefreshCw className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteEventPermanently(event.id)}
                                className="p-2 bg-red-500/30 text-red-300 rounded-xl hover:bg-red-500/40 transition-colors duration-200"
                                title="Excluir Permanentemente"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleCancelEvent(event)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors duration-200 group/cancel"
                              title="Cancelar Evento"
                            >
                              <Trash2 className="w-5 h-5 group-hover/cancel:scale-110 transition-transform duration-200" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-purple-300 text-sm mb-4 line-clamp-3">
                        {event.descricao}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-purple-300">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{event.local}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-purple-300">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.dataInicio)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-purple-300">
                            <Clock className="w-4 h-4" />
                            <span>Até {formatDate(event.dataFinal)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-2 text-purple-300">
                            <Users className="w-4 h-4" />
                            <span>{event.participantes} / {event.capacidade} participantes</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            event.cancelado ? 'bg-red-500' : 'bg-green-500'
                          }`}></div>
                          <span className={`text-sm ${
                            event.cancelado ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {event.cancelado 
                              ? 'Removido da tela inicial' 
                              : `${getDiasRestantes(event.dataInicio)} dias restantes`}
                          </span>
                        </div>
                        
                        <div className="text-xs text-purple-400">
                          ID: {event.id}
                        </div>
                      </div>

                      {event.cancelado && event.motivoCancelamento && (
                        <div className="mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                          <p className="text-sm text-red-300">
                            <span className="font-medium">Motivo:</span> {event.motivoCancelamento}
                          </p>
                          {event.dataCancelamento && (
                            <p className="text-xs text-red-400/80 mt-1">
                              Cancelado em: {new Date(event.dataCancelamento).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-purple-300 text-sm">
                    Mostrando {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} de {filteredEvents.length} eventos
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-purple-300" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                : 'text-purple-300 hover:bg-white/10'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-purple-300" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Aviso Importante */}
        <div className="bg-gradient-to-r from-red-500/10 via-purple-500/5 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Importante</h3>
              <p className="text-purple-300 mb-2">
                Eventos cancelados são <span className="text-red-300 font-bold">automaticamente removidos</span> da tela inicial e não serão mais visíveis para os usuários.
              </p>
              <p className="text-sm text-purple-400">
                Use a opção "Mostrar Cancelados" para visualizar eventos que foram removidos da tela inicial.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cancelamento */}
      {cancelModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !cancelling && setCancelModalOpen(false)}
          ></div>
          
          <div className="relative bg-gradient-to-br from-purple-900 to-purple-800 rounded-3xl shadow-2xl border border-white/20 max-w-lg w-full p-8 z-50">
            <button
              onClick={() => !cancelling && setCancelModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors disabled:opacity-50"
              disabled={cancelling}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Cancelar Evento
              </h3>
              <p className="text-purple-200">
                {selectedEvent.nome}
              </p>
              <p className="text-sm text-red-300 mt-2">
                ⚠️ Este evento será removido da tela inicial
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-bold text-white mb-3">Detalhes do Evento:</h4>
                <ul className="text-purple-300 text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.local}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedEvent.dataInicio)}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{selectedEvent.participantes} participantes inscritos</span>
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Motivo do Cancelamento *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Descreva o motivo do cancelamento. Esta informação será registrada internamente."
                  className="w-full h-32 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  disabled={cancelling}
                />
                <p className="text-xs text-purple-400 mt-2">
                  * Campo obrigatório para registro
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-300" />
                    <span className="font-medium text-white">Notificação aos Participantes</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="sr-only peer"
                      disabled={cancelling}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>
                
                {sendNotification && (
                  <div className="mt-3">
                    <label className="block text-purple-300 text-sm mb-2">
                      Mensagem de Notificação
                    </label>
                    <textarea
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Mensagem que será enviada para os participantes..."
                      className="w-full h-24 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      disabled={cancelling}
                    />
                    <div className="flex items-center gap-2 text-xs text-purple-400 mt-2">
                      <Mail className="w-3 h-3" />
                      <span>Será enviado por email para todos os participantes</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => !cancelling && setCancelModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cancelling}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={cancelling || !cancelReason.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {cancelling ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Cancelando...
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        <span>Confirmar Cancelamento</span>
                      </div>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelarEventosPage;