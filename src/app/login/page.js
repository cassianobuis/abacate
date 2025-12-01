"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';


const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.status === 401) {
        setErrors({ general: 'Email ou senha incorretos' });
      } else {
        setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
      }
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* Pontos de luz/sombra mais intensos */}
      <div className="absolute top-32 left-20 w-8 h-8 bg-purple-700/40 rounded-full blur-xl"></div>
      <div className="absolute top-64 right-32 w-12 h-12 bg-purple-600/50 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-1/3 w-10 h-10 bg-purple-800/60 rounded-full blur-xl"></div>
      
      {/* Efeito de grade sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <h1 className="text-4xl font-bold text-white">Entrar</h1>
          </div>

          {/* Card de Login */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-red-200">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  <Mail className="w-4 h-4 inline mr-1 text-purple-300" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-300/50 ${
                    errors.email ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <span className="text-red-300 text-sm mt-1">{errors.email}</span>
                )}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  <Lock className="w-4 h-4 inline mr-1 text-purple-300" />
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

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:from-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </>
                )}
              </button>

              {/* Divisor */}
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="flex-shrink mx-4 text-purple-300 text-sm">ou</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              {/* Cadastro */}
              <div className="text-center">
                <p className="text-purple-300">
                  Não tem uma conta?{' '}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/usuario/create');
                    }}
                    className="text-purple-200 hover:text-white font-semibold transition-colors duration-200"
                  >
                    Cadastre-se
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 text-center">
            <p className="text-purple-300 text-sm">
              Ao entrar, você concorda com nossos{' '}
              <a href="#" className="text-purple-200 hover:text-white underline">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-purple-200 hover:text-white underline">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;