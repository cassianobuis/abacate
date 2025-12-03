"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Save,
  X
} from 'lucide-react';
const UsuariosPage = () => {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: '',
    dataNascimento: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/usuario');
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar usuários');
      setLoading(false);
      console.error('Erro:', err);
    }
  };

  const handleEditUser = (usuario) => {
    setEditingUser(usuario);
    setEditForm({
      nome: usuario.nome || '',
      email: usuario.email || '',
      telefone: usuario.telefone || '',
      tipo: usuario.tipo || 'USUARIO',
      dataNascimento: usuario.dataNascimento || ''
    });
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa erro do campo quando usuário começa a digitar
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEditForm = () => {
    const errors = {};
    
    if (!editForm.nome.trim()) {
      errors.nome = 'O nome é obrigatório';
    } else if (editForm.nome.length < 3) {
      errors.nome = 'O nome deve ter no mínimo 3 caracteres';
    }

    if (!editForm.email.trim()) {
      errors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Email inválido';
    }

    if (!editForm.telefone.trim()) {
      errors.telefone = 'O telefone é obrigatório';
    }

    if (!editForm.tipo) {
      errors.tipo = 'O tipo é obrigatório';
    }

    if (!editForm.dataNascimento) {
      errors.dataNascimento = 'A data de nascimento é obrigatória';
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return;
    }

    setEditLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/usuario/${editingUser.id}`,
        editForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Atualiza a lista localmente
        setUsuarios(usuarios.map(user => 
          user.id === editingUser.id ? { ...user, ...editForm } : user
        ));
        
        // Fecha o modal de edição
        setEditingUser(null);
        setEditForm({
          nome: '',
          email: '',
          telefone: '',
          tipo: '',
          dataNascimento: ''
        });
        
        alert('Usuário atualizado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      
      if (err.response?.status === 400 && err.response.data?.errors) {
        setEditErrors(err.response.data.errors);
      } else {
        alert('Erro ao atualizar usuário. Tente novamente.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    setDeleteConfirm({ id: userId, name: userName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/v1/usuario/${deleteConfirm.id}`);
      
      // Atualiza a lista localmente
      setUsuarios(usuarios.filter(user => user.id !== deleteConfirm.id));
      
      // Mostra mensagem de sucesso
      alert(`Usuário "${deleteConfirm.name}" excluído com sucesso!`);
      
      // Fecha o modal de confirmação
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      alert('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtrar usuários
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cpf?.includes(searchTerm) ||
      false;
    
    const matchesFilter = !filterTipo || usuario.tipo === filterTipo;
    
    return matchesSearch && matchesFilter;
  });

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'ADMINISTRADOR': return 'bg-red-500/20 text-red-800 border-red-500/30';
      case 'CLIENTE': return 'bg-blue-500/20 text-blue-800 border-blue-500/30';
      case 'ORGANIZADOR': return 'bg-green-500/20 text-green-800 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-800 border-gray-500/30';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'ADMINISTRADOR': return 'Administrador';
      case 'CLIENTE': return 'Organizador';
      case 'ORGANIZADOR': return 'Usuário';
      default: return tipo;
    }
  };

  const formatCPF = (cpf) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Não informado';
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center">
       
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 flex items-center justify-center">

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center border border-white/20">
          <p className="text-white text-xl">{error}</p>
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
      
      <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-white/10">
                  <Users className="w-8 h-8 text-purple-300" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Lista de Usuários</h1>
                  <p className="text-purple-300">
                    {filteredUsuarios.length} usuário{filteredUsuarios.length !== 1 ? 's' : ''} encontrado{filteredUsuarios.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Busca */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  <Search className="w-4 h-4 inline mr-2 text-purple-300" />
                  Buscar usuário
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-500"
                  placeholder="Nome, email ou CPF..."
                />
              </div>

              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  <Filter className="w-4 h-4 inline mr-2 text-purple-300" />
                  Filtrar por tipo
                </label>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-black"
                >
                  <option value="" className="text-gray-700">Todos os tipos</option>
                  <option value="ADMIN" className="text-black">Administrador</option>
                  <option value="ORGANIZADOR" className="text-black">Organizador</option>
                  <option value="USUARIO" className="text-black">Usuário</option>
                </select>
              </div>

              {/* Estatísticas */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm">Total de usuários</p>
                    <p className="text-2xl font-bold text-white">{usuarios.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                      <p className="text-xs text-purple-300">
                        {usuarios.filter(u => u.tipo === 'ADMIN').length} Admin
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                      <p className="text-xs text-purple-300">
                        {usuarios.filter(u => u.tipo === 'ORGANIZADOR').length} Org
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                      <p className="text-xs text-purple-300">
                        {usuarios.filter(u => u.tipo === 'USUARIO').length} User
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                {/* Header do Card */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                        <User className="w-6 h-6 text-purple-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{usuario.nome}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTipoColor(usuario.tipo)}`}>
                          {getTipoLabel(usuario.tipo)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditUser(usuario)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 border border-white/10"
                      >
                        <Edit className="w-4 h-4 text-purple-300" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(usuario.id, usuario.nome)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors duration-200 border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações do Usuário */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-purple-200">
                      <Mail className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm text-purple-300">Email</p>
                        <p className="text-white truncate">{usuario.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-purple-200">
                      <Shield className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-purple-300">CPF</p>
                        <p className="text-white">{formatCPF(usuario.cpf)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-purple-200">
                      <Phone className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-purple-300">Telefone</p>
                        <p className="text-white">{formatPhone(usuario.telefone)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-purple-200">
                      <Calendar className="w-4 h-4 text-purple-300 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-purple-300">Data de Nascimento</p>
                        <p className="text-white">{usuario.dataNascimento}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem quando não há usuários */}
          {filteredUsuarios.length === 0 && (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Users className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-purple-200 text-xl">
                {searchTerm || filterTipo ? 'Nenhum usuário encontrado com os filtros aplicados.' : 'Nenhum usuário cadastrado.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição de Usuário */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Edit className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Editar Usuário</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={editForm.nome}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                    editErrors.nome ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Digite o nome"
                />
                {editErrors.nome && (
                  <span className="text-red-300 text-sm mt-1">{editErrors.nome}</span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                    editErrors.email ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Digite o email"
                />
                {editErrors.email && (
                  <span className="text-red-300 text-sm mt-1">{editErrors.email}</span>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={editForm.telefone}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                    editErrors.telefone ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Digite o telefone"
                />
                {editErrors.telefone && (
                  <span className="text-red-300 text-sm mt-1">{editErrors.telefone}</span>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Tipo de Usuário *
                </label>
                <select
                  name="tipo"
                  value={editForm.tipo}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-3 bg-white/90 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-black ${
                    editErrors.tipo ? 'border-red-400/50' : 'border-white/20'
                  }`}
                >
                  <option value="" className="text-gray-500">Selecione um tipo</option>
                  <option value="ADMINISTRADOR" className="text-black">Administrador</option>
                  <option value="ORGANIZADOR" className="text-black">Organizador</option>
                  <option value="USUARIO" className="text-black">Usuário</option>
                </select>
                {editErrors.tipo && (
                  <span className="text-red-300 text-sm mt-1">{editErrors.tipo}</span>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={editForm.dataNascimento}
                  onChange={handleEditChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white ${
                    editErrors.dataNascimento ? 'border-red-400/50' : 'border-white/20'
                  }`}
                />
                {editErrors.dataNascimento && (
                  <span className="text-red-300 text-sm mt-1">{editErrors.dataNascimento}</span>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                disabled={editLoading}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors duration-200 border border-white/20 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-purple-200 mb-6">
              Tem certeza que deseja excluir o usuário <span className="font-bold text-white">"{deleteConfirm.name}"</span>? 
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-colors duration-200 border border-white/20 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;