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
  AlertCircle,
  CheckCircle 
} from 'lucide-react';


const CadastroPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    cpf: '',
    telefone: '',
    tipo: 'USUARIO',
    dataNascimento: ''
  });

  const tiposUsuario = [
    { value: 'USUARIO', label: 'Usuário' },
    { value: 'ORGANIZADOR', label: 'Organizador' },
    { value: 'ADMINISTRADOR', label: 'Administrador' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length <= 11) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return cpf.substring(0, 14);
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    phone = phone.replace(/\D/g, '');
    
    if (phone.length <= 11) {
      if (phone.length <= 10) {
        phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    
    return phone.substring(0, 15);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'O email deve ser preenchido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'O email deve ser válido';
    }

    if (!formData.senha) {
      newErrors.senha = 'A senha deve ser preenchida';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.nome) {
      newErrors.nome = 'O nome deve ser preenchido';
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'O nome deve ter no mínimo 3 caracteres';
    }

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (!formData.cpf) {
      newErrors.cpf = 'O CPF deve ser preenchido';
    } else if (cpfLimpo.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    const telefoneLimpo = formData.telefone.replace(/\D/g, '');
    if (!formData.telefone) {
      newErrors.telefone = 'O telefone deve ser preenchido';
    } else if (telefoneLimpo.length < 10) {
      newErrors.telefone = 'Telefone deve ter no mínimo 10 dígitos';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'A data de nascimento deve ser preenchida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      const telefoneLimpo = formData.telefone.replace(/\D/g, '');

      const payload = {
        email: formData.email.trim(),
        senha: formData.senha,
        nome: formData.nome.trim(),
        cpf: cpfLimpo,
        telefone: telefoneLimpo,
        tipo: formData.tipo,
        dataNascimento: formData.dataNascimento
      };

      const response = await axios.post('http://localhost:8080/api/v1/usuario', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data?.message) {
          setErrors({ general: error.response.data.message });
        }
      } else if (error.code === 'ECONNREFUSED') {
        setErrors({ general: 'Servidor indisponível. Verifique se o backend está rodando.' });
      } else {
        setErrors({ general: 'Erro ao realizar cadastro. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 relative overflow-hidden">
    
        
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950"></div>
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-purple-700/40 via-purple-600/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -right-40 w-[700px] h-[700px] bg-gradient-to-bl from-purple-600/50 via-purple-500/40 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center border border-white/20">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-full backdrop-blur-sm">
                  <CheckCircle className="w-16 h-16 text-green-300" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Cadastro realizado com sucesso!
              </h2>
              
              <p className="text-purple-200 mb-6">
                Sua conta foi criada com sucesso. Em instantes você será redirecionado para a página de login.
              </p>
              
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-4xl font-bold text-white">Criar Conta</h1>
          </div>

          {/* Card de Cadastro */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-red-200">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  <User className="w-4 h-4 inline mr-2 text-purple-300" />
                  Nome Completo *
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
                  placeholder="Digite seu nome completo"
                />
                <div className="flex justify-between mt-1">
                  {errors.nome && (
                    <span className="text-red-300 text-sm">{errors.nome}</span>
                  )}
                  <span className="text-purple-300 text-sm">
                    {formData.nome.length}/150
                  </span>
                </div>
              </div>

              {/* Email e Tipo de Usuário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Mail className="w-4 h-4 inline mr-2 text-purple-300" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={150}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 ${
                      errors.email ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="seu@email.com"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.email && (
                      <span className="text-red-300 text-sm">{errors.email}</span>
                    )}
                    <span className="text-purple-300 text-sm">
                      {formData.email.length}/150
                    </span>
                  </div>
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Tipo de Usuário *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                      errors.tipo ? 'border-red-400/50' : 'border-white/20'
                    }`}
                  >
                    {tiposUsuario.map((tipo) => (
                      <option key={tipo.value} value={tipo.value} className="bg-purple-900">
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {errors.tipo && (
                    <span className="text-red-300 text-sm mt-1">{errors.tipo}</span>
                  )}
                </div>
              </div>

              {/* CPF e Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CPF */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <IdCard className="w-4 h-4 inline mr-2 text-purple-300" />
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength={14}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 ${
                      errors.cpf ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && (
                    <span className="text-red-300 text-sm mt-1">{errors.cpf}</span>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2 text-purple-300" />
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                      errors.dataNascimento ? 'border-red-400/50' : 'border-white/20'
                    }`}
                  />
                  {formData.dataNascimento && (
                    <span className="text-purple-300 text-sm mt-1 block">
                      Idade: {calculateAge(formData.dataNascimento)} anos
                    </span>
                  )}
                  {errors.dataNascimento && (
                    <span className="text-red-300 text-sm mt-1 block">{errors.dataNascimento}</span>
                  )}
                </div>
              </div>

              {/* Telefone e Senha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Telefone */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Phone className="w-4 h-4 inline mr-2 text-purple-300" />
                    Telefone *
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength={15}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 ${
                      errors.telefone ? 'border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.telefone && (
                    <span className="text-red-300 text-sm mt-1">{errors.telefone}</span>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    <Lock className="w-4 h-4 inline mr-2 text-purple-300" />
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 pr-12 ${
                        errors.senha ? 'border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.senha && (
                    <span className="text-red-300 text-sm mt-1">{errors.senha}</span>
                  )}
                </div>
              </div>

              {/* Termos e Condições */}
              <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-white/30 bg-white/5 text-purple-400 focus:ring-purple-400"
                  required
                />
                <label htmlFor="terms" className="text-sm text-purple-300">
                  Ao criar uma conta, você concorda com nossos{' '}
                  <a href="#" className="text-purple-200 hover:text-white font-medium underline">
                    Termos de Serviço
                  </a>
                  ,{' '}
                  <a href="#" className="text-purple-200 hover:text-white font-medium underline">
                    Política de Privacidade
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-purple-200 hover:text-white font-medium underline">
                    Política de Cookies
                  </a>.
                </label>
              </div>

              {/* Botão de Cadastro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:from-purple-600 hover:to-pink-600"
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
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-purple-300">
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-purple-200 hover:text-white font-semibold transition-colors duration-200"
                  >
                    Faça login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;