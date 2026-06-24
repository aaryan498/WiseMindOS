import { Link } from 'react-router-dom';
import { motion as Motion } from "framer-motion";
import { Target, TrendingUp, Sparkles, Brain, CheckCircle, Zap } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import { ArrowRight } from 'lucide-react';
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

  // ── Framer-Motion variants ──────────────────────────────────────────────────

  /** Stagger container: children animate in one after another */
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  /** Each footer link/item fades + slides up on entrance */
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  /** Hover state for nav links – slide right + colour shift */
  const linkHover = {
    rest: { x: 0, color: '#9ca3af' },           // gray-400
    hover: { x: 8, color: '#818cf8' },           // indigo-400
  };

  /** The small dot/indicator beside each link */
  const dotVariant = {
    rest: { scale: 0, opacity: 0 },
    hover: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  };

  /** Footer section entrance */
  const footerEntrance = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className='bg-gradient-to-br from-gray-900 via-black to-gray-900'>
        <Motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <Motion.section animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative min-h-screen flex items-center justify-center px-4 py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
            {/* Glow blobs */}
            <Motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            <Motion.div
              className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            />

            <div className="relative max-w-4xl mx-auto text-center">
              <div className="mb-8 flex flex-col items-center">

                {/* Logo */}
                <Motion.img
                  src={logo}
                  alt="WiseMindOS Logo"
                  className="w-20 h-20 md:w-28 md:h-28 mb-4 object-contain"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Title */}
                <Motion.h1
                  className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-4 cursor-pointer break-words"
                  animate={{
                    textShadow: [
                      "0px 0px 0px rgba(99,102,241,0)",
                      "0px 0px 20px rgba(99,102,241,0.8)",
                      "0px 0px 0px rgba(99,102,241,0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Wise
                  <span className="bg-gradient-to-r text-4xl sm:text-5xl md:text-8xl baloo-2-700 from-indigo-500 to-purple-500 bg-clip-text text-transparent break-words">
                    Mind
                  </span>
                  OS
                </Motion.h1>

                <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full"></div>
              </div>
<p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed px-2">
                Your intelligent life tracking and simulation system.
                <br />
                Stay focused, achieve goals, and optimize your future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup">
                  <GradientButton data-testid="get-started-btn" className="w-full sm:w-auto">
                    Get Started
                  </GradientButton>
                </Link>
                <Link to="/login">
                  <button
                    data-testid="login-btn"
                    className="px-8 py-[10px] border-2 border-indigo-500 text-white rounded-xl font-semibold 
                        hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] 
                        hover:-translate-y-1 active:scale-95 transition-all duration-300"
                  >
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </Motion.section>
        </Motion.div>
      </div>



      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-gray-600 dark:text-gray-100 mb-2">Powerful Features</h2>
            <div className="h-1 w-39 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full"></div>
            <p className="text-gray-900 dark:text-gray-300 mt-2 text-base md:text-lg">Everything you need for holistic personal development</p>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >

                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 
hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="p-3 bg-indigo-500/20 rounded-lg w-fit mb-4 text-indigo-400">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
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

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-gray-200 mb-2">How It Works</h2>
            <div className="h-1 w-30 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-2 text-base md:text-lg">Simple steps to transform your life</p>
          </div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Track Your Life', desc: 'Log your daily habits, tasks, and progress' },
              { step: '02', title: 'Analyze Patterns', desc: 'Review insights and analytics on your productivity' },
              { step: '03', title: 'Simulate Future', desc: 'Use FutureTwin AI to predict outcomes and optimize decisions' },
              { step: '04', title: 'Achieve Goals', desc: 'Stay consistent and watch your goals become reality' }
            ].map((item, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >

                <div className="flex items-start gap-6 p-2 rounded-3xl cursor-pointer 
bg-white/5 backdrop-blur-lg border border-white/10 
hover:scale-[1.02] hover:bg-white/10 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                 <div className='p-4 flex flex-col sm:flex-row items-start gap-4 sm:gap-6'>
                    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2"> {item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 shadow-[0_0_60px_rgba(99,102,241,0.4)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold young-serif-regular text-white mb-6">
            Ready to Optimize Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who are achieving their goals with WiseMindOS
          </p>
          <Link to="/signup">
            <GradientButton data-testid="cta-signup-btn" className="
    text-lg 
    bg-white text-black 
    bg-gradient-to-r from-green-500 via-blue-500 to-purple-600
    hover:bg-gray-200 
    shadow-[0_0_30px_rgba(255,255,255,0.6)]
  ">
              Start Your Journey Today
            </GradientButton>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative">

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-white mb-2">
              Trusted by Achievers
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-3 text-base md:text-lg">
              Real impact on productivity and growth
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {[
              { value: "10K+", label: "Active Users" },
              { value: "95%", label: "Goal Completion Rate" },
              { value: "2.5x", label: "Productivity Boost" },
              { value: "24/7", label: "AI Support" }
            ].map((stat, index) => (

              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >

                <div className="
                  bg-white/5 backdrop-blur-lg border border-white/10 
                  rounded-2xl cursor-pointer p-6 text-center
                  hover:scale-105 hover:bg-white/10
                  transition-all duration-300
                  hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]
                ">

                  {/* Number */}
                  <h3 className="
                    text-3xl md:text-4xl baloo-2-700 font-extrabold 
                    bg-gradient-to-r from-blue-500 to-purple-700 
                    bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]
                  ">
                    {stat.value}
                  </h3>

                  {/* Label */}
                  <p className="text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </p>

                </div>

              </Motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <Motion.footer
        className="py-16 px-4 bg-gray-800/50 border-t border-gray-700 relative overflow-hidden"
        variants={footerEntrance}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Subtle glow background */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent" />

        <div className="max-w-6xl mx-auto relative">
          <Motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >

            {/* ── Branding ── */}
            <Motion.div variants={fadeUp}>
              <Motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-block mb-4"
              >
                <Link to="/">
                  <h2 className="text-2xl young-serif-regular font-bold">
                    Wise
                    <span className="bg-gradient-to-r text-3xl baloo-2-400 from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Mind
                    </span>
                    OS
                  </h2>
                </Link>
              </Motion.div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your intelligent life tracking and simulation system.
                Optimize your habits, goals, and future decisions.
              </p>
            </Motion.div>

            {/* ── Product Links ── */}
            <Motion.div variants={fadeUp}>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Features', to: '/features' },
                  { label: 'Pricing',  to: '/pricing'  },
                  { label: 'Roadmap',  to: '/roadmap'  },
                ].map(({ label, to }) => (
                  <Motion.li
                    key={label}
                    variants={fadeUp}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <Link to={to}>
                      <Motion.span
                        className="flex items-center gap-2 cursor-pointer"
                        variants={linkHover}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <Motion.span
                          className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0"
                          variants={dotVariant}
                        />
                        {label}
                      </Motion.span>
                    </Link>
                  </Motion.li>
                ))}
              </ul>
            </Motion.div>

            {/* ── Company Links ── */}
            <Motion.div variants={fadeUp}>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'About',   to: '/about'   },
                  { label: 'Careers', to: '/careers' },
                  { label: 'Contact', to: '/contact' },
                ].map(({ label, to }) => (
                  <Motion.li
                    key={label}
                    variants={fadeUp}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <Link to={to}>
                      <Motion.span
                        className="flex items-center gap-2 cursor-pointer"
                        variants={linkHover}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <Motion.span
                          className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0"
                          variants={dotVariant}
                        />
                        {label}
                      </Motion.span>
                    </Link>
                  </Motion.li>
                ))}
              </ul>
            </Motion.div>

            {/* ── CTA / Get Started ── */}
            <Motion.div variants={fadeUp}>
              <h3 className="text-white font-semibold mb-4">Get Started</h3>

              <Link to="/signup">
                <Motion.div
                  whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(99,102,241,0.55)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="mb-4 rounded-xl overflow-hidden"
                >
                  <GradientButton className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      Start Free
                      <Motion.span
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      >
                        <ArrowRight size={18} />
                      </Motion.span>
                    </span>
                  </GradientButton>
                </Motion.div>
              </Link>

              <p className="text-gray-400 text-sm">
                Join thousands building better habits.
              </p>
            </Motion.div>

          </Motion.div>

          {/* ── Bottom bar ── */}
          <Motion.div
            className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            © 2026{' '}
            <Motion.span
              className="inline-block"
              whileHover={{ color: '#818cf8' }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="text-white font-semibold">
                WiseMindOS
              </Link>
            </Motion.span>
            . All rights reserved.
          </Motion.div>
        </div>
      </Motion.footer>
    </div>
  );
};

export default Landing;
