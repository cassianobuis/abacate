"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Mail, 
  Lock, 
  User, 
  IdCard, 
  Phone, 
  Calendar, 
  UserPlus, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';


const CadastroPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    cpf: '',
    telefone: '',
    tipo: '',
    dataNascimento: ''
  });

  const tiposUsuario = [
    { value: 'USUARIO', label: 'Usuário' },
    { value: 'ORGANIZADOR', label: 'Organizador' },
    { value: 'ADMIN', label: 'Administrador' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação do CPF
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    // Formatação do telefone
    else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Remove erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCPF = (cpf) => {
    // Remove tudo que não é dígito
    cpf = cpf.replace(/\D/g, '');
    
    // Aplica a formatação do CPF
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return cpf.substring(0, 14); // Limita ao tamanho máximo do CPF formatado
  };

  const formatPhone = (phone) => {
    // Remove tudo que não é dígito
    phone = phone.replace(/\D/g, '');
    
    // Aplica a formatação do telefone
    if (phone.length <= 11) {
      if (phone.length <= 10) {
        phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    
    return phone.substring(0, 15); // Limita ao tamanho máximo do telefone formatado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Remove a formatação do CPF e telefone antes de enviar
      const payload = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      };

      const response = await axios.post('http://localhost:8080/api/v1/usuario', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        // Redireciona para a página de login ou inicial
        router.push('/login?message=Cadastro realizado com sucesso!');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Erro ao realizar cadastro. Tente novamente.' });
      }
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 relative overflow-hidden">

      
      {/* Efeitos de iluminação de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Criar Conta</h1>
          </div>

          {/* Card de Cadastro */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Nome Completo *
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
                  placeholder="Digite seu nome completo"
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

              {/* Email e Tipo de Usuário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={150}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.email && (
                      <span className="text-red-500 text-sm">{errors.email}</span>
                    )}
                    <span className="text-gray-500 text-sm ml-auto">
                      {formData.email.length}/150
                    </span>
                  </div>
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Usuário *
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
                    {tiposUsuario.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <span className="text-red-500 text-sm mt-1">{errors.tipo}</span>
                  )}
                </div>
              </div>

              {/* CPF e Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CPF */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <IdCard className="w-4 h-4 inline mr-1" />
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.cpf ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <span className="text-red-500 text-sm mt-1">{errors.cpf}</span>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.dataNascimento ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formData.dataNascimento && (
                    <span className="text-gray-500 text-sm mt-1">
                      Idade: {calculateAge(formData.dataNascimento)} anos
                    </span>
                  )}
                  {errors.dataNascimento && (
                    <span className="text-red-500 text-sm mt-1 block">{errors.dataNascimento}</span>
                  )}
                </div>
              </div>

              {/* Telefone e Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Telefone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone *
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength={15}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.telefone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && (
                    <span className="text-red-500 text-sm mt-1">{errors.telefone}</span>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12 ${
                        errors.senha ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.senha && (
                    <span className="text-red-500 text-sm mt-1">{errors.senha}</span>
                  )}
                </div>
              </div>

              {/* Termos e Condições */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Ao criar uma conta, você concorda com nossos{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline">
                    Termos de Serviço
                  </a>
                  ,{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline">
                    Política de Privacidade
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline">
                    Política de Cookies
                  </a>.
                </label>
              </div>

              {/* Botão de Cadastro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Criar Conta
                  </>
                )}
              </button>

              {/* Login */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <a 
                    href="/login" 
                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
                  >
                    Faça login
                  </a>
                </p>
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

export default CadastroPage;