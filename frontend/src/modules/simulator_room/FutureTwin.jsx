import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, XCircle, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { futureTwinMockResponse } from '../../data/mockData';

import Card from '../../components/Card';
import GradientButton from '../../components/GradientButton';
import FutureTwinPic from '../../assets/digitwin.png';

const FutureTwin = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Dynamic simulation simulation request handler
  const handleSimulate = async () => {
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      // Simulate network request processing latency
      await new Promise(resolve => setTimeout(resolve, 2000));

      setResult({
        ...futureTwinMockResponse,
        query: query.trim()
      });
    } catch (error) {
      console.error("Simulation engine failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Performance memoization for status mapping layout tokens
  const getFeasibilityStyles = useCallback((feasibility) => {
    switch (feasibility) {
      case 'High':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  }, []);

  // Sub-view Component Rendering Modules
  const renderInputPanel = () => (
    <motion.div 
      key="input-panel"
      initial={{ opacity: 0, y: 15 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8"
    >
      {/* Left Avatar Interface Matrix */}
      <div className="relative flex justify-center group">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-indigo-500 to-purple-500 blur-[100px] opacity-25 rounded-full pointer-events-none" />
        
        <motion.img
          src={FutureTwinPic}
          alt="Future Twin Holographic Model"
          className="relative w-full max-w-xs rounded-2xl object-cover border border-white/10 shadow-2xl shadow-indigo-500/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dynamic Holographic Scan Lines */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-40 pointer-events-none"
          animate={{ y: [0, 240, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Right User Configuration Text Input Panel */}
      <Card className="bg-slate-900/40 border border-white/5 backdrop-blur-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-100 tracking-wide mb-1.5">Ask Your Future Twin</h2>
        
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Matrix Array Sync Active</span>
        </div>

        <textarea
          value={query}
          disabled={isLoading}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="State your future deployment scenario constraints (e.g., 'If I allocate 4 hours daily to compiling system models for 6 months...')"
          className="w-full bg-slate-950/40 text-slate-200 placeholder-slate-600 border border-white/5 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/40 focus:bg-slate-950/80 transition-all min-h-[150px] text-sm leading-relaxed resize-none custom-scrollbar"
        />

        <GradientButton
          onClick={handleSimulate}
          className="w-full mt-4 py-3.5 shadow-lg shadow-indigo-600/10"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2.5 text-sm font-bold">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Executing Vector Operations...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-sm font-bold tracking-wide">
              <Sparkles size={16} />
              Simulate Alternative Matrix Future
            </span>
          )}
        </GradientButton>
      </Card>
    </motion.div>
  );

  const renderSimulationResults = () => (
    <motion.div 
      key="simulation-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="text-center text-xs font-bold uppercase tracking-widest text-emerald-400 animate-pulse mb-1">
        // Vector Simulation Compiled Successfully
      </div>

      <Card className="bg-slate-900/40 border border-white/5 p-5 backdrop-blur-xl">
        <div className="flex items-start gap-3.5">
          <Sparkles className="text-indigo-400 shrink-0 mt-0.5" size={20} />
          <div className="min-w-0">
            <p className="text-emerald-400 font-mono text-xs tracking-wider font-semibold mb-1">&gt; query.evaluated_payload</p>
            <p className="text-slate-200 text-base font-medium italic leading-relaxed break-words">"{result?.query}"</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-slate-900/40 border border-white/5 p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            <TrendingUp className="text-indigo-400" size={18} />
            <h3 className="text-sm font-bold text-slate-300 tracking-wide uppercase">// Feasibility Index</h3>
          </div>
          <div className={`inline-block px-4 py-1.5 rounded-lg border text-sm font-bold tracking-wider uppercase ${getFeasibilityColor(result?.feasibility)}`}>
            {result?.feasibility} Matrix
          </div>
          <p className="text-slate-400 text-xs mt-3 leading-relaxed">
            This predictive path indicates high architectural compatibility contingent on operational standard consistency.
          </p>
        </Card>

        <Card className="bg-slate-900/40 border border-white/5 p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-4">
            {result?.isGood ? <CheckCircle className="text-emerald-400" size={18} /> : <XCircle className="text-rose-400" size={18} />}
            <h3 className="text-sm font-bold text-slate-300 tracking-wide uppercase">// Deployment Advice</h3>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-sm font-bold uppercase ${
            result?.isGood ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
          }`}>
            {result?.isGood ? 'Recommended Routing' : 'Requires Code Tuning'}
          </div>
          <p className="text-slate-400 text-xs mt-3 leading-relaxed">
            {result?.isGood 
              ? 'Vectors show baseline synchronization parameters with personal system metrics.' 
              : 'Divergences detected in performance paths. Evaluate bottleneck constraints.'}
          </p>
        </Card>
      </div>

      <Card className="bg-slate-900/40 border border-white/5 p-5">
        <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-2">
          <CheckCircle className="text-emerald-400" size={18} />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">// Simulated Structural Advantages</h3>
        </div>
        <ul className="space-y-2.5">
          {result?.benefits.map((benefit, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2.5 text-slate-300 text-sm font-medium"
            >
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span>{benefit}</span>
            </motion.li>
          ))}
        </ul>
      </Card>

      <Card className="bg-slate-900/40 border border-white/5 p-5">
        <div className="flex items-center gap-2.5 mb-4 border-b border-white/5 pb-2">
          <AlertTriangle className="text-amber-400" size={18} />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">// Expected Latency & Friction</h3>
        </div>
        <ul className="space-y-2.5">
          {result?.consequences.map((consequence, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2.5 text-slate-300 text-sm font-medium"
            >
              <span className="text-amber-400 font-bold shrink-0">⚠</span>
              <span>{consequence}</span>
            </motion.li>
          ))}
        </ul>
      </Card>

      <Card className="bg-slate-900/40 border border-white/5 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Lightbulb className="text-yellow-400" size={18} />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">// Strategic Twin Recommendations</h3>
        </div>
        <div className="space-y-3 mt-3">
          {result?.insights.map((insight, index) => (
            <div key={index} className="bg-slate-950/40 rounded-xl p-4 border-l-2 border-indigo-500/70 flex items-start gap-3">
              <span className="text-indigo-400 font-mono font-bold text-xs pt-0.5">{String(index + 1).padStart(2, '0')}.</span>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Trigger Option Action Layout Array */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          onClick={() => {
            setResult(null);
            setQuery('');
          }}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:contrast-125 text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg shadow-indigo-600/10 transition-all transform active:scale-98"
          data-testid="ask-another-btn"
        >
          Flush Vectors & Run Alternative Simulation
        </button>
        <button
          onClick={() => alert('Integration coming soon: Exporting compiled metrics into objectives node.')}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white font-bold text-sm rounded-xl cursor-pointer transition-all transform active:scale-98"
        >
          Commit Matrix To Goal Roadmap
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black pb-20 px-4 pt-6 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Radial Light Layers */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full blur-[130px] opacity-15 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full blur-[130px] opacity-15 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Module Header Container */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 px-1">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <Sparkles size={24} className="text-indigo-400 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Future<span className="text-indigo-400">Twin</span>AI
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-medium">Process predictive modeling matrices. Optimize micro-decisions cleanly.</p>
        </motion.div>

        {/* Dynamic Mode Switch Animation Context */}
        <AnimatePresence mode="wait">
          {!result ? renderInputPanel() : renderSimulationResults()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FutureTwin;