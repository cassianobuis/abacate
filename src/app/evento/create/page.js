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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const [date, time] = dateString.split(' ');
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`;
  };

  const formatDateForBackend = (dateString) => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 relative overflow-hidden">
      
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950"></div>
      <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-purple-700/40 via-purple-600/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -right-40 w-[700px] h-[700px] bg-gradient-to-bl from-purple-600/50 via-purple-500/40 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-700/30 via-purple-600/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-purple-800/40 via-purple-700/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-32 left-20 w-8 h-8 bg-purple-700/40 rounded-full blur-xl"></div>
      <div className="absolute top-64 right-32 w-12 h-12 bg-purple-600/50 rounded-full blur-xl"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-4xl font-bold text-white">Criar Novo Evento</h1>
          </div>

          {/* Formulário */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-red-200">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do Evento */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Nome do Evento *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  maxLength={150}
                  className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 ${
                    errors.nome ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Digite o nome do evento"
                />
                <div className="flex justify-between mt-1">
                  {errors.nome && (
                    <span className="text-red-300 text-sm">{errors.nome}</span>
                  )}
                  <span className="text-purple-300 text-sm ml-auto">
                    {formData.nome.length}/150
                  </span>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 resize-none ${
                    errors.descricao ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Descreva o evento..."
                />
                <div className="flex justify-between mt-1">
                  {errors.descricao && (
                    <span className="text-red-300 text-sm">{errors.descricao}</span>
                  )}
                  <span className="text-purple-300 text-sm ml-auto">
                    {formData.descricao.length}/500
                  </span>
                </div>
              </div>

              {/* Tipo e Local */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo do Evento */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Tipo do Evento *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                      errors.tipo ? 'border-red-400/50' : 'border-white/20'
                    }`}
                  >
                    <option value="" className="text-purple-300">Selecione um tipo</option>
                    {tiposEvento.map((tipo) => (
                      <option key={tipo.value} value={tipo.value} className="bg-purple-900">
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <span className="text-red-300 text-sm mt-1">{errors.tipo}</span>
                  )}
                </div>

                {/* Local */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1 text-purple-300" />
                    Local *
                  </label>
                  <input
                    type="text"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    maxLength={150}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 ${
                      errors.local ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="Onde o evento acontecerá?"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.local && (
                      <span className="text-red-300 text-sm">{errors.local}</span>
                    )}
                    <span className="text-purple-300 text-sm ml-auto">
                      {formData.local.length}/150
                    </span>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data de Início */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1 text-purple-300" />
                    Data e Hora de Início *
                  </label>
                  <input
                    type="datetime-local"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                      errors.dataInicio ? 'border-red-400/50' : 'border-white/20'
                    }`}
                  />
                  {errors.dataInicio && (
                    <span className="text-red-300 text-sm mt-1">{errors.dataInicio}</span>
                  )}
                </div>

                {/* Data Final */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1 text-purple-300" />
                    Data e Hora de Término *
                  </label>
                  <input
                    type="datetime-local"
                    name="dataFinal"
                    value={formData.dataFinal}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                      errors.dataFinal ? 'border-red-400/50' : 'border-white/20'
                    }`}
                  />
                  {errors.dataFinal && (
                    <span className="text-red-300 text-sm mt-1">{errors.dataFinal}</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Link do Evento */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Link2 className="w-4 h-4 inline mr-1 text-purple-300" />
                    Link do Evento
                  </label>
                  <input
                    type="url"
                    name="linkEvento"
                    value={formData.linkEvento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50"
                    placeholder="https://..."
                  />
                </div>

                {/* Link da Imagem */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Image className="w-4 h-4 inline mr-1 text-purple-300" />
                    Link da Imagem
                  </label>
                  <input
                    type="url"
                    name="linkImagem"
                    value={formData.linkImagem}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Botão de Submit */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:from-purple-600 hover:to-pink-600"
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
    </div>
  );
};

export default EventoCreatePage;