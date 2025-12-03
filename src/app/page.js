"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, ExternalLink, Star, X, User, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users as UsersIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [inscricaoLoading, setInscricaoLoading] = useState(false);
  const [inscricaoSuccess, setInscricaoSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mainCarouselIndex, setMainCarouselIndex] = useState(0);
  const carouselRef = useRef(null);
  const mainCarouselRef = useRef(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/evento');
        setEventos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar eventos');
        setLoading(false);
        console.error('Erro:', err);
      }
    };
    fetchEventos();
  }, []);

  const formatarData = (dataString) => {
    return dataString;
  };

  const getDiasRestantes = (dataInicio) => {
    const hoje = new Date();
    const partesData = dataInicio.split(' ')[0].split('/');
    const dataEvento = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    const diffTime = dataEvento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleOpenModal = (evento) => {
    setSelectedEvento(evento);
    setModalOpen(true);
    setNomeUsuario('');
    setEmailUsuario('');
    setInscricaoSuccess(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvento(null);
    setNomeUsuario('');
    setEmailUsuario('');
    setInscricaoSuccess(false);
  };

  const handleInscricao = async () => {
    if (!nomeUsuario.trim() || !emailUsuario.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!validateEmail(emailUsuario)) {
      alert('Por favor, insira um email válido');
      return;
    }

    setInscricaoLoading(true);
    
    try {
      const converterDataParaISO = (dataString) => {
        if (!dataString) return null;
        
        const partes = dataString.split(' ');
        const dataPart = partes[0];
        const horaPart = partes[1] || '00:00';
        
        const [dia, mes, ano] = dataPart.split('/');
        const [hora, minuto] = horaPart.split(':');
        
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}:00`;
      };

      const inscricaoData = {
        evento: {
          id: selectedEvento.id,
          nome: selectedEvento.nome,
          local: selectedEvento.local,
          dataInicio: converterDataParaISO(selectedEvento.dataInicio),
          dataFinal: converterDataParaISO(selectedEvento.dataFinal),
          descricao: selectedEvento.descricao,
          tipo: selectedEvento.tipo,
          linkImagem: selectedEvento.linkImagem,
          linkEvento: selectedEvento.linkEvento
        },
        usuario: {
          nome: nomeUsuario,
          email: emailUsuario
        }
      };

      const response = await axios.post('http://localhost:8080/api/v1/inscricao', inscricaoData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Inscrição realizada com sucesso:', response.data);
      setInscricaoSuccess(true);
      
      // Enviar email de confirmação (simulação)
      setTimeout(() => {
        alert(`Confirmação enviada para: ${emailUsuario}`);
      }, 500);
      
    } catch (err) {
      console.error('Erro na inscrição:', err);
      if (err.response) {
        alert(`Erro na inscrição: ${err.response.data?.message || err.response.statusText}`);
      } else {
        alert('Erro na inscrição. Verifique sua conexão.');
      }
    } finally {
      setInscricaoLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Funções do carrossel principal
  const nextMainSlide = () => {
    setMainCarouselIndex((prev) => (prev + 1) % eventos.slice(0, 3).length);
  };

  const prevMainSlide = () => {
    setMainCarouselIndex((prev) => (prev - 1 + eventos.slice(0, 3).length) % eventos.slice(0, 3).length);
  };

  // Funções do carrossel de outros eventos
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % outrosEventos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + outrosEventos.length) % outrosEventos.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Efeito para auto-rotacionar os carrosseis
  useEffect(() => {
    if (eventos.length > 0) {
      const interval = setInterval(() => {
        nextMainSlide();
        nextSlide();
      }, 7000); // Muda a cada 7 segundos
      
      return () => clearInterval(interval);
    }
  }, [eventos.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
          </div>
          <p className="text-white text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Carregando eventos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border border-purple-800/50 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-white text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const eventoDestaque = eventos[0];
  const outrosEventos = eventos.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
      
      {/* Efeitos de sombra e profundidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/20 to-black/50"></div>
      
      {/* Sombras intensas */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/80 via-purple-950/90 to-purple-950/95"></div>
      
      {/* Sombras roxas intensas */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-900/40 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-purple-800/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-purple-900/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-purple-950/60 rounded-full blur-3xl"></div>
      
      {/* Sombras pretas para contraste */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-black/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-black/30 rounded-full blur-3xl"></div>
      
      {/* Grade sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10"></div>
      
      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 px-4 py-2 rounded-full mb-4 border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-purple-300 font-medium">Experiências Memoráveis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
            Eventos
          </h1>
          
          <p className="text-xl text-purple-300 max-w-2xl mx-auto mb-8">
            Descubra e participe das melhores experiências
          </p>
          
          {/* Estatísticas */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 backdrop-blur-md rounded-xl p-4 min-w-[120px] border border-purple-700/50 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold text-white">{eventos.length}</span>
              </div>
              <p className="text-sm text-purple-400">Eventos Ativos</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 backdrop-blur-md rounded-xl p-4 min-w-[120px] border border-purple-700/50 shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  {eventos.length > 0 ? Math.min(...eventos.map(e => getDiasRestantes(e.dataInicio))) : 0}
                </span>
              </div>
              <p className="text-sm text-purple-400">Próximo evento</p>
            </div>
          </div>
        </div>

        {/* Carrossel Principal de Eventos em Destaque */}
        {eventos.slice(0, 3).length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  <h2 className="text-3xl font-bold text-white">
                    Eventos em Destaque
                  </h2>
                </div>
                <p className="text-purple-300">Navegue pelos principais eventos</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMainSlide}
                  className="p-3 rounded-full bg-gradient-to-br from-purple-800/50 to-purple-900/80 backdrop-blur-sm border border-purple-600/50 text-white hover:from-purple-700/60 hover:to-purple-800/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={eventos.slice(0, 3).length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMainSlide}
                  className="p-3 rounded-full bg-gradient-to-br from-purple-800/50 to-purple-900/80 backdrop-blur-sm border border-purple-600/50 text-white hover:from-purple-700/60 hover:to-purple-800/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  disabled={eventos.slice(0, 3).length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Carrossel Principal */}
            <div className="relative">
              <div 
                ref={mainCarouselRef}
                className="transition-all duration-700 ease-out"
              >
                {eventos.slice(0, 3).map((evento, index) => (
                  <div 
                    key={evento.id}
                    className={`transform transition-all duration-700 ${
                      index === mainCarouselIndex 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-95 absolute inset-0'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-700/50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Imagem */}
                        <div className="relative">
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            {evento.linkImagem ? (
                              <img
                                src={evento.linkImagem}
                                alt={evento.nome}
                                className="w-full h-80 object-cover transform transition-transform duration-1000"
                              />
                            ) : (
                              <div className="w-full h-80 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center">
                                <Calendar className="w-20 h-20 text-purple-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          </div>
                          
                          {/* Indicadores do carrossel */}
                          <div className="flex justify-center gap-2 mt-4">
                            {eventos.slice(0, 3).map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setMainCarouselIndex(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  i === mainCarouselIndex 
                                    ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                                    : 'bg-purple-700/50 hover:bg-purple-600/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-3xl font-bold text-white">
                                {evento.nome}
                              </h3>
                              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Destaque
                              </div>
                            </div>
                            
                            <p className="text-purple-200 text-lg mb-6 leading-relaxed">
                              {evento.descricao}
                            </p>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-3 text-purple-100 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-3 border border-purple-700/30">
                                <MapPin className="w-5 h-5 text-purple-400" />
                                <div>
                                  <div className="text-sm text-purple-400">Local</div>
                                  <span className="font-medium">{evento.local}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 text-purple-100 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-3 border border-purple-700/30">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                <div>
                                  <div className="text-sm text-purple-400">Data</div>
                                  <span className="font-medium">{formatarData(evento.dataInicio)}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-purple-100 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-3 border border-purple-700/30">
                                <Clock className="w-5 h-5 text-purple-400" />
                                <div>
                                  <div className="text-sm text-purple-400">Data Final</div>
                                  <span className="font-medium">{formatarData(evento.dataFinal)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-white">
                              <div className="text-2xl font-bold">{getDiasRestantes(evento.dataInicio)}</div>
                              <div className="text-sm text-purple-400">dias restantes</div>
                            </div>
                            
                            <button
                              onClick={() => handleOpenModal(evento)}
                              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                              <span>Participar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Carrossel de Outros Eventos */}
        {outrosEventos.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Outros Eventos
                </h2>
                <p className="text-purple-300">Descubra mais oportunidades</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-gradient-to-br from-purple-800/50 to-purple-900/80 backdrop-blur-sm border border-purple-600/50 text-white hover:from-purple-700/60 hover:to-purple-800/90 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-gradient-to-br from-purple-800/50 to-purple-900/80 backdrop-blur-sm border border-purple-600/50 text-white hover:from-purple-700/60 hover:to-purple-800/90 transition-all duration-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Container do Carrossel */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-purple-950/50 backdrop-blur-sm border border-purple-700/50 p-4">
              <div 
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
              >
                {outrosEventos.map((evento, index) => (
                  <div 
                    key={evento.id}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2"
                  >
                    <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group border border-purple-700/50 hover:border-purple-600/70 h-full">
                      {/* Imagem */}
                      <div className="relative h-48 overflow-hidden">
                        {evento.linkImagem ? (
                          <img
                            src={evento.linkImagem}
                            alt={evento.nome}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-950 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-purple-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                          {evento.tipo?.toLowerCase()}
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                          {evento.nome}
                        </h3>
                        
                        <p className="text-purple-300 text-sm mb-4 line-clamp-2">
                          {evento.descricao}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-purple-300">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span className="truncate">{evento.local}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-purple-300">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span>{formatarData(evento.dataInicio)}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white font-bold">{getDiasRestantes(evento.dataInicio)}</div>
                            <div className="text-xs text-purple-400">dias restantes</div>
                          </div>
                          
                          <button
                            onClick={() => handleOpenModal(evento)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Indicadores */}
              {outrosEventos.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {outrosEventos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-purple-700/50 hover:bg-purple-600/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de Inscrição Aprimorado */}
        {modalOpen && selectedEvento && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={handleCloseModal}
            ></div>
            
            <div className="relative bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 rounded-3xl shadow-2xl border border-purple-700/50 max-w-lg w-full p-8 z-50 animate-in fade-in duration-300">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-purple-800/50 hover:bg-purple-700/50 transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {inscricaoSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Inscrição Confirmada!
                  </h3>
                  <p className="text-purple-300 mb-4">
                    Você está inscrito em <span className="text-white font-semibold">{selectedEvento.nome}</span>
                  </p>
                  <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-700/30">
                    <p className="text-purple-400 text-sm mb-2">Detalhes da confirmação:</p>
                    <ul className="text-purple-300 text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Nome: <span className="text-white">{nomeUsuario}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Evento: <span className="text-white truncate">{selectedEvento.nome}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Data: <span className="text-white">{formatarData(selectedEvento.dataInicio)}</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 w-full"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Complete sua Inscrição
                    </h3>
                    <p className="text-purple-300">
                      Para participar de <span className="text-white font-semibold">{selectedEvento.nome}</span>
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Informações do Evento */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-4 border border-purple-700/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-medium">Detalhes do Evento</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">
                          <div className="text-purple-400">Data</div>
                          <div className="text-white">{formatarData(selectedEvento.dataInicio)}</div>
                        </div>
                        <div className="text-sm">
                          <div className="text-purple-400">Local</div>
                          <div className="text-white truncate">{selectedEvento.local}</div>
                        </div>
                      </div>
                    </div>

                    {/* Formulário de Inscrição */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-purple-300 text-sm font-medium mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={nomeUsuario}
                          onChange={(e) => setNomeUsuario(e.target.value)}
                          placeholder="Seu nome completo"
                          className="w-full px-4 py-3 bg-purple-900/30 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                          disabled={inscricaoLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-purple-300 text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={emailUsuario}
                          onChange={(e) => setEmailUsuario(e.target.value)}
                          placeholder="seu@email.com"
                          className="w-full px-4 py-3 bg-purple-900/30 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                          disabled={inscricaoLoading}
                        />
                      </div>

                      <div className="flex items-start gap-2 text-sm text-purple-400">
                        <div className="w-5 h-5 flex-shrink-0">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <p>
                          Você receberá uma confirmação por email. Campos marcados com * são obrigatórios.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 bg-purple-900/30 hover:bg-purple-800/40 text-white rounded-xl font-medium transition-all border border-purple-700/50"
                      disabled={inscricaoLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleInscricao}
                      disabled={inscricaoLoading || !nomeUsuario.trim() || !emailUsuario.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {inscricaoLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processando...
                        </span>
                      ) : (
                        'Confirmar Inscrição'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="text-center py-8 border-t border-purple-800/50">
          <p className="text-purple-400">
            Encontre os melhores eventos e viva experiências únicas
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-sm text-purple-500">• Total de Eventos: {eventos.length}</div>
            <div className="text-sm text-purple-500">• Próximo em: {eventos.length > 0 ? Math.min(...eventos.map(e => getDiasRestantes(e.dataInicio))) : 0} dias</div>
            <div className="text-sm text-purple-500">• Disponível: {outrosEventos.length}</div>
          </div>
        </div>
      </div>

      {/* Estilos CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .animate-float {
          animation: float infinite linear;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};



export default EventosPage;
