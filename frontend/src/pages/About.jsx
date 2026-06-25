import { motion } from 'framer-motion';
import { Target, Heart, Shield, Zap, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

const About = () => {
  const team = [
    {
      name: "Aaryan",
      role: "Founder & Lead Developer",
      bio: "Passionate about building systems that optimize human potential and productivity.",
      socials: { github: "#", twitter: "#", linkedin: "#" }
    },
    {
      name: "Sarah Chen",
      role: "AI Architect",
      bio: "Spearheading the FutureTwin AI to make predictable and actionable future simulations.",
      socials: { github: "#", twitter: "#", linkedin: "#" }
    },
    {
      name: "Marcus Johnson",
      role: "UX/UI Lead",
      bio: "Designing seamless, distraction-free experiences for deep focus and balanced growth.",
      socials: { github: "#", twitter: "#", linkedin: "#" }
    }
  ];

  const milestones = [
    { year: "2024", title: "The Inception", desc: "WiseMindOS started as a simple idea to bridge the gap between task management and holistic life tracking." },
    { year: "2025", title: "FutureTwin AI Beta", desc: "Successfully launched the first iteration of our predictive AI engine to early adopters." },
    { year: "2026", title: "Public Launch", desc: "Opening WiseMindOS to the world to help thousands optimize their daily lives." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
        <motion.section animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative min-h-[70vh] flex items-center justify-center px-4 pt-32 pb-20">
          
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
              Empowering Minds, <br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Optimizing Futures.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We are building WiseMindOS to be more than just a productivity tool. It is an intelligent ecosystem designed to help you align your daily habits with your ultimate life goals.
            </p>
          </div>
        </motion.section>
      </motion.div>

      {/* 2. Core Values Section (Protected Bento Layout & Border Glows) */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4 w-full"
          >
            <div className="text-left w-full md:w-auto -ml-1 md:ml-0">
              {/* FIXED: Added young-serif-regular */}
              <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-white mb-2">Our Core Values</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-2"></div>
            </div>
            <p className="text-gray-400 max-w-md text-sm md:text-base text-left md:text-right">
              The fundamental principles behind everything we build at WiseMindOS.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {/* Bento Item 1 - Large */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0 * 0.1 }} className="md:col-span-2 group h-full">
              <motion.div className="h-full rounded-2xl" animate={{ boxShadow: ['0px 0px 0px rgba(99,102,241,0)', '0px 0px 20px 2px rgba(99,102,241,0.25)', '0px 0px 0px rgba(99,102,241,0)'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full relative overflow-hidden flex flex-col justify-end p-8">
                  <motion.div className="absolute -right-10 -top-10 text-white/5 transition-colors duration-500 group-hover:text-indigo-500/10" animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 50, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>
                    <Target size={200} />
                  </motion.div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-white">Intentionality</h3>
                    <p className="text-gray-400 text-lg">Every feature is designed with a clear purpose to drive focused action and eliminate digital distractions.</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Bento Item 2 - Small */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 1 * 0.1 }} className="md:col-span-1 group h-full">
              <motion.div className="h-full rounded-2xl" animate={{ boxShadow: ['0px 0px 0px rgba(124,58,237,0)', '0px 0px 15px 2px rgba(124,58,237,0.25)', '0px 0px 0px rgba(124,58,237,0)'] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full hover:bg-white/10 transition-colors duration-500">
                  <div className="p-3 bg-indigo-500/20 rounded-xl w-fit mb-6 text-indigo-400">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Data Privacy</h3>
                  <p className="text-gray-400 text-sm">Your life's data is yours. We build with privacy and security at our core.</p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Bento Item 3 - Small */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 2 * 0.1 }} className="md:col-span-1 group h-full">
              <motion.div className="h-full rounded-2xl" animate={{ boxShadow: ['0px 0px 0px rgba(99,102,241,0)', '0px 0px 15px 2px rgba(99,102,241,0.25)', '0px 0px 0px rgba(99,102,241,0)'] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full hover:bg-white/10 transition-colors duration-500">
                  <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-6 text-purple-400">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Holistic Growth</h3>
                  <p className="text-gray-400 text-sm">We believe productivity shouldn't come at the cost of your personal well-being.</p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Bento Item 4 - Large */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 3 * 0.1 }} className="md:col-span-2 group h-full">
              <motion.div className="h-full rounded-2xl" animate={{ boxShadow: ['0px 0px 0px rgba(124,58,237,0)', '0px 0px 20px 2px rgba(124,58,237,0.25)', '0px 0px 0px rgba(124,58,237,0)'] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 h-full flex flex-col md:flex-row items-center gap-8 p-8 relative overflow-hidden">
                  <motion.div animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="p-5 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Zap size={40} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Continuous Evolution</h3>
                    <p className="text-gray-400 text-lg">Always learning, iterating, and adapting to build the ultimate operating system for your daily life.</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-center mb-16"
          >
            {/* FIXED: Added young-serif-regular */}
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-white mb-2">Meet the Minds</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mt-2"></div>
            <p className="text-gray-400 mt-4 text-base md:text-lg">The dedicated team behind the operating system for your life.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group h-full">
                <motion.div className="h-full rounded-2xl" animate={{ boxShadow: ['0px 0px 0px rgba(99,102,241,0)', '0px 0px 18px 2px rgba(99,102,241,0.2)', '0px 0px 0px rgba(99,102,241,0)'] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}>
                  <Card className="bg-white/5 backdrop-blur-lg border border-white/10 text-center relative overflow-hidden h-full hover:bg-white/10 transition-colors duration-500">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 p-[2px]">
                       <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {member.name.charAt(0)}
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-indigo-400 text-xs tracking-widest uppercase mb-4 font-semibold">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-8 px-2">{member.bio}</p>
                    <div className="flex justify-center gap-5 pt-4 border-t border-white/10">
                      <a href={member.socials.github} className="text-gray-400 hover:text-white transition-colors"><Github size={18} /></a>
                      <a href={member.socials.twitter} className="text-gray-400 hover:text-indigo-400 transition-colors"><Twitter size={18} /></a>
                      <a href={member.socials.linkedin} className="text-gray-400 hover:text-purple-400 transition-colors"><Linkedin size={18} /></a>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Timeline / Journey (Protected Timeline Formation Animation) */}
      <section className="py-20 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="text-center mb-16"
          >
            {/* FIXED: Added young-serif-regular */}
            <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-white mb-2">Our Journey</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full mt-2"></div>
          </motion.div>

          <div className="relative border-l border-white/10 ml-3 md:ml-6 space-y-16">
            <motion.div 
              className="absolute top-0 -left-[1px] w-[2px] h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent origin-top z-0" 
              initial={{ scaleY: 0 }} 
              whileInView={{ scaleY: 1 }} 
              viewport={{ once: true, margin: "0px 0px -200px 0px" }} 
              transition={{ duration: 1.5, ease: "easeInOut" }} 
            />

            {milestones.map((milestone, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -50 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                transition={{ duration: 0.6, delay: idx * 0.2 }} 
                className="relative pl-8 md:pl-12 group z-10"
              >
                <motion.div 
                  className="absolute -left-[5px] md:-left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500" 
                  animate={{ boxShadow: ["0 0 10px rgba(99,102,241,0.5)", "0 0 25px rgba(99,102,241,0.9)", "0 0 10px rgba(99,102,241,0.5)"] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                />
                <span className="text-sm font-bold text-indigo-400 tracking-wider uppercase mb-1 block">
                  {milestone.year}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{milestone.title}</h3>
                <p className="text-gray-400">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-12 md:p-16 text-center">
            {/* FIXED: Added young-serif-regular */}
            <h2 className="text-3xl md:text-5xl font-bold young-serif-regular text-white mb-6">Ready to shape your future?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join the community of forward-thinkers who are taking control of their habits, goals, and digital lives.
            </p>
            <Link to="/signup">
              <GradientButton className="text-lg px-8 py-4 flex items-center justify-center gap-2 mx-auto">
                Get Started with WiseMindOS
                <ArrowRight size={20} />
              </GradientButton>
            </Link>
          </Card>
        </motion.div>
      </section>

    </div>
  );
};

export default About;