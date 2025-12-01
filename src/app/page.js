"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, ExternalLink, Star } from 'lucide-react';


const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 flex items-center justify-center">

        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 flex items-center justify-center">

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center border border-white/20">
          <p className="text-white text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const eventoDestaque = eventos[0];
  const outrosEventos = eventos.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 relative overflow-hidden">
  
      
      {/* Efeitos de sombreado no fundo - Profundidade intensa */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950"></div>
      
      {/* Camada de profundidade 1 - Sombreados grandes */}
      <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-purple-700/40 via-purple-600/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-40 w-[700px] h-[700px] bg-gradient-to-bl from-purple-600/50 via-purple-500/40 to-transparent rounded-full blur-3xl"></div>
      
      {/* Camada de profundidade 2 - Sombreados médios */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-700/30 via-purple-600/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-800/40 via-purple-700/30 to-transparent rounded-full blur-3xl"></div>
      
      {/* Camada de profundidade 3 - Manchas de sombra */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-900/60 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-to-l from-purple-950/70 to-transparent rounded-full blur-3xl"></div>
      
      {/* Pontos de luz/sombra mais intensos */}
      <div className="absolute top-32 left-20 w-8 h-8 bg-purple-700/40 rounded-full blur-xl"></div>
      <div className="absolute top-64 right-32 w-12 h-12 bg-purple-600/50 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-1/3 w-10 h-10 bg-purple-800/60 rounded-full blur-xl"></div>
      <div className="absolute bottom-48 right-1/4 w-6 h-6 bg-purple-700/45 rounded-full blur-xl"></div>
      
      {/* Efeito de grade sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            Eventos em Destaque
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Descubra os melhores eventos e experiências incríveis
          </p>
        </div>

        {/* Evento em Destaque */}
        {eventoDestaque && (
          <div className="mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-white/20 hover:border-white/30">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Imagem do Evento */}
                <div className="relative">
                  {eventoDestaque.linkImagem ? (
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src={eventoDestaque.linkImagem}
                        alt={eventoDestaque.nome}
                        className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-2xl flex items-center justify-center">
                      <Calendar className="w-20 h-20 text-white" />
                    </div>
                  )}
                  
                  {/* Badge de Destaque */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">Evento em Destaque</span>
                  </div>

                  {/* Contador de Dias */}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-full shadow-lg border border-white/30">
                    <span className="font-bold text-lg">
                      {getDiasRestantes(eventoDestaque.dataInicio)} dias
                    </span>
                  </div>
                </div>

                {/* Informações do Evento */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {eventoDestaque.nome}
                    </h2>
                    
                    <p className="text-purple-200 text-lg mb-6 leading-relaxed">
                      {eventoDestaque.descricao}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-purple-100">
                        <MapPin className="w-5 h-5 text-purple-300" />
                        <span className="font-medium">{eventoDestaque.local}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-purple-100">
                        <Calendar className="w-5 h-5 text-purple-300" />
                        <span className="font-medium">
                          {formatarData(eventoDestaque.dataInicio)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-purple-100">
                        <Clock className="w-5 h-5 text-purple-300" />
                        <span className="font-medium">
                          Até {formatarData(eventoDestaque.dataFinal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        <span className="font-medium capitalize">
                          {eventoDestaque.tipo?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {eventoDestaque.linkEvento && (
                    <a
                      href={eventoDestaque.linkEvento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
                    >
                      <span>Participar do Evento</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outros Eventos */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Próximos Eventos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outrosEventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group border border-white/20 hover:border-white/30"
              >
                {/* Imagem do Evento */}
                <div className="relative h-48 overflow-hidden">
                  {evento.linkImagem ? (
                    <>
                      <img
                        src={evento.linkImagem}
                        alt={evento.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  {/* Overlay roxo mais intenso */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent group-hover:from-purple-900/20 transition-all duration-300"></div>
                  
                  {/* Tipo do Evento */}
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                    {evento.tipo?.toLowerCase()}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {evento.nome}
                  </h3>
                  
                  <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                    {evento.descricao}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-purple-200">
                      <MapPin className="w-4 h-4 text-purple-300" />
                      <span className="truncate">{evento.local}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-purple-200">
                      <Calendar className="w-4 h-4 text-purple-300" />
                      <span>{formatarData(evento.dataInicio)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-semibold">
                      {getDiasRestantes(evento.dataInicio)} dias restantes
                    </span>
                    
                    {evento.linkEvento && (
                      <a
                        href={evento.linkEvento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensagem quando não há mais eventos */}
        {outrosEventos.length === 0 && eventos.length > 0 && (
          <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-purple-200 text-xl">
              Não há mais eventos disponíveis no momento.
            </p>
          </div>
        )}

        {/* Mensagem quando não há eventos */}
        {eventos.length === 0 && (
          <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-purple-200 text-xl">
              Nenhum evento disponível no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventosPage;