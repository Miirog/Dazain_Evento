/**
 * Exemplo de script para adicionar medalhas via API
 * 
 * Uso:
 * node admin-medalhas-exemplo.js
 * 
 * Ou edite este arquivo para adicionar medalhas em lote
 */

import axios from 'axios'

// Configure a URL da sua API
const API_URL = process.env.API_URL || 'http://localhost:5000/api'

/**
 * Adiciona uma medalha a um usuário
 */
async function adicionarMedalha(telefone, medalhaId) {
  try {
    console.log(`Adicionando medalha ${medalhaId} ao usuário ${telefone}...`)
    
    const response = await axios.post(`${API_URL}/medalhas`, {
      telefone: telefone,
      medalhaId: medalhaId
    })
    
    console.log('✅ Sucesso:', response.data.message)
    return response.data
  } catch (error) {
    console.error('❌ Erro:', error.response?.data?.message || error.message)
    return null
  }
}

/**
 * Busca as medalhas de um usuário
 */
async function buscarMedalhas(telefone) {
  try {
    console.log(`Buscando medalhas do usuário ${telefone}...`)
    
    const response = await axios.get(`${API_URL}/medalhas/${encodeURIComponent(telefone)}`)
    
    console.log('✅ Medalhas encontradas:', response.data.medalhas)
    return response.data.medalhas
  } catch (error) {
    console.error('❌ Erro:', error.response?.data?.message || error.message)
    return null
  }
}

/**
 * Exemplos de uso
 */

// Exemplo 1: Adicionar uma medalha específica
async function exemplo1() {
  console.log('\n=== Exemplo 1: Adicionar Medalha ===')
  await adicionarMedalha('(11) 98765-4321', 1)
}

// Exemplo 2: Adicionar múltiplas medalhas a um usuário
async function exemplo2() {
  console.log('\n=== Exemplo 2: Adicionar Múltiplas Medalhas ===')
  const telefone = '(11) 98765-4321'
  const medalhas = [1, 2, 3]
  
  for (const medalhaId of medalhas) {
    await adicionarMedalha(telefone, medalhaId)
  }
}

// Exemplo 3: Buscar medalhas de um usuário
async function exemplo3() {
  console.log('\n=== Exemplo 3: Buscar Medalhas ===')
  await buscarMedalhas('(11) 98765-4321')
}

// Exemplo 4: Adicionar medalha para múltiplos usuários
async function exemplo4() {
  console.log('\n=== Exemplo 4: Adicionar Medalha em Lote ===')
  const usuarios = [
    { telefone: '(11) 98765-4321', medalhaId: 1 },
    { telefone: '(11) 98765-4322', medalhaId: 1 },
    { telefone: '(11) 98765-4323', medalhaId: 2 }
  ]
  
  for (const usuario of usuarios) {
    await adicionarMedalha(usuario.telefone, usuario.medalhaId)
  }
}

// Executar exemplos
async function main() {
  console.log('🚀 Script de Administração de Medalhas\n')
  
  // Para usar localmente, configure a API_URL:
  // API_URL='http://localhost:5000/api'
  
  // Descomente a linha do exemplo que deseja executar:
  
  // await exemplo1()
  // await exemplo2()
  // await exemplo3()
  // await exemplo4()
  
  console.log('\n💡 Edite este arquivo para personalizar os comandos!')
  console.log('💡 Configure a variável API_URL para usar com Railway.')
}

// Executar apenas se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { adicionarMedalha, buscarMedalhas }

