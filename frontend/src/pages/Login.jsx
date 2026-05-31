import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { authAPI } from '../api/apiService';
import { showToast } from '../utils/toastHelper';

import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';

const Login = () => {
  const { token, setToken, user, setUser, navigate } = useApp();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getAuthErrorMessage = (error, fallback) => {
    return error?.response?.data?.message || error?.message || fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');
    const identifier = formData.identifier.trim();
    const password = formData.password.trim();

    // Structural input validation guardrails
    if (!identifier && !password) {
      setError('Enter your email or username and password to continue.');
      return;
    }
    if (!identifier) {
      setError('Enter your email or username.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login({ identifier, password });

      if (response.success) {
        setToken(response.token);
        localStorage.setItem('token', response.token);

        const userData = response.user || {
          name: response.name || 'User',
          username: response.username,
          email: response.email,
          bio: response.bio,
          profile_picture: response.profile_picture
        };
        
        setUser(userData);
        localStorage.setItem('wisemind_user', JSON.stringify(userData));
        showToast({ message: response.message || 'Login Successful', status: "success" });
      } else {
        const failMessage = response.message || 'Login failed';
        setError(failMessage);
        showToast({ message: failMessage, status: 'error' });
      }
    } catch (err) {
      console.error('Login submission error:', err);
      const message = getAuthErrorMessage(err, 'Unable to log in. Please check your details and try again.');
      setError(message);
      showToast({ message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Session route tracking hook
  useEffect(() => {
    if (token && user) {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      
      {/* Background Decorative Lighting Gradients */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-15 pointer-events-none"
        animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-600 rounded-full blur-[120px] opacity-15 pointer-events-none"
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        
        {/* Branding Area Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1">
            <motion.h1 
              className="text-4xl font-extrabold tracking-tight text-white mb-2"
              animate={{ textShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 25px rgba(99,102,241,0.5)", "0px 0px 0px rgba(99,102,241,0)"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Wise<span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto]">Mind</span>OS
            </motion.h1>
          </Link>
          <p className="text-slate-400 text-sm mt-0.5 font-medium">Welcome back! Access your workspace engine.</p>
        </div>

        {/* Core Credentials Authentication Panel Form */}
        <Card className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h2 className="text-xl font-bold text-center text-slate-200 tracking-wide mb-6">Account Verification</h2>

          {error && (
            <div role="alert" className="bg-rose-500/5 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs font-medium tracking-wide leading-relaxed mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <InputField
                label="Identity Identifier"
                type="text"
                value={formData.identifier}
                disabled={isLoading}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Email address or username"
                required
                className="w-full pl-11 focus:border-indigo-500/50 transition-all"
              />
              <User className="absolute left-3.5 bottom-3.5 text-slate-500 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <InputField
                label="Security Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                disabled={isLoading}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter workspace key passphrase"
                required
                className="w-full pl-11 pr-11 focus:border-indigo-500/50 transition-all"
              />
              <Lock className="absolute left-3.5 bottom-3.5 text-slate-500 pointer-events-none" size={16} />
              
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-3 p-0.5 text-slate-500 hover:text-slate-300 transition-colors border-none bg-transparent outline-none cursor-pointer focus-visible:text-indigo-400"
                title={showPassword ? "Hide password context string" : "Reveal password context string"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <GradientButton 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 py-3.5 shadow-lg shadow-indigo-600/10" 
              data-testid="login-submit-btn"
            >
              {isLoading ? "Validating Session Tokens..." : "Initialize Boot Authorization"}
            </GradientButton>
          </form>

          {/* Footer Routing Navigation Links */}
          <div className="mt-6 text-center border-t border-white/5 pt-4">
            <p className="text-slate-400 text-xs font-medium">
              Missing profile registration infrastructure?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1 outline-none focus:underline">
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;