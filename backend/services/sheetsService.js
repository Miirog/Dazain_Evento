import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

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
  const range = 'Usuarios!A:I'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  // Garantir que a aba Usuarios existe
  await ensureSheetExists(sheets, spreadsheetId, 'Usuarios')

  // Primeiro, vamos verificar se o cabeçalho existe
  try {
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Usuarios!A1:I1'
    })

    // Se não houver cabeçalho, adiciona
    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Usuarios!A1:I1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Nome', 'Email', 'Telefone', 'Empresa', 'Medalha1', 'Medalha2', 'Medalha3', 'Medalha4', 'Medalha5']]
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
        range: 'Usuarios!A1:I1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Nome', 'Email', 'Telefone', 'Empresa', 'Medalha1', 'Medalha2', 'Medalha3', 'Medalha4', 'Medalha5']]
        }
      })
    } else {
      throw error
    }
  }

  // Verificar se usuário já existe
  const allData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Usuarios!A:I'
  })

  const rows = allData.data.values || []
  
  // Procurar pelo telefone na coluna C (índice 2)
  const existingUserIndex = rows.findIndex((row, index) => index > 0 && row[2] === telefone)

  if (existingUserIndex !== -1) {
    // Usuário existe, atualizar informações básicas (nome, email, empresa)
    const rowNumber = existingUserIndex + 1
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Usuarios!A${rowNumber}:D${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nome, email, telefone, empresa]]
      }
    })
  } else {
    // Usuário não existe, adicionar nova linha
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[nome, email, telefone, empresa, '', '', '', '', '']]
      }
    })
  }
}

// Função para buscar medalhas de um usuário pelo telefone
export async function getMedalhasByTelefone(telefone) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Usuarios!A:I'

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
      return []
    }

    // Procurar pelo telefone na coluna C (índice 2)
    const userRow = rows.slice(1).find(row => row[2] === telefone)
    
    if (!userRow) {
      return []
    }

    // Colunas de medalhas são E, F, G, H, I (índices 4, 5, 6, 7, 8)
    const medalhas = []
    for (let i = 4; i <= 8; i++) {
      if (userRow[i] && userRow[i].trim() !== '') {
        medalhas.push(i - 3) // Converter índice para número da medalha (1-5)
      }
    }
    
    return medalhas
  } catch (error) {
    console.error('Erro ao buscar medalhas:', error)
    throw error
  }
}

// Função para adicionar uma medalha a um usuário
export async function addMedalhaToUser({ telefone, medalhaId }) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Usuarios!A:I'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  if (!telefone || medalhaId === undefined) {
    throw new Error('Telefone e Medalha são obrigatórios')
  }

  if (medalhaId < 1 || medalhaId > 5) {
    throw new Error('ID da medalha deve ser entre 1 e 5')
  }

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  try {
    // Verificar se o usuário existe e já tem essa medalha
    const medalhasExistentes = await getMedalhasByTelefone(telefone)
    if (medalhasExistentes.includes(medalhaId)) {
      throw new Error('Usuário já possui esta medalha')
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
    const userRowIndex = rows.findIndex((row, index) => index > 0 && row[2] === telefone)
    
    if (userRowIndex === -1) {
      throw new Error('Usuário não encontrado')
    }

    const rowNumber = userRowIndex + 1
    // Coluna da medalha: E=5, F=6, G=7, H=8, I=9
    const columnLetter = String.fromCharCode(69 + medalhaId - 1) // E=69, F=70, etc.
    
    // Adicionar a data atual como valor da medalha
    const dataAtual = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Usuarios!${columnLetter}${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[dataAtual]]
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao adicionar medalha:', error)
    throw error
  }
}

