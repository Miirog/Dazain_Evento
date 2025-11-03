/**
 * Script de Teste da API
 * 
 * Use este script para testar rapidamente a API local ou no Railway
 * 
 * Uso:
 *   node test-api.js                    # Testa localhost
 *   node test-api.js railway            # Testa no Railway
 *   
 * Ou configure a URL manualmente:
 *   API_URL=https://seu-app.railway.app node test-api.js
 */

import axios from 'axios'

// Configurar URL da API
const isRailway = process.argv[2] === 'railway' || process.env.API_URL
const API_URL = process.env.API_URL || (isRailway ? 'https://seu-app.railway.app/api' : 'http://localhost:5000/api')

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

// Função para print colorido
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Função para aguardar
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Dados de teste
const testUser = {
  nome: 'Usuário Teste',
  email: `teste${Date.now()}@example.com`,
  telefone: `(${Math.floor(Math.random() * 100)}) ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`
}

log('\n🧪 Iniciando Testes da API...', 'cyan')
log(`📍 URL Base: ${API_URL}\n`, 'blue')

// Teste 1: Health Check
async function testHealthCheck() {
  log('📋 Teste 1: Health Check', 'yellow')
  try {
    const response = await axios.get(`${API_URL}/health`)
    if (response.data.status === 'ok') {
      log('  ✅ Health check passou!', 'green')
      return true
    } else {
      log('  ❌ Health check falhou - resposta inesperada', 'red')
      return false
    }
  } catch (error) {
    log('  ❌ Health check falhou - API não respondeu', 'red')
    log(`     Erro: ${error.message}`, 'red')
    return false
  }
}

// Teste 2: Cadastro
async function testCadastro() {
  log('\n📋 Teste 2: Cadastro de Usuário', 'yellow')
  try {
    const response = await axios.post(`${API_URL}/submit`, {
      ...testUser,
      empresa: 'Empresa Teste'
    })
    
    if (response.data.success) {
      log('  ✅ Cadastro bem-sucedido!', 'green')
      log(`     Nome: ${testUser.nome}`, 'cyan')
      log(`     Telefone: ${testUser.telefone}`, 'cyan')
      return true
    } else {
      log('  ❌ Cadastro falhou - resposta inesperada', 'red')
      return false
    }
  } catch (error) {
    log('  ❌ Cadastro falhou', 'red')
    log(`     Erro: ${error.response?.data?.message || error.message}`, 'red')
    return false
  }
}

// Teste 3: Adicionar Medalha
async function testAdicionarMedalha() {
  log('\n📋 Teste 3: Adicionar Medalha', 'yellow')
  try {
    const response = await axios.post(`${API_URL}/medalhas`, {
      telefone: testUser.telefone,
      medalhaId: 1
    })
    
    if (response.data.success) {
      log('  ✅ Medalha adicionada!', 'green')
      log(`     Medalha: Pioneiro (ID: 1)`, 'cyan')
      return true
    } else {
      log('  ❌ Adicionar medalha falhou - resposta inesperada', 'red')
      return false
    }
  } catch (error) {
    log('  ❌ Adicionar medalha falhou', 'red')
    log(`     Erro: ${error.response?.data?.message || error.message}`, 'red')
    return false
  }
}

// Teste 4: Buscar Medalhas
async function testBuscarMedalhas() {
  log('\n📋 Teste 4: Buscar Medalhas', 'yellow')
  try {
    const telefoneEncoded = encodeURIComponent(testUser.telefone)
    const response = await axios.get(`${API_URL}/medalhas/${telefoneEncoded}`)
    
    if (response.data.success && Array.isArray(response.data.medalhas)) {
      log('  ✅ Medalhas encontradas!', 'green')
      log(`     Total: ${response.data.medalhas.length} medalha(s)`, 'cyan')
      log(`     IDs: ${response.data.medalhas.join(', ') || 'Nenhuma'}`, 'cyan')
      return true
    } else {
      log('  ❌ Buscar medalhas falhou - resposta inesperada', 'red')
      return false
    }
  } catch (error) {
    log('  ❌ Buscar medalhas falhou', 'red')
    log(`     Erro: ${error.response?.data?.message || error.message}`, 'red')
    return false
  }
}

