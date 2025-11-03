using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// Script para enviar medalhas via API externa
/// 
/// Como usar:
/// 1. Configure a URL da API na variável apiUrl
/// 2. Chame EnviarMedalha() passando o telefone e o ID da medalha
/// 
/// Exemplo:
///     StartCoroutine(EnviarMedalha("17988349182", 3));
/// </summary>
public class UnityEnviarMedalha : MonoBehaviour
{
    // ⚙️ CONFIGURAÇÃO: Altere para a URL da sua API
    // Para desenvolvimento local: "http://localhost:5000/api"
    // Para produção: "https://seu-app.railway.app/api"
    [Header("Configuração da API")]
    [SerializeField] private string apiUrl = "http://localhost:5000/api";
    
    [Header("Debug")]
    [SerializeField] private bool logDetalhado = true;

    /// <summary>
    /// Envia uma medalha para um número de telefone
    /// </summary>
    /// <param name="telefone">Número do telefone (com ou sem formatação, ex: "17988349182" ou "(17) 98834-9182")</param>
    /// <param name="medalhaId">ID da medalha (1 a 5):
    ///     1 = Pioneiro 🏆
    ///     2 = Explorador 🔍
    ///     3 = Conquistador ⚔️
    ///     4 = Mestre 👑
    ///     5 = Lenda 🌟
    /// </param>
    /// <param name="onSuccess">Callback chamado quando a medalha é enviada com sucesso</param>
    /// <param name="onError">Callback chamado quando ocorre um erro</param>
    public void EnviarMedalha(string telefone, int medalhaId, 
                               Action<string> onSuccess = null, 
                               Action<string> onError = null)
    {
        StartCoroutine(EnviarMedalhaCoroutine(telefone, medalhaId, onSuccess, onError));
    }

    /// <summary>
    /// Corrotina que faz a requisição HTTP
    /// </summary>
    private IEnumerator EnviarMedalhaCoroutine(string telefone, int medalhaId, 
                                                 Action<string> onSuccess, 
                                                 Action<string> onError)
    {
        // Validar parâmetros
        if (string.IsNullOrEmpty(telefone))
        {
            string erro = "Telefone não pode ser vazio";
            LogErro(erro);
            onError?.Invoke(erro);
            yield break;
        }

        if (medalhaId < 1 || medalhaId > 5)
        {
            string erro = $"ID da medalha deve ser entre 1 e 5. Recebido: {medalhaId}";
            LogErro(erro);
            onError?.Invoke(erro);
            yield break;
        }

        // Preparar dados JSON
        string jsonBody = CriarJsonBody(telefone, medalhaId);
        
        if (logDetalhado)
        {
            Debug.Log($"[EnviarMedalha] Enviando medalha {medalhaId} para {telefone}");
            Debug.Log($"[EnviarMedalha] JSON: {jsonBody}");
            Debug.Log($"[EnviarMedalha] URL: {apiUrl}/medalhas");
        }

        // Criar requisição UnityWebRequest
        using (UnityWebRequest request = new UnityWebRequest($"{apiUrl}/medalhas", "POST"))
        {
            // Converter JSON para bytes
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
            
            // Configurar upload handler
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            
            // Configurar headers
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Accept", "application/json");

            // Enviar requisição e aguardar resposta
            yield return request.SendWebRequest();

            // Processar resposta
            if (request.result == UnityWebRequest.Result.Success)
            {
                string responseText = request.downloadHandler.text;
                
                if (logDetalhado)
                {
                    Debug.Log($"[EnviarMedalha] ✅ Sucesso! Resposta: {responseText}");
                }

                onSuccess?.Invoke(responseText);
            }
            else
            {
                string erro = $"Erro ao enviar medalha: {request.error}";
                
                // Tentar ler mensagem de erro do servidor
                if (request.downloadHandler != null && !string.IsNullOrEmpty(request.downloadHandler.text))
                {
                    try
                    {
                        // A resposta pode ser um JSON com uma mensagem de erro
                        string errorResponse = request.downloadHandler.text;
                        erro += $"\nResposta do servidor: {errorResponse}";
                    }
                    catch (Exception ex)
                    {
                        erro += $"\nErro ao ler resposta: {ex.Message}";
                    }
                }

                LogErro(erro);
                onError?.Invoke(erro);
            }
        }
    }

    /// <summary>
    /// Cria o JSON do body da requisição
    /// </summary>
    private string CriarJsonBody(string telefone, int medalhaId)
    {
        // Normalizar telefone (remover caracteres não numéricos)
        // Nota: O backend também normaliza, mas é bom normalizar aqui também
        string telefoneNormalizado = System.Text.RegularExpressions.Regex.Replace(telefone, @"\D", "");
        
        // Criar objeto JSON manualmente (Unity pode não ter JsonUtility configurado)
        string json = $"{{\"telefone\":\"{telefoneNormalizado}\",\"medalhaId\":{medalhaId}}}";
        
        return json;
    }

    /// <summary>
    /// Método auxiliar para log de erros
    /// </summary>
    private void LogErro(string mensagem)
    {
        Debug.LogError($"[EnviarMedalha] ❌ {mensagem}");
    }

    // ===========================================
    // EXEMPLO DE USO - Descomente para testar
    // ===========================================
    
    /*
    void Start()
    {
        // Exemplo 1: Enviar medalha 3 para o número 17988349182
        EnviarMedalha(
            "17988349182", 
            3,
            onSuccess: (resposta) => {
                Debug.Log("Medalha enviada com sucesso!");
                Debug.Log($"Resposta: {resposta}");
            },
            onError: (erro) => {
                Debug.LogError($"Falha ao enviar medalha: {erro}");
            }
        );
    }
    */

    // ===========================================
    // MÉTODO PÚBLICO ESTÁTICO (OPCIONAL)
    // ===========================================
    
    /// <summary>
    /// Método estático para enviar medalha sem precisar de um GameObject
    /// Requer que exista um GameObject na cena com este script
    /// </summary>
    public static void EnviarMedalhaEstatico(string telefone, int medalhaId, 
                                               Action<string> onSuccess = null, 
                                               Action<string> onError = null)
    {
        // Encontrar ou criar instância
        UnityEnviarMedalha instance = FindObjectOfType<UnityEnviarMedalha>();
        
        if (instance == null)
        {
            GameObject go = new GameObject("MedalhaSender");
            instance = go.AddComponent<UnityEnviarMedalha>();
        }
        
        instance.EnviarMedalha(telefone, medalhaId, onSuccess, onError);
    }
}

