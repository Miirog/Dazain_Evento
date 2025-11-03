using UnityEngine;
using System.Collections;
using System.Text;
using UnityEngine.Networking;

/// <summary>
/// EXEMPLO ESPECÍFICO: Enviar Medalha 3 para 17988349182
/// 
/// Este script demonstra como enviar a medalha 3 (Conquistador ⚔️)
/// para o número 17988349182 usando a API.
/// </summary>
public class ExemploMedalha3 : MonoBehaviour
{
    [Header("Configuração")]
    [Tooltip("URL da API. Use 'http://localhost:5000/api' para local ou 'https://seu-app.railway.app/api' para produção")]
    public string apiUrl = "http://localhost:5000/api";
    
    void Start()
    {
        // ⭐ ENVIAR MEDALHA 3 PARA 17988349182
        StartCoroutine(EnviarMedalha3Para17988349182());
    }

    /// <summary>
    /// Envia a medalha 3 (Conquistador ⚔️) para o número 17988349182
    /// </summary>
    IEnumerator EnviarMedalha3Para17988349182()
    {
        string telefone = "17988349182";
        int medalhaId = 3; // Conquistador ⚔️

        Debug.Log($"🚀 Enviando medalha {medalhaId} para {telefone}...");

        // Criar JSON body
        string jsonBody = $"{{\"telefone\":\"{telefone}\",\"medalhaId\":{medalhaId}}}";
        
        // Criar requisição
        using (UnityWebRequest request = new UnityWebRequest($"{apiUrl}/medalhas", "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
            
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Accept", "application/json");

            Debug.Log($"📤 Enviando para: {apiUrl}/medalhas");
            Debug.Log($"📦 Body: {jsonBody}");

            // Enviar e aguardar
            yield return request.SendWebRequest();

            // Processar resposta
            if (request.result == UnityWebRequest.Result.Success)
            {
                string resposta = request.downloadHandler.text;
                Debug.Log($"✅ SUCESSO! Medalha 3 enviada para {telefone}");
                Debug.Log($"📥 Resposta: {resposta}");
            }
            else
            {
                string erro = request.error;
                string respostaErro = "";
                
                if (request.downloadHandler != null && !string.IsNullOrEmpty(request.downloadHandler.text))
                {
                    respostaErro = request.downloadHandler.text;
                }

                Debug.LogError($"❌ ERRO ao enviar medalha!");
                Debug.LogError($"🔴 Erro: {erro}");
                if (!string.IsNullOrEmpty(respostaErro))
                {
                    Debug.LogError($"📥 Resposta do servidor: {respostaErro}");
                }

                // Erros comuns e suas soluções
                if (erro.Contains("Cannot resolve"))
                {
                    Debug.LogWarning("💡 Verifique se a URL da API está correta!");
                }
                else if (respostaErro.Contains("não encontrado"))
                {
                    Debug.LogWarning("💡 O telefone precisa estar cadastrado primeiro via formulário!");
                }
                else if (respostaErro.Contains("já possui"))
                {
                    Debug.LogWarning("💡 Este usuário já possui a medalha 3!");
                }
            }
        }
    }

    // ===========================================
    // MÉTODO PÚBLICO PARA CHAMAR DE OUTROS SCRIPTS
    // ===========================================
    
    /// <summary>
    /// Método público que pode ser chamado de outros scripts ou botões UI
    /// </summary>
    public void EnviarMedalha3()
    {
        StartCoroutine(EnviarMedalha3Para17988349182());
    }

    /// <summary>
    /// Versão que permite especificar telefone e medalha dinamicamente
    /// </summary>
    public void EnviarMedalha(string telefone, int medalhaId)
    {
        StartCoroutine(EnviarMedalhaCoroutine(telefone, medalhaId));
    }

    private IEnumerator EnviarMedalhaCoroutine(string telefone, int medalhaId)
    {
        Debug.Log($"🚀 Enviando medalha {medalhaId} para {telefone}...");

        string jsonBody = $"{{\"telefone\":\"{telefone}\",\"medalhaId\":{medalhaId}}}";

        using (UnityWebRequest request = new UnityWebRequest($"{apiUrl}/medalhas", "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonBody);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"✅ Medalha {medalhaId} enviada com sucesso para {telefone}!");
            }
            else
            {
                Debug.LogError($"❌ Erro: {request.error}");
                if (request.downloadHandler != null)
                {
                    Debug.LogError($"Resposta: {request.downloadHandler.text}");
                }
            }
        }
    }
}

