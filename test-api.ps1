# Script de Teste da API (PowerShell)
# 
# Use este script para testar rapidamente a API local ou no Railway
# 
# Uso:
#   .\test-api.ps1                    # Testa localhost
#   .\test-api.ps1 railway            # Testa no Railway

param(
    [string]$Environment = "local"
)

# Cores para o console
function Write-ColorText {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    $colors = @{
        "Green" = "Green"
        "Red" = "Red"
        "Yellow" = "Yellow"
        "Cyan" = "Cyan"
        "Blue" = "Blue"
    }
    
    Write-Host $Message -ForegroundColor $colors[$Color]
}

# Configurar URL da API
$API_URL = if ($Environment -eq "railway" -or $env:API_URL) {
    $env:API_URL
} else {
    "http://localhost:5000/api"
}

if ([string]::IsNullOrEmpty($API_URL)) {
    $API_URL = "https://seu-app.railway.app/api"
}

Write-ColorText "`n🧪 Iniciando Testes da API..." "Cyan"
Write-ColorText "📍 URL Base: $API_URL`n" "Blue"

# Função para aguardar
function Wait-Test {
    param([int]$Milliseconds = 1000)
    Start-Sleep -Milliseconds $Milliseconds
}

# Dados de teste
$testUser = @{
    nome = "Usuário Teste"
    email = "teste$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    telefone = "($(Get-Random -Minimum 10 -Maximum 99)) $(Get-Random -Minimum 1000 -Maximum 9999)-$(Get-Random -Minimum 1000 -Maximum 9999)"
}

# Teste 1: Health Check
function Test-HealthCheck {
    Write-ColorText "📋 Teste 1: Health Check" "Yellow"
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
        if ($response.status -eq "ok") {
            Write-ColorText "  ✅ Health check passou!" "Green"
            return $true
        } else {
            Write-ColorText "  ❌ Health check falhou - resposta inesperada" "Red"
            return $false
        }
    } catch {
        Write-ColorText "  ❌ Health check falhou - API não respondeu" "Red"
        Write-ColorText "     Erro: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Teste 2: Cadastro
function Test-Cadastro {
    Write-ColorText "`n📋 Teste 2: Cadastro de Usuário" "Yellow"
    try {
        $body = @{
            nome = $testUser.nome
            email = $testUser.email
            telefone = $testUser.telefone
            empresa = "Empresa Teste"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_URL/submit" -Method Post -Body $body -ContentType "application/json"
        
        if ($response.success) {
            Write-ColorText "  ✅ Cadastro bem-sucedido!" "Green"
            Write-ColorText "     Nome: $($testUser.nome)" "Cyan"
            Write-ColorText "     Telefone: $($testUser.telefone)" "Cyan"
            return $true
        } else {
            Write-ColorText "  ❌ Cadastro falhou - resposta inesperada" "Red"
            return $false
        }
    } catch {
        Write-ColorText "  ❌ Cadastro falhou" "Red"
        Write-ColorText "     Erro: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Teste 3: Adicionar Medalha
function Test-AdicionarMedalha {
    Write-ColorText "`n📋 Teste 3: Adicionar Medalha" "Yellow"
    try {
        $body = @{
            telefone = $testUser.telefone
            medalhaId = 1
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$API_URL/medalhas" -Method Post -Body $body -ContentType "application/json"
        
        if ($response.success) {
            Write-ColorText "  ✅ Medalha adicionada!" "Green"
            Write-ColorText "     Medalha: Pioneiro (ID: 1)" "Cyan"
            return $true
        } else {
            Write-ColorText "  ❌ Adicionar medalha falhou - resposta inesperada" "Red"
            return $false
        }
    } catch {
        Write-ColorText "  ❌ Adicionar medalha falhou" "Red"
        Write-ColorText "     Erro: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Teste 4: Buscar Medalhas
function Test-BuscarMedalhas {
    Write-ColorText "`n📋 Teste 4: Buscar Medalhas" "Yellow"
    try {
        $telefoneEncoded = [System.Web.HttpUtility]::UrlEncode($testUser.telefone)
        $response = Invoke-RestMethod -Uri "$API_URL/medalhas/$telefoneEncoded" -Method Get
        
        if ($response.success -and $response.medalhas) {
            Write-ColorText "  ✅ Medalhas encontradas!" "Green"
            Write-ColorText "     Total: $($response.medalhas.Count) medalha(s)" "Cyan"
            Write-ColorText "     IDs: $($response.medalhas -join ', ')" "Cyan"
            return $true
        } else {
            Write-ColorText "  ❌ Buscar medalhas falhou - resposta inesperada" "Red"
            return $false
        }
    } catch {
        Write-ColorText "  ❌ Buscar medalhas falhou" "Red"
        Write-ColorText "     Erro: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Função principal
function Main {
    $results = @{
        Passed = 0
        Failed = 0
        Tests = @()
    }
    
    # Executar testes
    $results.Tests += @{ Name = "Health Check"; Result = (Test-HealthCheck) }
    Wait-Test -Milliseconds 1000
    
    $results.Tests += @{ Name = "Cadastro"; Result = (Test-Cadastro) }
    Wait-Test -Milliseconds 1000
    
    $results.Tests += @{ Name = "Adicionar Medalha"; Result = (Test-AdicionarMedalha) }
    Wait-Test -Milliseconds 1000
    
    $results.Tests += @{ Name = "Buscar Medalhas"; Result = (Test-BuscarMedalhas) }
    
    # Relatório final
    Write-ColorText "`n📊 Relatório Final`n" "Cyan"
    
    foreach ($test in $results.Tests) {
        if ($test.Result) {
            $results.Passed++
            Write-ColorText "✅ $($test.Name): PASSOU" "Green"
        } else {
            $results.Failed++
            Write-ColorText "❌ $($test.Name): FALHOU" "Red"
        }
    }
    
    $color = if ($results.Failed -eq 0) { "Green" } else { "Yellow" }
    Write-ColorText "`n🎯 Resultados: $($results.Passed)/$($results.Tests.Count) testes passaram" $color
    
    if ($results.Failed -eq 0) {
        Write-ColorText "🎉 Todos os testes passaram! Sistema está funcionando corretamente." "Green"
    } else {
        Write-ColorText "⚠️  Alguns testes falharam. Verifique a configuração." "Yellow"
    }
    
    Write-ColorText "`n📝 Dados do usuário de teste:" "Blue"
    Write-ColorText "   Nome: $($testUser.nome)" "Cyan"
    Write-ColorText "   Email: $($testUser.email)" "Cyan"
    Write-ColorText "   Telefone: $($testUser.telefone)" "Cyan"
    Write-ColorText "`n💡 Dica: Você pode testar manualmente com estes dados!" "Yellow"
}

# Executar
Main

