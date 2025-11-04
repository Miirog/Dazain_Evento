# 🎮 Guia de Uso: Enviar Medalhas via Unity (C#)

Este guia mostra como enviar medalhas para números de telefone usando uma aplicação Unity em C#.

## 📋 Pré-requisitos

- Unity 2019.4 ou superior
- Script `UnityEnviarMedalha.cs` adicionado ao projeto

## 🚀 Exemplo Rápido: Medalha 3 para 17988349182

### Opção 1: Usar como Componente

1. **Adicione o script a um GameObject:**
   ```csharp
   // No Inspector do Unity, adicione o componente UnityEnviarMedalha
   // Configure a URL da API no campo "Api Url"
   ```

2. **Chame o método em qualquer script:**
   ```csharp
   using UnityEngine;

   public class ExemploUso : MonoBehaviour
   {
       private UnityEnviarMedalha medalhaSender;

       void Start()
       {
           // Pegar referência do componente
           medalhaSender = GetComponent<UnityEnviarMedalha>();
           
           // Se não tiver, criar automaticamente
           if (medalhaSender == null)
           {
               medalhaSender = gameObject.AddComponent<UnityEnviarMedalha>();
           }

           // ⭐ ENVIAR MEDALHA 3 PARA 17988349182
           medalhaSender.EnviarMedalha(
               "17988349182",  // Telefone
               3,              // Medalha ID (3 = Conquistador ⚔️)
               onSuccess: (resposta) => {
                   Debug.Log("✅ Medalha 3 enviada com sucesso!");
                   Debug.Log($"Resposta do servidor: {resposta}");
               },
               onError: (erro) => {
                   Debug.LogError($"❌ Erro ao enviar medalha: {erro}");
               }
           );
       }
   }
   ```

### Opção 2: Usar Método Estático

```csharp
using UnityEngine;

public class ExemploUsoEstatico : MonoBehaviour
{
    void Start()
    {
        // ⭐ ENVIAR MEDALHA 3 PARA 17988349182
        UnityEnviarMedalha.EnviarMedalhaEstatico(
            "17988349182",  // Telefone
            3,              // Medalha ID
            onSuccess: (resposta) => {
                Debug.Log("✅ Medalha enviada!");
            },
            onError: (erro) => {
                Debug.LogError($"❌ Erro: {erro}");
            }
        );
    }
}
```

### Opção 3: Uso Direto (Sem GameObject)

```csharp
using UnityEngine;
using System.Collections;

public class EnviarMedalhaDireto : MonoBehaviour
{
    [Header("Configuração")]
    public string apiUrl = "http://localhost:5000/api"; // ou "https://seu-app.railway.app/api"
    
    void Start()
    {
        StartCoroutine(EnviarMedalhaCoroutine("17988349182", 3));
    }

    IEnumerator EnviarMedalhaCoroutine(string telefone, int medalhaId)
    {
        string jsonBody = $"{{\"telefone\":\"{telefone}\",\"medalhaId\":{medalhaId}}}";
        string url = $"{apiUrl}/medalhas";
        
        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonBody);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"✅ Sucesso: {request.downloadHandler.text}");
            }
            else
            {
                Debug.LogError($"❌ Erro: {request.error}");
            }
        }
    }
}
```

## 🔧 Configuração da API

### Para Desenvolvimento Local

```csharp
// No script, configure:
apiUrl = "http://localhost:5000/api";
```

### Para Produção (Railway/Vercel)

```csharp
// No script, configure:
apiUrl = "https://seu-app.railway.app/api";
```

**Nota:** Substitua `seu-app.railway.app` pela URL real da sua API em produção.

## 📱 Formatos de Telefone Aceitos

O script aceita telefones com ou sem formatação:

- ✅ `"17988349182"`
- ✅ `"(17) 98834-9182"`
- ✅ `"17 98834-9182"`
- ✅ `"+55 17 98834-9182"`

O backend normaliza automaticamente (remove todos os caracteres não numéricos).

## 🏆 IDs das Medalhas

| ID | Nome | Emoji |
|----|------|-------|
| 1 | Pioneiro | 🏆 |
| 2 | Explorador | 🔍 |
| 3 | Conquistador | ⚔️ |
| 4 | Mestre | 👑 |
| 5 | Lenda | 🌟 |

## 📝 Exemplo Completo com Tratamento de Erros

```csharp
using UnityEngine;
using UnityEngine.UI;

public class UIMedalhaSender : MonoBehaviour
{
    public InputField telefoneInput;
    public Dropdown medalhaDropdown;
    public Button enviarButton;
    public Text mensagemText;

    private UnityEnviarMedalha medalhaSender;

    void Start()
    {
        medalhaSender = GetComponent<UnityEnviarMedalha>();
        
        enviarButton.onClick.AddListener(() => {
            string telefone = telefoneInput.text;
            int medalhaId = medalhaDropdown.value + 1; // Dropdown começa em 0
            
            if (string.IsNullOrEmpty(telefone))
            {
                MostrarMensagem("Por favor, insira um telefone", Color.red);
                return;
            }

            enviarButton.interactable = false;
            mensagemText.text = "Enviando...";

            medalhaSender.EnviarMedalha(
                telefone,
                medalhaId,
                onSuccess: (resposta) => {
                    MostrarMensagem("✅ Medalha enviada com sucesso!", Color.green);
                    enviarButton.interactable = true;
                },
                onError: (erro) => {
                    MostrarMensagem($"❌ Erro: {erro}", Color.red);
                    enviarButton.interactable = true;
                }
            );
        });
    }

    void MostrarMensagem(string mensagem, Color cor)
    {
        mensagemText.text = mensagem;
        mensagemText.color = cor;
    }
}
```

## ⚠️ Tratamento de Erros Comuns

### Erro: "Usuário não encontrado"
- O telefone precisa estar cadastrado primeiro via formulário
- Verifique se o telefone está correto

### Erro: "Usuário já possui esta medalha"
- O usuário já tem a medalha que você está tentando enviar
- Cada medalha só pode ser enviada uma vez por usuário

### Erro: "Network Error" ou "Connection Error"
- Verifique se a URL da API está correta
- Verifique se o servidor está rodando
- Verifique se há problemas de CORS (em produção, certifique-se que o CORS está configurado)

## 🎯 Caso de Uso Específico: Medalha 3 para 17988349182

Aqui está o código exato para o seu caso:

```csharp
using UnityEngine;

public class EnviarMedalha3 : MonoBehaviour
{
    void Start()
    {
        // Obter o componente (ou criar se não existir)
        UnityEnviarMedalha sender = GetComponent<UnityEnviarMedalha>();
        if (sender == null)
        {
            sender = gameObject.AddComponent<UnityEnviarMedalha>();
        }

        // Enviar medalha 3 para 17988349182
        sender.EnviarMedalha(
            "17988349182",
            3,
            onSuccess: (resposta) => {
                Debug.Log("✅ Medalha Conquistador enviada com sucesso!");
            },
            onError: (erro) => {
                Debug.LogError($"❌ Erro: {erro}");
            }
        );
    }
}
```

## 📚 Referências

- [Documentação UnityWebRequest](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.html)
- [Sistema de Medalhas - Documentação Completa](IMPLEMENTACAO_COMPLETA.md)


