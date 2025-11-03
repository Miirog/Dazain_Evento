import { useState, useEffect } from 'react'
import axios from 'axios'
import './MedalHub.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Informações dos brindes
const BRINDES_INFO = {
  1: { nome: 'Brinde 1', descricao: 'Primeira conquista!', cor: '#FF007F', pontosRequisito: 100 },
  2: { nome: 'Brinde 2', descricao: 'Seguindo firme!', cor: '#39FF14', pontosRequisito: 400 },
  3: { nome: 'Brinde 3', descricao: 'Meio do caminho!', cor: '#3D026D', pontosRequisito: 600 },
  4: { nome: 'Brinde 4', descricao: 'Quase lá!', cor: '#FF007F', pontosRequisito: 800 },
  5: { nome: 'Brinde 5', descricao: 'Excelência alcançada!', cor: '#1E002B', pontosRequisito: 1000 },
  6: { nome: 'Brinde 6', descricao: 'Lenda absoluta!', cor: '#FFD700', pontosRequisito: 1000 } // Será atualizado dinamicamente
}

function MedalHub({ telefone }) {
  const [pontosUsuario, setPontosUsuario] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [pontosTotal, setPontosTotal] = useState(0)
  const [maiorPontuacao, setMaiorPontuacao] = useState(1000)
  const [requisitosBrindes, setRequisitosBrindes] = useState({
    1: 100,
    2: 400,
    3: 600,
    4: 800,
    5: 1000,
    6: 1000
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPontos = async (skipLoading = false) => {
    try {
      if (!skipLoading) {
        setLoading(true)
      }
      const response = await axios.get(`${API_URL}/pontos/${telefone}`)
      const pontos = response.data.pontos || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      const total = response.data.total || 0
      setPontosUsuario(pontos)
      setPontosTotal(total)
      setError('')
      
      // Salvar no localStorage
      localStorage.setItem(`pontos_${telefone}`, JSON.stringify({ pontos, total }))
    } catch (err) {
      console.error('Erro ao buscar pontos:', err)
      setError('Erro ao carregar pontos')
    } finally {
      setLoading(false)
    }
  }

  const fetchMaiorPontuacao = async () => {
    try {
      const response = await axios.get(`${API_URL}/pontos/maior`)
      const maior = response.data.maiorPontuacao || 1000
      setMaiorPontuacao(maior)
      
      // Atualizar o requisito do brinde 6
      setRequisitosBrindes(prev => ({
        ...prev,
        6: maior
      }))
    } catch (err) {
      console.error('Erro ao buscar maior pontuação:', err)
      // Usa valor padrão de 1000 se der erro
      setMaiorPontuacao(1000)
    }
  }

  useEffect(() => {
    if (telefone) {
      // Carregar do localStorage primeiro
      const cachedPontos = localStorage.getItem(`pontos_${telefone}`)
      if (cachedPontos) {
        try {
          const { pontos, total } = JSON.parse(cachedPontos)
          setPontosUsuario(pontos)
          setPontosTotal(total)
          // Não mostrar loading se já tiver cache
          fetchPontos(true)
        } catch (err) {
          console.error('Erro ao carregar pontos do cache:', err)
          fetchPontos()
        }
      } else {
        // Sem cache, buscar do servidor
        fetchPontos()
      }
      
      // Buscar maior pontuação para definir o brinde 6
      fetchMaiorPontuacao()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telefone])

  const renderBrinde = (brindeId) => {
    const info = BRINDES_INFO[brindeId]
    const pontosRequisito = requisitosBrindes[brindeId] || info.pontosRequisito
    const desbloqueado = pontosTotal >= pontosRequisito
    
    return (
      <div 
        key={brindeId} 
        className={`medalha-card ${desbloqueado ? 'conquistada' : 'bloqueada'}`}
        style={desbloqueado ? { borderColor: info.cor } : {}}
      >
        <div 
          className="medalha-icon"
          style={desbloqueado ? { color: info.cor } : {}}
        >
          {desbloqueado ? '🎁' : '🔒'}
        </div>
        <h3 className="medalha-nome">{info.nome}</h3>
        <p className="medalha-descricao">{info.descricao}</p>
        {desbloqueado ? (
          <div className="badge-conquistada" style={{ backgroundColor: info.cor }}>
            Desbloqueado!
          </div>
        ) : (
          <div className="badge-bloqueada">
            {pontosRequisito} pontos necessários
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

  const brindesDesbloqueados = Object.keys(BRINDES_INFO).filter(id => {
    const requisito = requisitosBrindes[id] || BRINDES_INFO[id].pontosRequisito
    return pontosTotal >= requisito
  }).length

  return (
    <div className="medal-hub">
      <div className="hub-title-container">
        <h2 className="hub-title">Seus Brindes</h2>
      </div>
      
      <div className="pontos-total-container">
        <div className="pontos-total-card">
          <div className="pontos-total-label">Pontos Totais</div>
          <div className="pontos-total-value">{pontosTotal.toLocaleString('pt-BR')}</div>
        </div>
      </div>

      <p className="hub-subtitle">
        Você desbloqueou {brindesDesbloqueados} de {Object.keys(BRINDES_INFO).length} brindes!
      </p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="medalhas-grid">
        {Object.keys(BRINDES_INFO).map(id => renderBrinde(parseInt(id)))}
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${Math.min((pontosTotal / maiorPontuacao) * 100, 100)}%` 
            }}
          />
        </div>
        <span className="progress-text">
          {Math.round((pontosTotal / maiorPontuacao) * 100)}% da pontuação máxima
        </span>
      </div>
      
      <div className="refresh-button-container">
        <button 
          onClick={() => {
            fetchPontos()
            fetchMaiorPontuacao()
          }} 
          disabled={loading}
          className="refresh-button"
          title="Recarregar pontos"
        >
          <span className="refresh-icon">{loading ? '⏳' : '🔄'}</span>
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  )
}

export default MedalHub

