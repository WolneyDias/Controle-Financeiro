import React, { useState } from 'react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  transactions: Transaction[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await getFinancialAdvice(transactions);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Erro ao conectar com o consultor IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg text-white p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-yellow-300" />
            Consultor Financeiro IA
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Use a inteligência artificial Gemini para encontrar oportunidades de economia.
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || transactions.length === 0}
          className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
          {loading ? "Analisando..." : "Analisar Gastos"}
        </button>
      </div>

      {analysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-indigo-50 text-sm leading-relaxed animate-fade-in">
             {/* Using a simple div rendering for markdown-like content since we don't have a full markdown parser installed in this env, 
                 but adhering to the request to use standard libraries, text rendering is safest. 
                 Gemini usually outputs markdown. We will display it as whitespace-pre-wrap to preserve structure.
             */}
            <div className="whitespace-pre-wrap font-sans">
                {analysis}
            </div>
        </div>
      )}
    </div>
  );
};