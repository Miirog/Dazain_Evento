import { useState, useEffect } from 'react'
import axios from 'axios'
import './Admin.css'
import { BRINDES_INFO, BRINDE_IDS } from '../constants/brindes'
import { ATIVACOES_INFO, ATIVACAO_IDS, getNomeAtivacao } from '../constants/ativacoes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
function normalizeTelefone(telefone) {
  if (!telefone) return ''
  return telefone.replace(/\D/g, '')
}

const defaultBrindesState = () =>
  BRINDE_IDS.reduce((acc, id) => {
    acc[id] = false
    return acc
  }, {})

const defaultPontosState = () =>
  ATIVACAO_IDS.reduce((acc, id) => {
    acc[id] = 0
    return acc
  }, {})

function Admin() {
  const [telefone, setTelefone] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [brindesResgatados, setBrindesResgatados] = useState(() => defaultBrindesState())
  const [salvandoBrindes, setSalvandoBrindes] = useState(false)
  const [brindesFeedback, setBrindesFeedback] = useState('')
  const [brindesErro, setBrindesErro] = useState('')
  const [pontosEdicao, setPontosEdicao] = useState(() => defaultPontosState())
  const [salvandoPontos, setSalvandoPontos] = useState(false)
  const [pontosFeedback, setPontosFeedback] = useState('')
  const [pontosErro, setPontosErro] = useState('')

  useEffect(() => {
    if (usuario?.brindesResgatados) {
      const base = defaultBrindesState()
      setBrindesResgatados({ ...base, ...usuario.brindesResgatados })
    } else {
      setBrindesResgatados(defaultBrindesState())
    }
    if (usuario?.pontos) {
      setPontosEdicao({ ...defaultPontosState(), ...usuario.pontos })
    } else {
      setPontosEdicao(defaultPontosState())
    }
    setPontosFeedback('')
    setPontosErro('')
  }, [usuario])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const telefoneNormalizado = normalizeTelefone(telefone)

    if (!telefoneNormalizado) {
      setError('Informe um telefone válido.')
      setUsuario(null)
      setHasSearched(true)
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)
    setBrindesFeedback('')
    setBrindesErro('')
    setPontosFeedback('')
    setPontosErro('')
    setUsuario(null)

    try {
      const response = await axios.get(`${API_URL}/usuarios/${telefoneNormalizado}`)
      setUsuario(response.data.usuario)
      setError('')
    } catch (err) {
      setUsuario(null)
      if (err.response?.status === 404) {
        setError('Usuário não encontrado.')
      } else {
        setError(err.response?.data?.message || 'Erro ao buscar usuário. Tente novamente.')
      }
      setBrindesResgatados(defaultBrindesState())
      setBrindesFeedback('')
      setBrindesErro('')
      setPontosEdicao(defaultPontosState())
      setPontosFeedback('')
      setPontosErro('')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBrinde = (brindeId) => {
    setBrindesResgatados((prev) => ({
      ...prev,
      [brindeId]: !prev[brindeId]
    }))
    setBrindesFeedback('')
    setBrindesErro('')
  }

  const handleChangePontos = (ativacaoId, value) => {
    setPontosEdicao((prev) => ({
      ...prev,
      [ativacaoId]: value === '' ? '' : Math.max(0, Math.floor(Number(value) || 0))
    }))
    setPontosFeedback('')
    setPontosErro('')
  }

  const handleSalvarBrindes = async () => {
    if (!usuario) return
    setSalvandoBrindes(true)
    setBrindesFeedback('')
    setBrindesErro('')
    try {
      const response = await axios.post(`${API_URL}/usuarios/${usuario.telefone}/brindes`, {
        brindesResgatados
      })
      setUsuario(response.data.usuario)
      setBrindesFeedback('Status dos brindes atualizado com sucesso!')
    } catch (err) {
      if (err.response?.status === 404) {
        setBrindesErro('Usuário não encontrado.')
      } else {
        setBrindesErro(err.response?.data?.message || 'Erro ao atualizar brindes. Tente novamente.')
      }
    } finally {
      setSalvandoBrindes(false)
    }
  }

  const handleSalvarPontos = async () => {
    if (!usuario) return
    setSalvandoPontos(true)
    setPontosFeedback('')
    setPontosErro('')
    try {
      const payload = ATIVACAO_IDS.reduce((acc, id) => {
        const valor = pontosEdicao[id]
        acc[id] = valor === '' ? 0 : Math.max(0, Math.floor(Number(valor) || 0))
        return acc
      }, {})

      const response = await axios.post(`${API_URL}/usuarios/${usuario.telefone}/pontos`, {
        pontos: payload
      })
      setUsuario(response.data.usuario)
      setPontosFeedback('Pontuação atualizada com sucesso!')
    } catch (err) {
      if (err.response?.status === 404) {
        setPontosErro('Usuário não encontrado.')
      } else {
        setPontosErro(err.response?.data?.message || 'Erro ao atualizar pontos. Tente novamente.')
      }
    } finally {
      setSalvandoPontos(false)
    }
  }

  const totalEditado = ATIVACAO_IDS.reduce((acc, id) => {
    const valor = pontosEdicao[id]
    return acc + (valor === '' ? 0 : Number(valor) || 0)
  }, 0)

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Painel Secreto</h1>
        <p className="admin-subtitle">
          Consulte os dados de um participante informando o telefone cadastrado.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label htmlFor="telefone" className="admin-label">
            Telefone do usuário
          </label>
          <div className="admin-input-group">
            <input
              type="tel"
              id="telefone"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {usuario && (
          <div className="admin-result">
            <section className="admin-card">
              <h2>Informações</h2>
              <dl>
                <div>
                  <dt>Nome</dt>
                  <dd>{usuario.nome || '—'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{usuario.email || '—'}</dd>
                </div>
                <div>
                  <dt>Telefone</dt>
                  <dd>{usuario.telefone || '—'}</dd>
                </div>
                <div>
                  <dt>Empresa</dt>
                  <dd>{usuario.empresa || '—'}</dd>
                </div>
              </dl>
            </section>

            <section className="admin-card">
              <h2>Pontuação</h2>
              <div className="admin-total">
                <span>Total</span>
                <strong>{totalEditado.toLocaleString('pt-BR')}</strong>
              </div>
              <div className="admin-pontos-list">
                {ATIVACAO_IDS.map((ativacaoId) => (
                  <label key={ativacaoId} className="admin-pontos-item">
                    <span>{getNomeAtivacao(ativacaoId)}</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pontosEdicao[ativacaoId]}
                      onChange={(event) => handleChangePontos(ativacaoId, event.target.value)}
                      disabled={salvandoPontos}
                    />
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="admin-save-pontos"
                onClick={handleSalvarPontos}
                disabled={salvandoPontos}
              >
                {salvandoPontos ? 'Salvando...' : 'Salvar pontuação'}
              </button>
              {pontosFeedback && (
                <div className="admin-feedback sucesso">
                  {pontosFeedback}
                </div>
              )}
              {pontosErro && (
                <div className="admin-feedback erro">
                  {pontosErro}
                </div>
              )}
            </section>

            <section className="admin-card">
              <h2>Brindes resgatados</h2>
              <div className="admin-brindes-grid">
                {BRINDE_IDS.map((id) => {
                  const info = BRINDES_INFO[id]
                  const checked = Boolean(brindesResgatados[id])
                  return (
                    <label
                      key={id}
                      className={`admin-brinde-item ${checked ? 'ativo' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleBrinde(id)}
                        disabled={salvandoBrindes}
                      />
                      <span className="admin-brinde-indicador" style={{ borderColor: info.cor }}>
                        <span
                          className="admin-brinde-ponto"
                          style={{ backgroundColor: checked ? info.cor : 'transparent' }}
                        />
                      </span>
                      <span className="admin-brinde-dados">
                        <strong>{info.nome}</strong>
                        <small>{info.descricao}</small>
                      </span>
                    </label>
                  )
                })}
              </div>
              <button
                type="button"
                className="admin-save-brindes"
                onClick={handleSalvarBrindes}
                disabled={salvandoBrindes}
              >
                {salvandoBrindes ? 'Salvando...' : 'Salvar alterações'}
              </button>
              {brindesFeedback && (
                <div className="admin-feedback sucesso">
                  {brindesFeedback}
                </div>
              )}
              {brindesErro && (
                <div className="admin-feedback erro">
                  {brindesErro}
                </div>
              )}
            </section>
          </div>
        )}

        {!usuario && !error && hasSearched && !loading && (
          <div className="admin-empty">
            Nenhum resultado para o telefone informado.
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin


