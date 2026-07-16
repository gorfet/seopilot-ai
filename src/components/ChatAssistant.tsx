import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  X,
  HelpCircle,
  Clock
} from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am your SEOPilot AI Assistant. I can help you build comprehensive SEO campaigns, fix page speed issues, optimize content keywords, and generate schema files."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    "Why did my SEO score decrease?",
    "How do I improve page speed?",
    "Suggest internal links",
    "Generate schema markup."
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, { role: 'assistant', content: "Failed to connect to the Gemini server. Please ensure you have configured your GEMINI_API_KEY correctly." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">AI SEO Assistant</h2>
        <p className="text-slate-400 text-sm mt-1">Converse directly with an elite SEO technical strategist powered by Gemini 3.5 Flash</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: suggestions block */}
        <div className="p-5 bg-slate-900/20 border border-slate-900 rounded-2xl h-fit space-y-4 col-span-1">
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Suggested Prompts</span>
            <p className="text-xs text-slate-400 mt-1">Click any key phrase to initiate strategic analyses immediately</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {predefinedQuestions.map((q, idx) => (
              <button
                id={`predefined-prompt-${idx}`}
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="p-3 bg-slate-950/60 border border-slate-900 hover:border-slate-800 text-left rounded-xl text-xs text-slate-300 font-sans leading-normal font-medium transition disabled:opacity-50 hover:text-white"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: active chat frame */}
        <div className="lg:col-span-3 p-5 bg-slate-900/20 border border-slate-900 rounded-2xl flex flex-col justify-between min-h-[500px]">
          
          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-2 scrollbar-none pb-4">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex gap-3.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  m.role === 'user' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-slate-950 border-slate-900 text-slate-400'
                }`}>
                  {m.role === 'user' ? "U" : <Bot className="w-4 h-4" />}
                </div>

                {/* Msg text */}
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans ${
                  m.role === 'user' 
                    ? 'bg-sky-500/5 border-sky-500/10 text-slate-200' 
                    : 'bg-slate-950/40 border-slate-900 text-slate-300 font-normal whitespace-pre-line'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3.5 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-900 text-slate-400 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-2xl text-xs text-slate-500 flex items-center gap-2 font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Analyst is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} 
            className="flex gap-2.5 pt-4 border-t border-slate-900 mt-4"
          >
            <input
              type="text"
              required
              disabled={loading}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about SEO strategy (e.g. How to structure a robots.txt file?)"
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 focus:outline-none focus:border-sky-500 rounded-xl text-xs text-white placeholder-slate-500 transition font-sans"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl transition shadow-lg shadow-sky-500/10 flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