// Teste 5: Tentar adicionar medalha duplicada
async function testMedalhaDuplicada() {
  log('\n📋 Teste 5: Tentar Adicionar Medalha Duplicada', 'yellow')
  try {
    const response = await axios.post(`${API_URL}/medalhas`, {
      telefone: testUser.telefone,
      medalhaId: 1 // Mesma medalha do Teste 3
    })
    
    log('  ❌ Erro: Deveria ter bloqueado medalha duplicada', 'red')
    return false
  } catch (error) {
    if (error.response?.status === 500 && error.response?.data?.message?.includes('já possui')) {
      log('  ✅ Medalha duplicada bloqueada corretamente!', 'green')
      return true
    } else {
      log('  ⚠️  Resposta inesperada para medalha duplicada', 'yellow')
      log(`     Erro: ${error.response?.data?.message || error.message}`, 'yellow')
      return false
    }
  }
}

// Teste 6: Adicionar múltiplas medalhas
async function testMultiplasMedalhas() {
  log('\n📋 Teste 6: Adicionar Múltiplas Medalhas', 'yellow')
  const medalhasParaAdicionar = [2, 3, 4]
  let sucessos = 0
  
  for (const medalhaId of medalhasParaAdicionar) {
    try {
      await axios.post(`${API_URL}/medalhas`, {
        telefone: testUser.telefone,
        medalhaId
      })
      sucessos++
      log(`  ✅ Medalha ${medalhaId} adicionada`, 'green')
    } catch (error) {
      log(`  ❌ Falha ao adicionar medalha ${medalhaId}`, 'red')
      log(`     Erro: ${error.response?.data?.message || error.message}`, 'red')
    }
    await sleep(500) // Aguardar 500ms entre requisições
  }
  
  if (sucessos === medalhasParaAdicionar.length) {
    log(`  ✅ Todas as ${sucessos} medalhas adicionadas!`, 'green')
    return true
  } else {
    log(`  ⚠️  Apenas ${sucessos}/${medalhasParaAdicionar.length} medalhas adicionadas`, 'yellow')
    return false
  }
}

// Função principal
async function main() {
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }
  
  // Executar testes
  results.tests.push({ name: 'Health Check', result: await testHealthCheck() })
  await sleep(1000)
  
  results.tests.push({ name: 'Cadastro', result: await testCadastro() })
  await sleep(1000)
  
  results.tests.push({ name: 'Adicionar Medalha', result: await testAdicionarMedalha() })
  await sleep(1000)
  
  results.tests.push({ name: 'Buscar Medalhas', result: await testBuscarMedalhas() })
  await sleep(1000)
  
  results.tests.push({ name: 'Medalha Duplicada', result: await testMedalhaDuplicada() })
  await sleep(1000)
  
  results.tests.push({ name: 'Múltiplas Medalhas', result: await testMultiplasMedalhas() })
  
  // Relatório final
  log('\n📊 Relatório Final\n', 'cyan')
  
  results.tests.forEach(test => {
    if (test.result) {
      results.passed++
      log(`✅ ${test.name}: PASSOU`, 'green')
    } else {
      results.failed++
      log(`❌ ${test.name}: FALHOU`, 'red')
    }
  })
  
  log(`\n🎯 Resultados: ${results.passed}/${results.tests.length} testes passaram`, 
      results.failed === 0 ? 'green' : 'yellow')
  
  if (results.failed === 0) {
    log('🎉 Todos os testes passaram! Sistema está funcionando corretamente.', 'green')
  } else {
    log('⚠️  Alguns testes falharam. Verifique a configuração.', 'yellow')
  }
  
  log(`\n📝 Dados do usuário de teste:`, 'blue')
  log(`   Nome: ${testUser.nome}`, 'cyan')
  log(`   Email: ${testUser.email}`, 'cyan')
  log(`   Telefone: ${testUser.telefone}`, 'cyan')
  log('\n💡 Dica: Você pode testar manualmente com estes dados!', 'yellow')
}

// Executar
main().catch(error => {
  log('\n❌ Erro crítico ao executar testes:', 'red')
  console.error(error)
  process.exit(1)
})

