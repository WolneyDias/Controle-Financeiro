import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "Adicione algumas transações para receber uma análise financeira personalizada.";
  }

  // Prepare a summary for the AI to minimize token usage
  const summary = transactions.map(t => 
    `${t.date}: ${t.description} (${t.category}) - ${t.type === TransactionType.INCOME ? '+' : '-'}${t.amount}`
  ).join('\n');

  const prompt = `
    Atue como um consultor financeiro pessoal especialista. Analise os seguintes dados de transações financeiras de um usuário (em Reais BRL).
    
    Dados:
    ${summary}

    Forneça:
    1. Um breve resumo da saúde financeira atual.
    2. Identifique a categoria onde o usuário está gastando mais.
    3. Três dicas práticas e acionáveis para economizar dinheiro com base nesses dados específicos.
    4. Use formatação Markdown para deixar a resposta bonita e legível.
    5. Responda em Português do Brasil.
    
    Seja encorajador, mas direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar uma análise no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Desculpe, encontrei um erro ao tentar analisar seus dados. Verifique sua chave API.";
  }
};