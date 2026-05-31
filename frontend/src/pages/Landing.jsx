import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Target, TrendingUp, Sparkles, Brain, CheckCircle, Zap, ArrowRight, CalendarDays, Flame, Award } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import logo from '../assets/logo.jpeg';

const Landing = () => {
  const features = [
    {
      icon: <TrendingUp size={24} />,
      title: '21-Day Habit Tracker',
      description: 'Build lasting habits with our proven 21-day tracking system.'
    },
    {
      icon: <Target size={24} />,
      title: 'Goal Management',
      description: 'Set, track, and achieve your personal and professional goals.'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Task & Project Tracking',
      description: 'Organize your work with powerful task and project management.'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'FutureTwin AI',
      description: 'Simulate future outcomes and make data-driven decisions.'
    },
    {
      icon: <Brain size={24} />,
      title: 'Smart Analytics',
      description: 'Gain insights with comprehensive productivity analytics.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Holistic Development',
      description: 'Focus on balanced growth and participation in larger order.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* ── HERO SECTION ── */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        
        {/* Ambient Glow Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-15 pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-600 rounded-full blur-[120px] opacity-15 pointer-events-none"
          animate={{ x: [0, -40, 0], y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex flex-col items-center"
          >
            {/* Logo */}
            <motion.img
              src={logo}
              alt="WiseMindOS Logo"
              className="w-24 h-24 md:w-28 md:h-28 mb-6 object-cover rounded-3xl shadow-2xl border border-white/10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main Animated Title */}
            <motion.h1
              className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-4 select-none"
              animate={{ textShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 30px rgba(99,102,241,0.4)", "0px 0px 0px rgba(99,102,241,0)"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Wise<span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto]">Mind</span>OS
            </motion.h1>

            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Your intelligent life tracking and simulation system. 
            <span className="block mt-1 text-slate-400 text-base md:text-lg">Stay focused, achieve goals, and optimize your future.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <GradientButton data-testid="get-started-btn" className="w-full sm:px-10 py-3.5 shadow-xl shadow-indigo-600/20">
                Get Started
              </GradientButton>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <button
                data-testid="login-btn"
                className="w-full sm:w-auto sm:px-10 py-3.5 bg-slate-900/60 border border-indigo-500/50 text-indigo-300 font-semibold rounded-xl tracking-wide transition-all duration-300 hover:bg-indigo-500/10 hover:text-white hover:border-indigo-400 hover:-translate-y-0.5 active:scale-95 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Login
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <section className="py-24 px-4 bg-slate-950/40 border-t border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">Powerful Architecture</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
            <p className="text-slate-400 text-sm md:text-base max-w-sm mx-auto font-medium">Everything you need for holistic personal development and structural growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Card className="h-full bg-slate-900/20 backdrop-blur-xl border border-white/5 hover:border-white/10 hover:bg-slate-900/40 transition-all duration-300 p-6 flex flex-col items-start rounded-2xl group shadow-lg shadow-black/10">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 mb-5 group-hover:bg-indigo-500/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2 tracking-wide">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">System Engine Blueprint</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
            <p className="text-slate-400 text-sm md:text-base font-medium">Simple executable steps to transform your structural life roadmap.</p>
          </div>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Track Your Life', desc: 'Log your daily habits, tasks, and progress pipelines safely.', icon: <TrendingUp size={16} /> },
              { step: '02', title: 'Analyze Patterns', desc: 'Review analytics and core insights on your productivity indices.', icon: <Brain size={16} /> },
              { step: '03', title: 'Simulate Future', desc: 'Use FutureTwin AI to predict system outcomes and optimize choices.', icon: <Sparkles size={16} /> },
              { step: '04', title: 'Achieve Goals', desc: 'Maintain compilation consistency and execute target objectives.', icon: <Target size={16} /> }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="group flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-mono shrink-0">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-200 tracking-wide flex items-center gap-2">
                      <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">{item.icon}</span>
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-4 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border-t border-b border-indigo-500/20 relative shadow-2xl">
        <div className="absolute inset-0 bg-indigo-500/5 mix-blend-color-dodge pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Ready to Optimize Your Core Life Flow?
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-8 font-medium max-w-xl mx-auto">
            Join thousands of modern achievers running their optimization models inside WiseMindOS.
          </p>
          <Link to="/signup">
            <GradientButton 
              data-testid="cta-signup-btn" 
              className="px-10 py-4 text-base font-bold tracking-wide shadow-2xl shadow-purple-500/30 hover:scale-105 transition-transform"
            >
              Start Your Journey Today <ArrowRight size={18} className="ml-1" />
            </GradientButton>
          </Link>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">Trusted by Achievers</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full mb-4" />
            <p className="text-slate-400 text-sm md:text-base font-medium">Real architectural impacts recorded on productivity metrics.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "10K+", label: "Active Profiles", icon: <CalendarDays size={14} /> },
              { value: "95%", label: "Goal Success Rate", icon: <Award size={14} /> },
              { value: "2.5x", label: "Productivity Index", icon: <Zap size={14} /> },
              { value: "24/7", label: "AI Twin Engines", icon: <Flame size={14} /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-center transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-black/20 flex flex-col justify-center items-center h-full">
                  <h3 className="text-2xl md:text-3xl font-mono font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                    <span className="text-slate-600">{stat.icon}</span>
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-4 bg-slate-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/5 pb-12">
            
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold tracking-wide text-slate-100">
                Wise<span className="text-indigo-400">Mind</span>OS
              </h2>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Your intelligent life tracking and simulation software utility. 
                Optimize your habits, track metrics, and manage deployment goals.
              </p>
            </div>

            <div>
              <h3 className="text-slate-200 text-xs font-bold uppercase tracking-widest mb-4">// Product Node</h3>
              <ul className="space-y-2.5 text-slate-400 text-xs font-medium">
                <li className="hover:text-indigo-400 transition cursor-pointer">Features Catalog</li>
                <li className="hover:text-indigo-400 transition cursor-pointer">Pricing Matrix</li>
                <li className="hover:text-indigo-400 transition cursor-pointer">System Roadmap</li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-200 text-xs font-bold uppercase tracking-widest mb-4">// Corporate</h3>
              <ul className="space-y-2.5 text-slate-400 text-xs font-medium">
                <li className="hover:text-indigo-400 transition cursor-pointer">About Infrastructure</li>
                <li className="hover:text-indigo-400 transition cursor-pointer">Careers Cache</li>
                <li className="hover:text-indigo-400 transition cursor-pointer">Contact Sync</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-200 text-xs font-bold uppercase tracking-widest">// Initialization</h3>
              <Link to="/signup" className="block">
                <GradientButton className="w-full py-2.5 text-xs shadow-md shadow-indigo-600/10">
                  <span>Start Free Run</span> <ArrowRight size={14} className="ml-1" />
                </GradientButton>
              </Link>
              <p className="text-slate-500 text-[11px] font-medium">Join thousands tracking distributed micro-habits.</p>
            </div>
          </div>

          <div className="mt-8 text-center text-slate-500 text-xs font-medium font-mono">
            © 2026 <span className="text-slate-400 font-bold">WiseMindOS Engine</span>. Distributed under standard cloud architecture. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;