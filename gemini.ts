import { GoogleGenAI } from "@google/genai";

/**
 * Inicializa a SDK do Google Generative AI (Gemini).
 * A chave de API é injetada automaticamente pelo ambiente do AI Studio.
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Função que solicita ao modelo Gemini uma frase motivacional baseada na emoção detectada.
 * @param emotion A emoção traduzida para o português (ex: 'Feliz').
 */
export async function getMotivationalMessage(emotion: string) {
  try {
    // Chamamos o modelo 'gemini-3-flash' para uma resposta rápida e eficiente
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário está sentindo: ${emotion}. Gere uma mensagem curta (máximo 15 palavras), motivadora e empática em português para ele. Seja direto e inspirador.`,
      config: {
        // A systemInstruction define a personalidade da IA para todas as chamadas
        systemInstruction: "Você é um assistente de bem-estar empático e motivador. Suas mensagens devem ser curtas, impactantes e em português do Brasil.",
      },
    });
    
    // Retorna o texto gerado ou uma frase padrão de segurança caso falhe
    return response.text || "Você é capaz de grandes coisas!";
  } catch (error) {
    console.error("Erro ao gerar mensagem com Gemini:", error);
    return "Mantenha o foco e siga em frente!";
  }
}
