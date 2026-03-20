import { Link } from 'react-router-dom';
import { Target, TrendingUp, Sparkles, Brain, CheckCircle, Zap } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';

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
      description: 'Focus on balanced growth and reduce burnout'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-violet-900/20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Wise<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mind</span>OS
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
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
                className="px-8 py-3 border-2 border-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-500/10 transition-all duration-300 w-full sm:w-auto"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for holistic personal development</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:scale-105 transition-transform duration-300">
                <div className="text-indigo-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple steps to transform your life</p>
          </div>
          
          <div className="space-y-8">
            {[
              { step: '01', title: 'Track Your Life', desc: 'Log your daily habits, tasks, and progress' },
              { step: '02', title: 'Analyze Patterns', desc: 'Review insights and analytics on your productivity' },
              { step: '03', title: 'Simulate Future', desc: 'Use FutureTwin AI to predict outcomes and optimize decisions' },
              { step: '04', title: 'Achieve Goals', desc: 'Stay consistent and watch your goals become reality' }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/30 to-violet-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who are achieving their goals with WiseMindOS
          </p>
          <Link to="/signup">
            <GradientButton data-testid="cta-signup-btn" className="text-lg">
              Start Your Journey Today
            </GradientButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 border-t border-gray-700">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 WiseMindOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;