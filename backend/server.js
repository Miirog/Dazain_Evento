import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { submitToSheets, getMedalhasByTelefone, addMedalhaToUser, getPontosByTelefone, addPontosToUser, getMaiorPontuacao, getUsuarioByTelefone, updateBrindesResgatados } from './services/sheetsService.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist')
  app.use(express.static(frontendPath))
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' })
})

// Endpoint para receber dados do formulário
app.post('/api/submit', async (req, res) => {
  try {
    const { nome, email, telefone, empresa } = req.body

    // Validação
    if (!nome || !email || !telefone || !empresa) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios'
      })
    }

    // Salvar no Google Sheets
    await submitToSheets({ nome, email, telefone, empresa })

    res.json({
      success: true,
      message: 'Dados salvos com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao processar formulário:', error)
    res.status(500).json({
      message: 'Erro ao salvar dados. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// Endpoint para buscar dados completos do usuário
app.get('/api/usuarios/:telefone', async (req, res) => {
  try {
    const { telefone } = req.params

    if (!telefone) {
      return res.status(400).json({
        message: 'Telefone é obrigatório'
      })
    }

    const usuario = await getUsuarioByTelefone(telefone)

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuário não encontrado'
      })
    }

    res.json({
      success: true,
      usuario
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({
      message: 'Erro ao buscar usuário. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// Endpoint para atualizar brindes resgatados de um usuário
app.post('/api/usuarios/:telefone/brindes', async (req, res) => {
  try {
    const { telefone } = req.params
    const { brindesResgatados } = req.body

    if (!telefone) {
      return res.status(400).json({
        message: 'Telefone é obrigatório'
      })
    }

    if (!brindesResgatados || typeof brindesResgatados !== 'object') {
      return res.status(400).json({
        message: 'Brindes resgatados são obrigatórios'
      })
    }

    const usuarioAtualizado = await updateBrindesResgatados({ telefone, brindesResgatados })

    res.json({
      success: true,
      usuario: usuarioAtualizado
    })
  } catch (error) {
    console.error('Erro ao atualizar brindes resgatados:', error)
    res.status(500).json({
      message: error.message || 'Erro ao atualizar brindes. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// ==================== NOVOS ENDPOINTS DE PONTOS ====================

// Endpoint para buscar a maior pontuação total (DEVE VIR ANTES DE /api/pontos/:telefone)
app.get('/api/pontos/maior', async (req, res) => {
  try {
    const result = await getMaiorPontuacao()

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erro ao buscar maior pontuação:', error)
    res.status(500).json({
      message: 'Erro ao buscar maior pontuação. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// Endpoint para buscar pontos de um usuário
app.get('/api/pontos/:telefone', async (req, res) => {
  try {
    const { telefone } = req.params

    if (!telefone) {
      return res.status(400).json({
        message: 'Telefone é obrigatório'
      })
    }

    const pontosData = await getPontosByTelefone(telefone)

    res.json({
      success: true,
      ...pontosData
    })
  } catch (error) {
    console.error('Erro ao buscar pontos:', error)
    res.status(500).json({
      message: 'Erro ao buscar pontos. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// Endpoint para adicionar/atualizar pontos de uma ativação
app.post('/api/pontos', async (req, res) => {
  try {
    const { telefone, ativacaoId, pontos } = req.body

    // Validação
    if (!telefone || ativacaoId === undefined || pontos === undefined) {
      return res.status(400).json({
        message: 'Telefone, Ativação e Pontos são obrigatórios'
      })
    }

    const result = await addPontosToUser({ telefone, ativacaoId, pontos })

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Erro ao adicionar pontos:', error)
    res.status(500).json({
      message: error.message || 'Erro ao adicionar pontos. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// ==================== ENDPOINTS ANTIGOS (COMPATIBILIDADE) ====================

// Endpoint para buscar medalhas de um usuário (DEPRECATED - usar /api/pontos)
app.get('/api/medalhas/:telefone', async (req, res) => {
  try {
    const { telefone } = req.params

    if (!telefone) {
      return res.status(400).json({
        message: 'Telefone é obrigatório'
      })
    }

    const medalhas = await getMedalhasByTelefone(telefone)

    res.json({
      success: true,
      medalhas
    })
  } catch (error) {
    console.error('Erro ao buscar medalhas:', error)
    res.status(500).json({
      message: 'Erro ao buscar medalhas. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// Endpoint para adicionar medalha a um usuário (DEPRECATED - usar /api/pontos)
app.post('/api/medalhas', async (req, res) => {
  try {
    const { telefone, medalhaId } = req.body

    // Validação
    if (!telefone || medalhaId === undefined) {
      return res.status(400).json({
        message: 'Telefone e Medalha são obrigatórios'
      })
    }

    await addMedalhaToUser({ telefone, medalhaId })

    res.json({
      success: true,
      message: 'Medalha adicionada com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao adicionar medalha:', error)
    res.status(500).json({
      message: error.message || 'Erro ao adicionar medalha. Tente novamente mais tarde.',
      error: error.message
    })
  }
})

// Rota para servir o frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const frontendPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html')
    res.sendFile(frontendPath)
  })
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
  if (process.env.NODE_ENV === 'production') {
    console.log(`Frontend sendo servido estaticamente`)
  }
})

