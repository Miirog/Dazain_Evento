import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

// Função auxiliar para normalizar telefone (remover caracteres não numéricos)
function normalizeTelefone(telefone) {
  if (!telefone) return ''
  return telefone.replace(/\D/g, '')
}

// Configurar autenticação do Google Sheets
const getAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })
  
  return await auth.getClient()
}

// Função auxiliar para criar uma aba se não existir
async function ensureSheetExists(sheets, spreadsheetId, sheetTitle) {
  try {
    // Verificar se a aba existe
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const sheetExists = spreadsheet.data.sheets.some(sheet => sheet.properties.title === sheetTitle)
    
    if (!sheetExists) {
      // Criar a aba
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetTitle
              }
            }
          }]
        }
      })
      console.log(`Aba "${sheetTitle}" criada com sucesso`)
    }
  } catch (error) {
    console.error(`Erro ao garantir existência da aba "${sheetTitle}":`, error)
    // Não lançar erro para não bloquear a operação principal
  }
}

export async function submitToSheets({ nome, email, telefone, empresa }) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Usuarios!A:J' // Atualizado para incluir coluna J (PontosTotal)

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  // Normalizar telefone para ter apenas números
  const telefoneNormalizado = normalizeTelefone(telefone)

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  // Garantir que a aba Usuarios existe
  await ensureSheetExists(sheets, spreadsheetId, 'Usuarios')

  // Primeiro, vamos verificar se o cabeçalho existe
  try {
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Usuarios!A1:J1'
    })

    // Se não houver cabeçalho, adiciona
    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Usuarios!A1:J1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Nome', 'Email', 'Telefone', 'Empresa', 'PontosAtivacao1', 'PontosAtivacao2', 'PontosAtivacao3', 'PontosAtivacao4', 'PontosAtivacao5', 'PontosTotal']]
        }
      })
    }
  } catch (error) {
    console.error('Erro ao verificar/criar cabeçalho:', error)
    // Se erro for 400, a aba não existe ainda, tentar novamente após um delay
    if (error.code === 400) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Usuarios!A1:J1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Nome', 'Email', 'Telefone', 'Empresa', 'PontosAtivacao1', 'PontosAtivacao2', 'PontosAtivacao3', 'PontosAtivacao4', 'PontosAtivacao5', 'PontosTotal']]
        }
      })
    } else {
      throw error
    }
  }

  // Verificar se usuário já existe
  const allData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Usuarios!A:J'
  })

  const rows = allData.data.values || []
  
  // Procurar pelo telefone na coluna C (índice 2)
  const existingUserIndex = rows.findIndex((row, index) => index > 0 && normalizeTelefone(row[2]) === telefoneNormalizado)

  if (existingUserIndex !== -1) {
    // Usuário existe, atualizar informações básicas (nome, email, empresa)
    const rowNumber = existingUserIndex + 1
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Usuarios!A${rowNumber}:D${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nome, email, telefoneNormalizado, empresa]]
      }
    })
  } else {
    // Usuário não existe, adicionar nova linha com pontos zerados
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nome, email, telefoneNormalizado, empresa, 0, 0, 0, 0, 0, 0]]
      }
    })
  }
}

// Função para buscar pontos de um usuário pelo telefone
export async function getPontosByTelefone(telefone) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Usuarios!A:J'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  // Normalizar telefone para ter apenas números
  const telefoneNormalizado = normalizeTelefone(telefone)

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  try {
    // Buscar todos os usuários
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })

    const rows = response.data.values || []
    
    if (rows.length <= 1) {
      // Apenas cabeçalho ou sem dados
      return { pontos: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0 }
    }

    // Procurar pelo telefone na coluna C (índice 2)
    const userRow = rows.slice(1).find(row => normalizeTelefone(row[2]) === telefoneNormalizado)
    
    if (!userRow) {
      return { pontos: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, total: 0 }
    }

    // Colunas de pontos são E, F, G, H, I (índices 4, 5, 6, 7, 8)
    // Coluna J (índice 9) é o total
    const pontos = {
      1: parseInt(userRow[4] || '0') || 0,
      2: parseInt(userRow[5] || '0') || 0,
      3: parseInt(userRow[6] || '0') || 0,
      4: parseInt(userRow[7] || '0') || 0,
      5: parseInt(userRow[8] || '0') || 0
    }
    
    // Total pode estar na coluna J ou calcular
    const total = parseInt(userRow[9] || '0') || (pontos[1] + pontos[2] + pontos[3] + pontos[4] + pontos[5])
    
    return { pontos, total }
  } catch (error) {
    console.error('Erro ao buscar pontos:', error)
    throw error
  }
}

