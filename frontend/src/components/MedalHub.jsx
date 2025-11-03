import { useState, useEffect } from 'react'
import axios from 'axios'
import './MedalHub.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Nomes e descrições das medalhas
const MEDALHAS_INFO = {
  1: { nome: 'Pioneiro', descricao: 'Primeira conquista!', cor: '#FFD700' },
  2: { nome: 'Explorador', descricao: 'Descobrindo o caminho', cor: '#C0C0C0' },
  3: { nome: 'Conquistador', descricao: 'Meio caminho andado', cor: '#CD7F32' },
  4: { nome: 'Mestre', descricao: 'Quase lá!', cor: '#9370DB' },
  5: { nome: 'Lenda', descricao: 'Completo!', cor: '#FF1493' }
}

function MedalHub({ telefone }) {
  const [medalhasUsuario, setMedalhasUsuario] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (telefone) {
      fetchMedalhas()
    }
  }, [telefone])

  const fetchMedalhas = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/medalhas/${telefone}`)
      setMedalhasUsuario(response.data.medalhas)
      setError('')
    } catch (err) {
      console.error('Erro ao buscar medalhas:', err)
      setError('Erro ao carregar medalhas')
    } finally {
      setLoading(false)
    }
  }

  const renderMedalha = (medalhaId) => {
    const info = MEDALHAS_INFO[medalhaId]
    const possui = medalhasUsuario.includes(medalhaId)
    
    return (
      <div 
        key={medalhaId} 
        className={`medalha-card ${possui ? 'conquistada' : 'bloqueada'}`}
        style={possui ? { borderColor: info.cor } : {}}
      >
        <div 
          className="medalha-icon"
          style={possui ? { color: info.cor } : {}}
        >
          {possui ? '🏆' : '🔒'}
        </div>
        <h3 className="medalha-nome">{info.nome}</h3>
        <p className="medalha-descricao">{info.descricao}</p>
        {possui && (
          <div className="badge-conquistada" style={{ backgroundColor: info.cor }}>
            Conquistada!
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="medal-hub">
        <div className="loading-spinner">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="medal-hub">
      <h2 className="hub-title">Suas Medalhas</h2>
      <p className="hub-subtitle">
        Você conquistou {medalhasUsuario.length} de {Object.keys(MEDALHAS_INFO).length} medalhas
      </p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="medalhas-grid">
        {Object.keys(MEDALHAS_INFO).map(id => renderMedalha(parseInt(id)))}
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(medalhasUsuario.length / Object.keys(MEDALHAS_INFO).length) * 100}%` 
            }}
          />
        </div>
        <span className="progress-text">
          {Math.round((medalhasUsuario.length / Object.keys(MEDALHAS_INFO).length) * 100)}% Completo
        </span>
      </div>
    </div>
  )
}

export default MedalHub

