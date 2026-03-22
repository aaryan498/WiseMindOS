import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import { validateEmail } from '../utils/helpers';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    goals: []
  });
  const [error, setError] = useState('');

  const goalOptions = [
    'Improve Productivity',
    'Build Better Habits',
    'Achieve Fitness Goals',
    'Learn New Skills',
    'Career Growth',
    'Mental Wellness'
  ];

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setStep(2);
  };

  const handleGoalToggle = (goal) => {
    if (formData.goals.includes(goal)) {
      setFormData({
        ...formData,
        goals: formData.goals.filter(g => g !== goal)
      });
    } else {
      setFormData({
        ...formData,
        goals: [...formData.goals, goal]
      });
    }
  };

  const handleFinalSubmit = () => {
    // Mock signup - in real app would call API
    localStorage.setItem('wisemind_user', JSON.stringify({ 
      name: formData.name,
      email: formData.email,
      goals: formData.goals
    }));
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-bold text-white mb-2">
              Wise<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mind</span>OS
            </h1>
          </Link>
          <p className="text-gray-400">Create your account and start tracking</p>
        </div>

        <Card>
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="space-y-4">
                <InputField
                  label="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />

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
                  placeholder="Create a password (min 6 characters)"
                  required
                />

                <GradientButton type="submit" className="w-full mt-6" data-testid="signup-continue-btn">
                  Continue
                </GradientButton>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Goals</h2>
              <p className="text-gray-400 mb-6">Choose what you want to achieve (optional)</p>

              <div className="space-y-3 mb-6">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    data-testid={`goal-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.goals.includes(goal)
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Back
                </button>
                <GradientButton 
                  onClick={handleFinalSubmit} 
                  className="flex-1"
                  data-testid="signup-finish-btn"
                >
                  Get Started
                </GradientButton>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Login
                </Link>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Signup;