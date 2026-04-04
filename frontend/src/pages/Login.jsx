import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import { validateEmail } from '../utils/helpers';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useApp } from '../store/AppContext';


const Login = () => {
  const { token, setToken, navigate, backendURL } = useApp()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    // Mock login - in real app would call API
    // localStorage.setItem('wisemind_user', JSON.stringify({ email: formData.email }));

    try {

      const response = await axios.post(backendURL + '/api/user/login', formData)
      if(response.data.success){
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
      } else{
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error)
    }

    

    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem('wisemind_hasOnboarded');
    if (hasOnboarded === 'true') {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  useEffect(()=>{
    if(token){
      navigate('/');
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <motion.h1 className="text-4xl young-serif-regular font-bold text-white mb-2"
            animate={{
                textShadow: [
                  "0px 0px 0px rgba(99,102,241,0)",        // no glow
                  "0px 0px 20px rgba(99,102,241,0.8)",     // glow
                  "0px 0px 0px rgba(99,102,241,0)"         // back to normal
                ]
              }}

              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}>
              Wise<span className="bg-gradient-to-r from-indigo-500 to-purple-600 baloo-2-700 md:text-5xl bg-clip-text text-transparent">Mind</span>OS
            </motion.h1>
          </Link>
          <p className="text-gray-400">Welcome back! Login to continue</p>
        </div>

        <Card className="
bg-white/5 backdrop-blur-xl 
border border-white/10 
rounded-2xl p-8
shadow-[0_0_40px_rgba(99,102,241,0.2)]
">
          <h2 className="text-2xl font-bold young-serif-regular text-center text-gray-200 mb-6">Login</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />

            <GradientButton type="submit" className="w-full mt-6" data-testid="login-submit-btn">
              Login
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;