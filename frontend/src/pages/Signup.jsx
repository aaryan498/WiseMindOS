import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../store/AppContext';
import { authAPI } from '../api/apiService';
import { showToast } from '../utils/toastHelper';
import { validateEmail } from '../utils/helpers';

import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';

const Signup = () => {
  const { setToken, setUser, navigate } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Password Validation Constraints Array
  const passwordRules = [
    { label: 'At least 8 characters', isValid: formData.password.length >= 8 },
    { label: 'One uppercase letter', isValid: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter', isValid: /[a-z]/.test(formData.password) },
    { label: 'One number', isValid: /\d/.test(formData.password) },
  ];

  const getAuthErrorMessage = (err, fallback) => {
    return err?.response?.data?.message || err?.message || fallback;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');

    const payload = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    // Strict structural evaluation validation guardrails
    if (!payload.name || !payload.email || !payload.password || !payload.username) {
      setError('Please complete all required fields before creating your account.');
      return;
    }

    if (!validateEmail(payload.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const missingPasswordRule = passwordRules.find((rule) => !rule.isValid);
    if (missingPasswordRule) {
      setError(`Password must include: ${missingPasswordRule.label.toLowerCase()}.`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.register(payload);
      
      if (response.success) {
        setToken(response.token);
        localStorage.setItem('token', response.token);
        
        const userData = response.user || { 
          name: payload.name,
          username: payload.username,
          email: payload.email,
          bio: response.bio || '',
        };
        
        setUser(userData);
        localStorage.setItem('wisemind_user', JSON.stringify(userData));
        showToast({ message: response.message || 'Account created successfully!', status: 'success' });
        navigate('/onboarding');
      } else {
        const failMessage = response.message || 'Signup failed';
        setError(failMessage);
        showToast({ message: failMessage, status: 'error' });
      }
    } catch (err) {
      console.error('Registration API error:', err);
      const message = getAuthErrorMessage(err, 'Unable to create your account. Please try again.');
      setError(message);
      showToast({ message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      
      {/* Background Decorative Ambient Radials */}
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
        
        {/* Header Title Branding */}
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
          <p className="text-slate-400 text-sm mt-0.5 font-medium">Create your architecture node and start tracking.</p>
        </div>

        {/* Credentials Form Layout Block */}
        <Card className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h2 className="text-xl font-bold text-center text-slate-200 tracking-wide mb-6">Profile Creation</h2>

          {error && (
            <div role="alert" aria-live="polite" className="bg-rose-500/5 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs font-medium tracking-wide leading-relaxed mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              value={formData.name}
              disabled={isLoading}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              required
              className="w-full focus:border-indigo-500/50 transition-all"
            />

            <InputField
              label="Account Namespace (Username)"
              type="text"
              value={formData.username}
              disabled={isLoading}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose structural handle"
              required
              className="w-full focus:border-indigo-500/50 transition-all"
            />

            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              disabled={isLoading}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter system mail path"
              required
              className="w-full focus:border-indigo-500/50 transition-all"
            />

            <InputField
              label="Security Key Passphrase"
              type="password"
              value={formData.password}
              disabled={isLoading}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a strong password"
              required
              className="w-full focus:border-indigo-500/50 transition-all"
            />
            
            {/* Real-time interactive security metric rules validation checklist */}
            <div className="space-y-1.5 pt-1 text-xs select-none">
              {passwordRules.map((rule) => (
                <div 
                  key={rule.label} 
                  className={`flex items-center gap-2 font-medium tracking-wide transition-colors duration-200 ${
                    rule.isValid ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                  }`}
                >
                  <span className="font-mono text-sm leading-none">{rule.isValid ? '✓' : '•'}</span>
                  <span>{rule.label}</span>
                </div>
              ))}
            </div>

            <GradientButton 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 py-3.5 shadow-lg shadow-indigo-600/10" 
              data-testid="signup-continue-btn"
            >
              {isLoading ? "Compiling Matrix Profile..." : "Deploy New Matrix Profile"}
            </GradientButton>
          </form>

          {/* Core Footer Link Routing */}
          <div className="mt-6 text-center border-t border-white/5 pt-4">
            <p className="text-slate-400 text-xs font-medium">
              Already have an authorization mapping?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1 outline-none focus:underline">
                Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;