// Função para buscar a maior pontuação total de todos os usuários
export async function getMaiorPontuacao() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Usuarios!A:J'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  try {
    // Buscar todos os usuários
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })

    const rows = response.data.values || []
    
    if (rows.length <= 1) {
      // Apenas cabeçalho ou sem dados
      return { maiorPontuacao: 1000 } // Valor padrão mínimo
    }

    // Procurar a maior pontuação total (coluna J - índice 9)
    let maiorPontuacao = 1000 // Valor padrão mínimo (para o brinde 6)

    rows.slice(1).forEach(row => {
      // Coluna J (índice 9) é o total
      let total = parseInt(row[9] || '0') || 0
      
      // Se não tiver total calculado, calcular a partir dos pontos individuais
      if (total === 0 && row.length > 9) {
        const pontos = {
          1: parseInt(row[4] || '0') || 0,
          2: parseInt(row[5] || '0') || 0,
          3: parseInt(row[6] || '0') || 0,
          4: parseInt(row[7] || '0') || 0,
          5: parseInt(row[8] || '0') || 0
        }
        total = pontos[1] + pontos[2] + pontos[3] + pontos[4] + pontos[5]
      }
      
      if (total > maiorPontuacao) {
        maiorPontuacao = total
      }
    })
    
    // Se não encontrou nenhum usuário com mais de 1000 pontos, retorna 1000
    return { maiorPontuacao: maiorPontuacao < 1000 ? 1000 : maiorPontuacao }
  } catch (error) {
    console.error('Erro ao buscar maior pontuação:', error)
    throw error
  }
}

// Função para adicionar/atualizar pontos de uma ativação
export async function addPontosToUser({ telefone, ativacaoId, pontos }) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Usuarios!A:J'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  if (!telefone || ativacaoId === undefined || pontos === undefined) {
    throw new Error('Telefone, Ativação e Pontos são obrigatórios')
  }

  if (ativacaoId < 1 || ativacaoId > 5) {
    throw new Error('ID da ativação deve ser entre 1 e 5')
  }

  if (typeof pontos !== 'number' || pontos < 0) {
    throw new Error('Pontos deve ser um número positivo')
  }

  // Normalizar telefone para ter apenas números
  const telefoneNormalizado = normalizeTelefone(telefone)

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  try {
    // Buscar pontos atuais do usuário
    const pontosAtuais = await getPontosByTelefone(telefoneNormalizado)
    const pontosAtivacaoAtual = pontosAtuais.pontos[ativacaoId] || 0

    // Só atualizar se os novos pontos forem maiores
    if (pontos <= pontosAtivacaoAtual) {
      return { 
        success: true, 
        message: 'Pontos não atualizados. Valor atual é maior ou igual.',
        pontosAtuais: pontosAtuais.pontos,
        total: pontosAtuais.total
      }
    }

    // Buscar todos os usuários para encontrar a linha
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })

    const rows = response.data.values || []
    
    if (rows.length <= 1) {
      throw new Error('Usuário não encontrado')
    }

    // Procurar pelo telefone na coluna C (índice 2)
    const userRowIndex = rows.findIndex((row, index) => index > 0 && normalizeTelefone(row[2]) === telefoneNormalizado)
    
    if (userRowIndex === -1) {
      throw new Error('Usuário não encontrado')
    }

    const rowNumber = userRowIndex + 1
    // Coluna da ativação: E=5, F=6, G=7, H=8, I=9 (índices 4, 5, 6, 7, 8)
    const columnIndex = 4 + ativacaoId - 1 // E=4, F=5, etc.
    const columnLetter = String.fromCharCode(69 + ativacaoId - 1) // E=69, F=70, etc.
    
    // Atualizar os pontos da ativação
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Usuarios!${columnLetter}${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[pontos]]
      }
    })

    // Recalcular o total
    const novosPontos = { ...pontosAtuais.pontos, [ativacaoId]: pontos }
    const novoTotal = novosPontos[1] + novosPontos[2] + novosPontos[3] + novosPontos[4] + novosPontos[5]

    // Atualizar a coluna de total (J)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Usuarios!J${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[novoTotal]]
      }
    })

    return { 
      success: true, 
      message: 'Pontos atualizados com sucesso!',
      pontos: novosPontos,
      total: novoTotal
    }
  } catch (error) {
    console.error('Erro ao adicionar pontos:', error)
    throw error
  }
}

// Manter função antiga para compatibilidade (retornando array vazio ou deprecada)
export async function getMedalhasByTelefone(telefone) {
  console.warn('getMedalhasByTelefone está deprecated. Use getPontosByTelefone.')
  const pontos = await getPontosByTelefone(telefone)
  // Converter pontos em "medalhas" baseado em pontuação (para compatibilidade)
  const medalhas = []
  for (let i = 1; i <= 5; i++) {
    if (pontos.pontos[i] > 0) {
      medalhas.push(i)
    }
  }
  return medalhas
}

// Manter função antiga para compatibilidade
export async function addMedalhaToUser({ telefone, medalhaId }) {
  console.warn('addMedalhaToUser está deprecated. Use addPontosToUser.')
  // Converter medalha em pontos (valores padrão)
  const pontosPorMedalha = { 1: 100, 2: 300, 3: 500, 4: 700, 5: 1000 }
  const pontos = pontosPorMedalha[medalhaId] || 100
  return await addPontosToUser({ telefone, ativacaoId: medalhaId, pontos })
}

