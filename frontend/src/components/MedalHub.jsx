import { useState, useEffect } from 'react'
import axios from 'axios'
import './MedalHub.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Nomes e descrições das medalhas
const MEDALHAS_INFO = {
  1: { nome: 'Fotógrafo', descricao: 'Tirou uma foto com nosso mascote!', cor: '#FF007F' },
  2: { nome: 'Explorador', descricao: 'Encontrou todas as curiosidades!', cor: '#39FF14' },
  3: { nome: 'Ninja', descricao: 'Cortou todos os produtos falsos!', cor: '#3D026D' },
  4: { nome: 'Alpinista', descricao: 'Escalou a plataforma até o fim!', cor: '#FF007F' },
  5: { nome: 'Indomável', descricao: 'Escapou do nosso desafio!', cor: '#1E002B' }
}

function MedalHub({ telefone }) {
  const [medalhasUsuario, setMedalhasUsuario] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMedalhas = async (skipLoading = false) => {
    try {
      if (!skipLoading) {
        setLoading(true)
      }
      const response = await axios.get(`${API_URL}/medalhas/${telefone}`)
      const medalhas = response.data.medalhas
      setMedalhasUsuario(medalhas)
      setError('')
      
      // Salvar no localStorage
      localStorage.setItem(`medalhas_${telefone}`, JSON.stringify(medalhas))
    } catch (err) {
      console.error('Erro ao buscar medalhas:', err)
      setError('Erro ao carregar medalhas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (telefone) {
      // Carregar do localStorage primeiro
      const cachedMedalhas = localStorage.getItem(`medalhas_${telefone}`)
      if (cachedMedalhas) {
        try {
          const medalhas = JSON.parse(cachedMedalhas)
          setMedalhasUsuario(medalhas)
          // Não mostrar loading se já tiver cache
          fetchMedalhas(true)
        } catch (err) {
          console.error('Erro ao carregar medalhas do cache:', err)
          fetchMedalhas()
        }
      } else {
        // Sem cache, buscar do servidor
        fetchMedalhas()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telefone])

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
      <div className="hub-title-container">
        <h2 className="hub-title">Suas Medalhas</h2>
      </div>
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
      
      <div className="refresh-button-container">
        <button 
          onClick={fetchMedalhas} 
          disabled={loading}
          className="refresh-button"
          title="Recarregar medalhas"
        >
          <span className="refresh-icon">{loading ? '⏳' : '🔄'}</span>
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  )
}

export default MedalHub

