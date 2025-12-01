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
    return dataString; // Já vem formatada do backend como "dd/MM/yyyy HH:mm"
  };

  const getDiasRestantes = (dataInicio) => {
    const hoje = new Date();
    const partesData = dataInicio.split(' ')[0].split('/');
    const dataEvento = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    const diffTime = dataEvento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  const eventoDestaque = eventos[0];
  const outrosEventos = eventos.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 relative overflow-hidden">
      {/* Efeitos de iluminação de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000ms"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000ms"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
            Eventos em Destaque
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores eventos e experiências incríveis
          </p>
        </div>

        {/* Evento em Destaque */}
        {eventoDestaque && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Imagem do Evento */}
                <div className="relative">
                  {eventoDestaque.linkImagem ? (
                    <img
                      src={eventoDestaque.linkImagem}
                      alt={eventoDestaque.nome}
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center">
                      <Calendar className="w-20 h-20 text-white" />
                    </div>
                  )}
                  
                  {/* Badge de Destaque */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">Evento em Destaque</span>
                  </div>

                  {/* Contador de Dias */}
                  <div className="absolute top-4 right-4 bg-white text-orange-600 px-3 py-2 rounded-full shadow-lg">
                    <span className="font-bold text-lg">
                      {getDiasRestantes(eventoDestaque.dataInicio)} dias
                    </span>
                  </div>
                </div>

                {/* Informações do Evento */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      {eventoDestaque.nome}
                    </h2>
                    
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                      {eventoDestaque.descricao}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">{eventoDestaque.local}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">
                          {formatarData(eventoDestaque.dataInicio)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">
                          Até {formatarData(eventoDestaque.dataFinal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
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
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Próximos Eventos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outrosEventos.map((evento, index) => (
              <div
                key={evento.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                {/* Imagem do Evento */}
                <div className="relative h-48 overflow-hidden">
                
                    <img
                      src={evento.linkImagem}
                      alt={evento.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                 
                  
                  {/* Overlay */}
                  
                  {/* Tipo do Evento */}
                  <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {evento.tipo?.toLowerCase()}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {evento.nome}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {evento.descricao}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="truncate">{evento.local}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>{formatarData(evento.dataInicio)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">
                      {getDiasRestantes(evento.dataInicio)} dias restantes
                    </span>
                    
                    {evento.linkEvento && (
                      <a
                        href={evento.linkEvento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
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
        {outrosEventos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">
              Não há mais eventos disponíveis no momento.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000ms {
          animation-delay: 2s;
        }
        .animation-delay-4000ms {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventosPage;