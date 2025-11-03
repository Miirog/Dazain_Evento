import { useState } from 'react'
import axios from 'axios'
import './Form.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Função auxiliar para normalizar telefone (remover caracteres não numéricos)
function normalizeTelefone(telefone) {
  if (!telefone) return ''
  return telefone.replace(/\D/g, '')
}

function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validação básica
    if (!formData.nome || !formData.email || !formData.telefone || !formData.empresa) {
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido.')
      setLoading(false)
      return
    }

    try {
      // Normalizar telefone antes de enviar
      const telefoneNormalizado = normalizeTelefone(formData.telefone)
      const dadosParaEnviar = {
        ...formData,
        telefone: telefoneNormalizado
      }
      await axios.post(`${API_URL}/submit`, dadosParaEnviar)
      onSubmit(telefoneNormalizado)
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Erro ao enviar formulário. Tente novamente mais tarde.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Seu nome completo"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefone">Telefone *</label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="empresa">Nome da Empresa *</label>
        <input
          type="text"
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          placeholder="Nome da sua empresa"
          required
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

export default Form


