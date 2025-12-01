"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, MapPin, Link2, Image, ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EventoCreatePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    local: '',
    dataInicio: '',
    dataFinal: '',
    linkEvento: '',
    linkImagem: ''
  });

  const tiposEvento = [
    { value: 'CONGRESSO', label: 'CONGRESSO' },
    { value: 'TREINAMENTO', label: 'TREINAMENTO' },
    { value: 'WORKSHOP', label: 'WORKSHOP' },
    { value: 'IMERSÃO', label: 'IMERSÃO' },
    { value: 'REUNIÃO', label: 'REUNIÃO' },
    { value: 'HACKATON', label: 'HACKATON' },
    { value: 'STARTUP', label: 'STARTUP' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Remove erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Converte de "dd/MM/yyyy HH:mm" para "yyyy-MM-ddTHH:mm"
    const [date, time] = dateString.split(' ');
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`;
  };

  const formatDateForBackend = (dateString) => {
    // Converte de "yyyy-MM-ddTHH:mm" para "dd/MM/yyyy HH:mm"
    const [date, time] = dateString.split('T');
    const [year, month, day] = date.split('-');
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year} ${time}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        dataInicio: formatDateForBackend(formData.dataInicio),
        dataFinal: formatDateForBackend(formData.dataFinal)
      };

      const response = await axios.post('http://localhost:8080/api/v1/evento', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        router.push('/');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Erro ao criar evento. Tente novamente.' });
      }
      console.error('Erro ao criar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 relative overflow-hidden">
      
      {/* Efeitos de iluminação de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Criar Novo Evento</h1>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do Evento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Evento *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  maxLength={150}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome do evento"
                />
                <div className="flex justify-between mt-1">
                  {errors.nome && (
                    <span className="text-red-500 text-sm">{errors.nome}</span>
                  )}
                  <span className="text-gray-500 text-sm ml-auto">
                    {formData.nome.length}/150
                  </span>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.descricao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o evento..."
                />
                <div className="flex justify-between mt-1">
                  {errors.descricao && (
                    <span className="text-red-500 text-sm">{errors.descricao}</span>
                  )}
                  <span className="text-gray-500 text-sm ml-auto">
                    {formData.descricao.length}/500
                  </span>
                </div>
              </div>

              {/* Tipo e Local */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo do Evento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo do Evento *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.tipo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um tipo</option>
                    {tiposEvento.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <span className="text-red-500 text-sm mt-1">{errors.tipo}</span>
                  )}
                </div>

                {/* Local */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Local *
                  </label>
                  <input
                    type="text"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    maxLength={150}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.local ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Onde o evento acontecerá?"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.local && (
                      <span className="text-red-500 text-sm">{errors.local}</span>
                    )}
                    <span className="text-gray-500 text-sm ml-auto">
                      {formData.local.length}/150
                    </span>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data de Início */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data e Hora de Início *
                  </label>
                  <input
                    type="datetime-local"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.dataInicio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dataInicio && (
                    <span className="text-red-500 text-sm mt-1">{errors.dataInicio}</span>
                  )}
                </div>

                {/* Data Final */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data e Hora de Término *
                  </label>
                  <input
                    type="datetime-local"
                    name="dataFinal"
                    value={formData.dataFinal}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.dataFinal ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dataFinal && (
                    <span className="text-red-500 text-sm mt-1">{errors.dataFinal}</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Link do Evento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Link2 className="w-4 h-4 inline mr-1" />
                    Link do Evento
                  </label>
                  <input
                    type="url"
                    name="linkEvento"
                    value={formData.linkEvento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://..."
                  />
                </div>

                {/* Link da Imagem */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Image className="w-4 h-4 inline mr-1" />
                    Link da Imagem
                  </label>
                  <input
                    type="url"
                    name="linkImagem"
                    value={formData.linkImagem}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Botão de Submit */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Criar Evento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default EventoCreatePage;