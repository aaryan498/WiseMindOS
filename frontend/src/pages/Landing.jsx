import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Target, TrendingUp, Sparkles, Brain, CheckCircle, Zap, ArrowRight } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import logo from '../assets/logo.jpeg';

const Landing = () => {
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: '21-Day Habit Tracker',
      description: 'Build lasting habits with our proven 21-day tracking system'
    },
    {
      icon: <Target size={32} />,
      title: 'Goal Management',
      description: 'Set, track, and achieve your personal and professional goals'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Task & Project Tracking',
      description: 'Organize your work with powerful task and project management'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'FutureTwin AI',
      description: 'Simulate future outcomes and make data-driven decisions'
    },
    {
      icon: <Brain size={32} />,
      title: 'Smart Analytics',
      description: 'Gain insights with comprehensive productivity analytics'
    },
    {
      icon: <Zap size={32} />,
      title: 'Holistic Development',
      description: 'Focus on balanced growth and participation in larger order.'
    }
  ];

  const steps = [
    { step: '01', title: 'Track Your Life', desc: 'Log your daily habits, tasks, and progress' },
    { step: '02', title: 'Analyze Patterns', desc: 'Review insights and analytics on your productivity' },
    { step: '03', title: 'Simulate Future', desc: 'Use FutureTwin AI to predict outcomes and optimize decisions' },
    { step: '04', title: 'Achieve Goals', desc: 'Stay consistent and watch your goals become reality' }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '95%', label: 'Goal Completion Rate' },
    { value: '2.5x', label: 'Productivity Boost' },
    { value: '24/7', label: 'AI Support' }
  ];

  const surfaceStyle = {
    backgroundColor: 'var(--wm-surface-soft)',
    borderColor: 'var(--wm-border)',
    boxShadow: 'var(--wm-shadow-soft)'
  };

  const strongSurfaceStyle = {
    backgroundColor: 'var(--wm-surface-strong)',
    borderColor: 'var(--wm-border-strong)',
    boxShadow: 'var(--wm-shadow)'
  };

  return (
    <div className="wm-page-shell overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <Motion.div
          className="wm-page-orb wm-page-orb--secondary absolute top-20 left-10 w-72 h-72 rounded-full"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Motion.div
          className="wm-page-orb wm-page-orb--primary absolute bottom-20 right-10 w-72 h-72 rounded-full"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.08), transparent 48%)' }} />

        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <Motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8 flex flex-col items-center"
          >
            <Motion.img
              src={logo}
              alt="WiseMindOS Logo"
              className="w-20 h-20 md:w-28 md:h-28 mb-4 object-contain rounded-[2rem] shadow-[0_0_40px_rgba(99,102,241,0.28)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <Motion.h1
              className="wm-page-title text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight mb-4 break-words"
              animate={{
                textShadow: [
                  '0px 0px 0px rgba(99,102,241,0)',
                  '0px 0px 20px rgba(99,102,241,0.32)',
                  '0px 0px 0px rgba(99,102,241,0)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              Wise
              <span className="bg-gradient-to-r text-4xl sm:text-5xl md:text-8xl baloo-2-700 from-indigo-500 to-purple-500 bg-clip-text text-transparent break-words">
                Mind
              </span>
              OS
            </Motion.h1>

            <div className="h-1.5 w-36 bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 mx-auto rounded-full shadow-[0_0_24px_rgba(99,102,241,0.3)]" />
          </Motion.div>

          <p className="wm-page-subtitle text-lg sm:text-xl md:text-2xl mb-10 leading-relaxed px-2 max-w-3xl mx-auto">
            Your intelligent life tracking and simulation system.
            <br />
            Stay focused, achieve goals, and optimize your future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <GradientButton data-testid="get-started-btn" className="w-full sm:w-auto px-9">
                Get Started
              </GradientButton>
            </Link>
            <Link to="/login">
              <button
                type="button"
                data-testid="login-btn"
                className="wm-outline-button px-8 py-[10px] rounded-xl font-semibold hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Login
              </button>
            </Link>
          </div>
        </Motion.div>
      </section>

      <section className="py-20 px-4" style={{ backgroundColor: 'var(--wm-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="wm-text-primary text-3xl md:text-4xl font-bold young-serif-regular mb-2">Powerful Features</h2>
            <div className="h-1 w-40 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full" />
            <p className="wm-text-secondary mt-2 text-base md:text-lg">Everything you need for holistic personal development</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer" style={surfaceStyle}>
                  <div className="p-3 bg-indigo-500/15 rounded-lg w-fit mb-4 text-indigo-500">{feature.icon}</div>
                  <h3 className="wm-text-primary text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="wm-text-secondary">{feature.description}</p>
                </Card>
              </Motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/features">
              <GradientButton className="w-full sm:w-auto" data-testid="explore-features-page-btn">
                <span className="flex items-center justify-center gap-2">
                  Explore All Features
                  <ArrowRight size={18} />
                </span>
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="wm-text-primary text-3xl md:text-4xl font-bold young-serif-regular mb-2">How It Works</h2>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full" />
            <p className="wm-text-secondary mt-2 text-base md:text-lg">Simple steps to transform your life</p>
          </div>

          <div className="space-y-8">
            {steps.map((item, index) => (
              <Motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.22)]"
                  style={surfaceStyle}
                >
                  <div className="p-2 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="wm-text-primary text-xl sm:text-2xl font-semibold mb-2">{item.title}</h3>
                      <p className="wm-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-[2rem] px-6 py-10 md:px-10 md:py-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(79,70,229,0.94) 0%, rgba(168,85,247,0.92) 52%, rgba(236,72,153,0.9) 100%)',
              boxShadow: '0 28px 70px rgba(99,102,241,0.28)'
            }}
          >
            <h2 className="text-4xl font-bold young-serif-regular text-white mb-6">
              Ready to Optimize Your Life?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands who are achieving their goals with WiseMindOS
            </p>
            <Link to="/signup">
              <GradientButton
                data-testid="cta-signup-btn"
                className="text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.36)]"
              >
                Start Your Journey Today
              </GradientButton>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.06) 50%, transparent 100%)' }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="wm-text-primary text-3xl md:text-4xl font-bold young-serif-regular mb-2">
              Trusted by Achievers
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full" />
            <p className="wm-text-secondary mt-3 text-base md:text-lg">
              Real impact on productivity and growth
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="rounded-2xl cursor-pointer p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.18)]"
                  style={surfaceStyle}
                >
                  <h3 className="text-3xl md:text-4xl baloo-2-700 font-extrabold bg-gradient-to-r from-blue-500 to-purple-700 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </h3>

                  <p className="wm-text-secondary text-sm md:text-base">
                    {stat.label}
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 px-4 border-t relative overflow-hidden" style={{ backgroundColor: 'var(--wm-surface-strong)', borderColor: 'var(--wm-border)' }}>
        <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.05), transparent 56%)' }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h2 className="wm-text-primary text-2xl young-serif-regular font-bold mb-4">
                Wise<span className="bg-gradient-to-r text-3xl from-indigo-500 to-purple-500 bg-clip-text text-transparent">Mind</span>OS
              </h2>
              <p className="wm-text-secondary text-sm leading-relaxed">
                Your intelligent life tracking and simulation system.
                Optimize your habits, goals, and future decisions.
              </p>
            </div>

            <div>
              <h3 className="wm-text-primary font-semibold mb-4">Product</h3>
              <ul className="space-y-2 wm-text-secondary text-sm">
                <li>
                  <Link to="/features" className="hover:text-[var(--wm-text)] transition cursor-pointer">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-[var(--wm-text)] transition cursor-pointer">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/roadmap" className="hover:text-[var(--wm-text)] transition">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="wm-text-primary font-semibold mb-4">Company</h3>
              <ul className="space-y-2 wm-text-secondary text-sm">
                <li>
                  <Link to="/about" className="hover:text-[var(--wm-text)] transition cursor-pointer">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[var(--wm-text)] transition cursor-pointer">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[var(--wm-text)] transition cursor-pointer">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="wm-text-primary font-semibold mb-4">Get Started</h3>

              <Link to="/signup">
                <GradientButton className="w-full mb-4">
                  <span className="flex items-center justify-center gap-2">
                    Start Free
                    <ArrowRight size={18} />
                  </span>
                </GradientButton>
              </Link>

              <p className="wm-text-secondary text-sm">
                Join thousands building better habits.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t text-center wm-text-secondary text-sm" style={{ borderColor: 'var(--wm-border)' }}>
            © 2026 <span className="wm-text-primary font-semibold">WiseMindOS</span>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
