import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Target, 
  Brain, 
  Sparkles, 
  Compass, 
  Rocket, 
  Calendar, 
  ArrowRight, 
  Users, 
  Flame, 
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import logo from '../assets/logo.jpeg';
import profile_pic from '../assets/profile_pic.svg';

const About = () => {
  const teamMembers = [
    {
      name: 'Dr. Elena Rostova',
      role: 'AI Research Lead',
      username: 'elenarostova',
      bio: 'Leading our deep learning initiatives and behavior modeling. Architect of the predictive algorithms powering the FutureTwin simulation environment.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      image: profile_pic,
    },
    {
      name: 'Marcus Vance',
      role: 'UX & Product Designer',
      username: 'marcusvance',
      bio: 'Fusing cognitive behavioral science with modern, premium UI/UX interfaces. Focused on establishing state of the art aesthetics and intuitive interactions.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      image: profile_pic,
    }
  ];

  const values = [
    {
      icon: <Brain className="text-indigo-400" size={32} />,
      title: 'Holistic Growth',
      description: 'We believe personal development is multi-dimensional. WiseMindOS integrates habits, tasks, and long-term goals for complete alignment.'
    },
    {
      icon: <Sparkles className="text-purple-400" size={32} />,
      title: 'Intelligent Feedback',
      description: 'Self-improvement should be driven by precise insights, not guesswork. Our predictive tools simulate outcomes to optimize your path forward.'
    },
    {
      icon: <Compass className="text-indigo-400" size={32} />,
      title: 'Mindful Execution',
      description: 'True productivity balances intense focus with spiritual well-being. We build features designed to keep you present and focused.'
    }
  ];

  const milestones = [
    {
      date: 'Q1 2025',
      title: 'Concept & Foundation',
      description: 'Designed the unified personal development framework and modular tracking models.',
      icon: <Rocket size={20} className="text-indigo-400" />
    },
    {
      date: 'Q3 2025',
      title: 'FutureTwin AI Development',
      description: 'Engineered cognitive behavioral simulation models to predict future growth trajectories.',
      icon: <Brain size={20} className="text-purple-400" />
    },
    {
      date: 'Q1 2026',
      title: 'Global Launch',
      description: 'Launched WiseMindOS public v1.0, empowering over 10k+ active achievers globally.',
      icon: <Flame size={20} className="text-orange-400" />
    },
    {
      date: 'Beyond',
      title: 'Connected Intelligence',
      description: 'Expanding into neural telemetry analytics, cross-platform synchronization, and immersive workspaces.',
      icon: <Sparkles size={20} className="text-indigo-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      
      {/* Glow blobs */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-15 pointer-events-none"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-15 pointer-events-none"
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="WiseMindOS Logo" className="w-9 h-9 rounded-lg object-contain" />
            <span className="text-lg font-bold young-serif-regular">
              Wise<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Mind</span>OS
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-300 hover:text-white transition text-sm font-medium">Home</Link>
            <Link to="/login" className="text-gray-300 hover:text-white transition text-sm font-medium">Login</Link>
            <Link to="/signup">
              <GradientButton className="py-2 px-4 text-sm rounded-lg hover:-translate-y-0.5 shadow-md">
                Get Started
              </GradientButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
              <Sparkles size={16} className="text-indigo-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 young-serif-regular leading-tight">
              Empowering Mindful <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Human Evolution
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              WiseMindOS is designed to serve as the unified operating system for your life. 
              We bridge the gap between structure and self-realization by blending advanced behavior tracking with 
              intelligent predictive simulations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur-sm border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular mb-4">Core Principles</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Our products are shaped by core philosophical and scientific principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:scale-[1.03] transition-all duration-300 h-full flex flex-col p-8">
                  <div className="p-4 bg-indigo-500/10 rounded-xl w-fit mb-6">
                    {val.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">{val.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular mb-4">Our Journey</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 text-sm md:text-base">
              Milestones along our path to building the ultimate life-planning workspace.
            </p>
          </div>

          <div className="relative border-l-2 border-indigo-500/20 pl-8 md:pl-12 space-y-12 ml-4">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Node Dot */}
                <div className="absolute -left-[45px] md:-left-[61px] top-1 w-8 h-8 rounded-full bg-gray-900 border-2 border-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  {milestone.icon}
                </div>

                <Card className="bg-white/5 border border-white/10 hover:border-purple-500/20 transition-all duration-300 p-6">
                  <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase block mb-1">{milestone.date}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-white/5 backdrop-blur-sm border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular mb-4">The Architects</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Meet the minds designing the digital blueprint for personal transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.1)] hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:scale-[1.03] transition-all duration-300 flex flex-col items-center p-8 text-center h-full">
                  
                  {/* Dashboard Profile Picture Pattern */}
                  <div className="h-28 w-28 rounded-full relative group border-6 border-black/15 shadow-[0_0_30px_rgba(99,102,241,0.2)] shrink-0 mb-6">
                    <img 
                      src={member.image} 
                      className="w-full h-full object-cover rounded-full bg-gray-800" 
                      alt={member.name} 
                    />
                    <div className="border-4 h-5 w-5 rounded-full z-10 bottom-0.5 absolute right-0.5 border-green-400 bg-green-500"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1 young-serif-regular">{member.name}</h3>
                  <span className="text-xs text-gray-400 mb-3">@{member.username}</span>
                  <span className="text-sm font-semibold text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full mb-4">
                    {member.role}
                  </span>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{member.bio}</p>

                  {/* Social Buttons */}
                  <div className="flex gap-4">
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-gray-400 hover:text-white transition duration-300"
                    >
                      <Github size={18} />
                    </a>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-gray-400 hover:text-white transition duration-300"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a 
                      href={member.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-gray-400 hover:text-white transition duration-300"
                    >
                      <Twitter size={18} />
                    </a>
                  </div>

                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-indigo-900/60 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold young-serif-regular text-white mb-6">
              Join the WiseMindOS Evolution
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unlock a unified approach to personal tracking, cognitive modeling, and holistic development.
            </p>
            <Link to="/signup">
              <GradientButton className="text-lg py-4 px-8 shadow-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                Start Your Journey Today
              </GradientButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom Footer spacing or copyright */}
      <footer className="py-8 text-center text-gray-500 border-t border-white/5 text-sm bg-black/40">
        © 2026 WiseMindOS. All rights reserved.
      </footer>
    </div>
  );
};

export default About;
