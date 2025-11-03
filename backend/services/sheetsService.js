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
  const range = 'Cadastros!A:D'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  // Garantir que a aba Cadastros existe
  await ensureSheetExists(sheets, spreadsheetId, 'Cadastros')

  // Primeiro, vamos verificar se o cabeçalho existe
  try {
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Cadastros!A1:D1'
    })

    // Se não houver cabeçalho, adiciona
    if (!headerResponse.data.values || headerResponse.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Cadastros!A1:D1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Nome', 'Email', 'Telefone', 'Empresa']]
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
        range: 'Cadastros!A1:D1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Nome', 'Email', 'Telefone', 'Empresa']]
        }
      })
    } else {
      throw error
    }
  }

  // Adiciona os dados
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[nome, email, telefone, empresa]]
    }
  })
}

// Função para buscar medalhas de um usuário pelo telefone
export async function getMedalhasByTelefone(telefone) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Medalhas!A:C'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID não configurado')
  }

  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient })

  // Garantir que a aba Medalhas existe
  await ensureSheetExists(sheets, spreadsheetId, 'Medalhas')

  try {
    // Buscar todas as medalhas
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })

    const rows = response.data.values || []
    
    // Verificar se existe cabeçalho
    if (rows.length === 0) {
      // Criar cabeçalho se não existir
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Medalhas!A1:C1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Telefone', 'Medalha', 'Data']]
        }
      })
      return []
    }

    // Filtrar medalhas pelo telefone
    const medalhasDoUsuario = rows.slice(1).filter(row => row[0] === telefone)
    
    // Retornar apenas os IDs das medalhas
    return medalhasDoUsuario.map(row => parseInt(row[1])).filter(id => !isNaN(id))
  } catch (error) {
    console.error('Erro ao buscar medalhas:', error)
    // Se erro for 400, a aba não existe ainda, tentar novamente após um delay
    if (error.code === 400) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Medalhas!A1:C1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Telefone', 'Medalha', 'Data']]
        }
      })
      return []
    }
    throw error
  }
}

// Função para adicionar uma medalha a um usuário
export async function addMedalhaToUser({ telefone, medalhaId }) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  const range = 'Medalhas!A:C'

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
    // Verificar se o usuário já tem essa medalha
    const medalhasExistentes = await getMedalhasByTelefone(telefone)
    if (medalhasExistentes.includes(medalhaId)) {
      throw new Error('Usuário já possui esta medalha')
    }

    // Adicionar a medalha
    const dataAtual = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[telefone, medalhaId.toString(), dataAtual]]
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Erro ao adicionar medalha:', error)
    throw error
  }
}

