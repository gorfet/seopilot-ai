import React, { useState } from "react";
import { 
  Sparkles, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Info,
  Layers, 
  Clipboard, 
  Eye, 
  Download,
  Copy,
  Check,
  Code
} from "lucide-react";
import { BlogOptimizationResult, GeneratedContent } from "../types";

export default function ContentAndOptimizer() {
  const [activeTab, setActiveTab] = useState<'writer' | 'optimizer'>('writer');
  
  // AI Writer Form Fields
  const [writeType, setWriteType] = useState('Blog Post');
  const [writeTopic, setWriteTopic] = useState("");
  const [writeKeywords, setWriteKeywords] = useState("");
  const [writeTone, setWriteTone] = useState("professional");
  const [writerLoading, setWriterLoading] = useState(false);
  const [writerResult, setWriterResult] = useState<GeneratedContent | null>(null);
  const [copiedWriterText, setCopiedWriterText] = useState("");

  // AI Optimizer Form Fields
  const [optimizeContent, setOptimizeContent] = useState("");
  const [optimizeKeywords, setOptimizeKeywords] = useState("");
  const [optimizerLoading, setOptimizerLoading] = useState(false);
  const [optimizerResult, setOptimizerResult] = useState<BlogOptimizationResult | null>(null);

  const handleGenerateWriter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writeTopic.trim()) return;

    setWriterLoading(true);
    try {
      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: writeType, topic: writeTopic, keywords: writeKeywords, tone: writeTone }),
      });
      const data = await response.json();
      setWriterResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setWriterLoading(false);
    }
  };

  const handleOptimizeBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optimizeContent.trim()) return;

    setOptimizerLoading(true);
    try {
      const response = await fetch("/api/blog/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: optimizeContent, keywords: optimizeKeywords }),
      });
      const data = await response.json();
      setOptimizerResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizerLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWriterText(type);
    setTimeout(() => setCopiedWriterText(""), 1500);
  };

  const getReadabilityColor = (grade: string) => {
    switch(grade) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Tab select header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">AI Content Center</h2>
          <p className="text-slate-400 text-sm mt-1">Generate high-converting organic articles or audit pasted drafts for keywords structure</p>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-950 p-1 border border-slate-900 rounded-xl flex gap-1 max-w-xs self-start">
          <button
            onClick={() => setActiveTab('writer')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'writer' 
                ? "bg-slate-900 text-sky-400 font-bold" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI SEO Writer</span>
          </button>
          
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'optimizer' 
                ? "bg-slate-900 text-sky-400 font-bold" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog Audit Optimizer</span>
          </button>
        </div>
      </div>

      {/* Main interactive area */}
      {activeTab === 'writer' ? (
        
        // ------------------ Tab 1: AI SEO WRITER ------------------
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left panel: configure generation forms */}
          <div className="lg:col-span-2 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl h-fit">
            <h3 className="text-sm font-bold text-white font-sans mb-4">SEO Content Configurator</h3>
            
            <form onSubmit={handleGenerateWriter} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Content Blueprint Type</label>
                <select
                  value={writeType}
                  onChange={(e) => setWriteType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition font-sans"
                >
                  <option>Blog Post</option>
                  <option>Landing Page Copy</option>
                  <option>E-commerce Product Description</option>
                  <option>FAQ Section</option>
                  <option>Structured Schema Script</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Keyword / Target Topic</label>
                <input
                  type="text"
                  required
                  value={writeTopic}
                  onChange={(e) => setWriteTopic(e.target.value)}
                  placeholder="e.g. How to train a border collie fast"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Semantic LSI Keywords (comma separated)</label>
                <input
                  type="text"
                  value={writeKeywords}
                  onChange={(e) => setWriteKeywords(e.target.value)}
                  placeholder="e.g. dog toys, agility training, border collie treats"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Tone of Voice Style</label>
                <select
                  value={writeTone}
                  onChange={(e) => setWriteTone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 transition font-sans"
                >
                  <option value="professional">Professional & Authoritative</option>
                  <option value="friendly">Friendly & Direct</option>
                  <option value="technical">Technical / Mono Code</option>
                  <option value="witty">Witty / Conversational</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={writerLoading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl text-xs font-semibold font-sans shadow-lg shadow-sky-500/10 flex items-center justify-center gap-1.5 transition"
              >
                {writerLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Drafting Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Generate Optimized Content</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right panel: displays draft results */}
          <div className="lg:col-span-3 space-y-4">
            {!writerResult ? (
              <div className="text-center py-24 bg-slate-900/10 border border-slate-900 rounded-2xl h-full flex flex-col justify-center items-center">
                <Sparkles className="w-12 h-12 text-slate-700 stroke-1 mb-4" />
                <h3 className="text-sm font-semibold text-slate-300 font-sans">Draft copy generator empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
                  Configure target topics and target LSI keyword densities on the left panel, and Gemini will generate a premium, high-ranking copy bundle.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Meta Tags Box */}
                <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">SERP Presentation Tags</span>
                    <button 
                      onClick={() => handleCopy(`${writerResult.metaTitle}\n${writerResult.metaDescription}`, 'meta')}
                      className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1 font-mono"
                    >
                      {copiedWriterText === 'meta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWriterText === 'meta' ? "Copied" : "Copy Tags"}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="block text-[9px] font-mono text-slate-500 mb-1">GOOGLE SEARCH TITLE</span>
                      <p className="text-sky-400 font-semibold font-sans">"{writerResult.metaTitle}"</p>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                      <span className="block text-[9px] font-mono text-slate-500 mb-1">META DESCRIPTION SNIPPET</span>
                      <p className="text-slate-300 leading-relaxed font-sans">{writerResult.metaDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Content Output Box */}
                <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-sans">{writeType} Content Draft</span>
                      <span className="px-1.5 py-0.5 text-[9px] bg-sky-500/10 text-sky-400 rounded border border-sky-500/20 font-mono font-bold">slug: {writerResult.slug}</span>
                    </div>

                    <button 
                      onClick={() => handleCopy(writerResult.content, 'body')}
                      className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1 font-mono"
                    >
                      {copiedWriterText === 'body' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWriterText === 'body' ? "Copied" : "Copy Body"}</span>
                    </button>
                  </div>

                  {/* Body markup format */}
                  <div className="text-slate-300 text-xs font-sans leading-relaxed whitespace-pre-line border border-slate-900 bg-slate-950/40 p-4 rounded-xl max-h-[380px] overflow-y-auto font-normal">
                    {writerResult.content}
                  </div>
                </div>

                {/* Schema JSON LD */}
                <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      <span>Injected JSON-LD Schema</span>
                    </span>
                    <button 
                      onClick={() => handleCopy(writerResult.schemaMarkup, 'schema')}
                      className="text-[10px] text-slate-500 hover:text-white transition flex items-center gap-1 font-mono"
                    >
                      {copiedWriterText === 'schema' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWriterText === 'schema' ? "Copied" : "Copy Schema"}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto max-h-[140px] p-2 leading-relaxed bg-slate-950 rounded">
                    {writerResult.schemaMarkup}
                  </pre>
                </div>

                {/* Content Brief Info */}
                <div className="p-3.5 bg-sky-500/5 border border-sky-500/10 rounded-xl">
                  <p className="text-[10px] font-mono text-sky-400 font-bold uppercase">AI Writer Brief Strategy</p>
                  <p className="text-slate-400 text-xs mt-1.5 leading-normal font-sans">{writerResult.brief}</p>
                </div>

              </div>
            )}
          </div>

        </div>
      ) : (
        
        // ------------------ Tab 2: BLOG OPTIMIZER ------------------
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Panel Form fields */}
          <div className="lg:col-span-2 p-6 bg-slate-900/20 border border-slate-900 rounded-2xl h-fit">
            <h3 className="text-sm font-bold text-white font-sans mb-4">Paste Article Draft</h3>
            
            <form onSubmit={handleOptimizeBlog} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Target SEO Keywords</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dog training guide, agile pup"
                  value={optimizeKeywords}
                  onChange={(e) => setOptimizeKeywords(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Full Draft Content</label>
                <textarea
                  required
                  rows={11}
                  placeholder="Paste your draft blog text here to optimize density and readability..."
                  value={optimizeContent}
                  onChange={(e) => setOptimizeContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans leading-relaxed resize-none scrollbar-none"
                />
              </div>

              <button
                type="submit"
                disabled={optimizerLoading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white rounded-xl text-xs font-semibold font-sans shadow-lg shadow-sky-500/10 flex items-center justify-center gap-1.5 transition"
              >
                {optimizerLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Auditing Blog...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-white" />
                    <span>Run Blog Optimizer Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Display Analysis Gauges and suggestions */}
          <div className="lg:col-span-3 space-y-4">
            {!optimizerResult ? (
              <div className="text-center py-24 bg-slate-900/10 border border-slate-900 rounded-2xl h-full flex flex-col justify-center items-center">
                <BookOpen className="w-12 h-12 text-slate-700 stroke-1 mb-4" />
                <h3 className="text-sm font-semibold text-slate-300 font-sans">Blog Optimizer feedback empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-normal">
                  Paste your raw text block and supply your primary keyword list. Our AI optimizer engine will extract readability metrics and keyword placement parameters immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Visual Gauges block */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  
                  {/* Optimizer Score */}
                  <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-center">
                    <span className="text-[9px] font-mono text-slate-500 block font-bold uppercase">SEO Score</span>
                    <span className="text-lg font-bold text-white font-sans mt-2 block">{optimizerResult.score}%</span>
                  </div>

                  {/* Readability */}
                  <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-center">
                    <span className="text-[9px] font-mono text-slate-500 block font-bold uppercase">Readability</span>
                    <span className={`text-xs font-bold font-sans mt-2.5 px-1.5 py-0.5 rounded inline-block border ${getReadabilityColor(optimizerResult.readability)}`}>
                      {optimizerResult.readability}
                    </span>
                  </div>

                  {/* Keyword Density */}
                  <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-center">
                    <span className="text-[9px] font-mono text-slate-500 block font-bold uppercase">Density</span>
                    <span className="text-lg font-bold text-slate-200 mt-2 block font-sans">{optimizerResult.keywordDensity}%</span>
                  </div>

                  {/* Passive voice */}
                  <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl text-center">
                    <span className="text-[9px] font-mono text-slate-500 block font-bold uppercase">Passive Voice</span>
                    <span className="text-lg font-bold text-rose-400 mt-2 block font-sans">{optimizerResult.passiveVoicePercentage}%</span>
                  </div>

                </div>

                {/* Headings recommendations */}
                <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block border-b border-slate-900 pb-2">Heading Structures Audited</span>
                  <div className="text-xs space-y-2">
                    <div className="flex gap-2 text-slate-300 font-sans">
                      <span className="text-slate-500 font-bold">Outline Summary:</span>
                      <span className="font-medium">{optimizerResult.headingsAnalysis.structure}</span>
                    </div>
                    <ul className="space-y-1.5 text-rose-400 mt-1 pl-1 font-sans">
                      {optimizerResult.headingsAnalysis.issues.map((iss, idx) => (
                        <li key={idx} className="flex gap-2 items-center text-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{iss}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Suggestions Bundle */}
                <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-900 pb-2 font-mono">Structural Optimization Suggestions</h4>

                  <div className="space-y-4 text-xs font-sans">
                    
                    {/* Intro rewrite */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-sky-400 font-bold uppercase font-mono block">Intro paragraph advice</span>
                      <p className="text-slate-300 leading-normal font-sans p-3 bg-slate-950/60 rounded-xl border border-slate-900 font-normal">
                        {optimizerResult.suggestions.introductionImprovement}
                      </p>
                    </div>

                    {/* Suggested Titles / Headings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold mb-1.5">Suggested SEO Title</span>
                        <p className="text-white font-medium">{optimizerResult.suggestions.seoTitle}</p>
                      </div>
                      <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold mb-1.5">Suggested Slug</span>
                        <p className="text-slate-400 font-mono text-[11px]">{optimizerResult.suggestions.seoSlug}</p>
                      </div>
                    </div>

                    {/* Missing Topics */}
                    <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Missing Topics & Semantic LSI Opportunities</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {optimizerResult.suggestions.missingTopics.map((top, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-950 text-slate-300 text-[10px] rounded border border-slate-900 font-mono">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggested FAQ Accordion */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono block">Highly relevant FAQ questions to insert</span>
                      {optimizerResult.suggestions.faqSection.map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-900 rounded-xl">
                          <p className="font-bold text-slate-200 font-sans leading-snug">Q: {faq.question}</p>
                          <p className="text-slate-400 text-xs mt-1 leading-normal font-sans font-normal">{faq.answer}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
