import { useState, useEffect } from 'react'
import axios from 'axios'
import './MedalHub.css'
import { BRINDES_INFO, BRINDE_IDS } from '../constants/brindes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const defaultBrindesState = () =>
  BRINDE_IDS.reduce((acc, id) => {
    acc[id] = false
    return acc
  }, {})

const initialRequisitosBrindes = BRINDE_IDS.reduce((acc, id) => {
  acc[id] = BRINDES_INFO[id].pontosRequisito
  return acc
}, {})

function MedalHub({ telefone }) {
  const [pontosUsuario, setPontosUsuario] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [pontosTotal, setPontosTotal] = useState(0)
  const [maiorPontuacao, setMaiorPontuacao] = useState(1000)
  const [requisitosBrindes, setRequisitosBrindes] = useState(initialRequisitosBrindes)
  const [brindesResgatados, setBrindesResgatados] = useState(() => defaultBrindesState())
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
      const brindes = response.data.brindesResgatados || defaultBrindesState()
      setPontosUsuario(pontos)
      setPontosTotal(total)
      setBrindesResgatados(() => {
        const base = defaultBrindesState()
        return { ...base, ...brindes }
      })
      setError('')
      
      // Salvar no localStorage
      localStorage.setItem(
        `pontos_${telefone}`,
        JSON.stringify({ pontos, total, brindesResgatados: brindes })
      )
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
      
      const ultimoBrindeId = BRINDE_IDS[BRINDE_IDS.length - 1]
      if (ultimoBrindeId) {
        setRequisitosBrindes(prev => ({
          ...prev,
          [ultimoBrindeId]: Math.max(BRINDES_INFO[ultimoBrindeId].pontosRequisito, maior)
        }))
      }
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
          const { pontos, total, brindesResgatados: brindes } = JSON.parse(cachedPontos)
          setPontosUsuario(pontos)
          setPontosTotal(total)
          setBrindesResgatados(() => {
            const base = defaultBrindesState()
            return { ...base, ...brindes }
          })
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
    const resgatado = Boolean(brindesResgatados[brindeId])
    
    return (
      <div 
        key={brindeId} 
        className={`medalha-card ${desbloqueado ? 'conquistada' : 'bloqueada'} ${resgatado ? 'resgatada' : ''}`}
        style={desbloqueado ? { borderColor: info.cor } : {}}
      >
        <div 
          className="medalha-icon"
          style={desbloqueado ? { color: info.cor } : {}}
        >
          {desbloqueado ? (resgatado ? '✅' : '🎁') : '🔒'}
        </div>
        <h3 className="medalha-nome">{info.nome}</h3>
        <p className="medalha-descricao">{info.descricao}</p>
        {!desbloqueado && (
          <div className="badge-bloqueada">
            {pontosRequisito} pontos necessários
          </div>
        )}
        {desbloqueado && !resgatado && (
          <div className="badge-disponivel" style={{ borderColor: info.cor, color: info.cor }}>
            Disponível para resgate
          </div>
        )}
        {desbloqueado && resgatado && (
          <div className="badge-resgatado" style={{ backgroundColor: info.cor }}>
            Brinde resgatado
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
  const brindesResgatadosCount = BRINDE_IDS.filter(id => Boolean(brindesResgatados[id])).length

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
        Você desbloqueou {brindesDesbloqueados} de {Object.keys(BRINDES_INFO).length} brindes e já resgatou {brindesResgatadosCount}.
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

