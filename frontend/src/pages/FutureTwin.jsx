import { useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { futureTwinMockResponse } from '../data/mockData';

const FutureTwin = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use mock response with user's query
    setResult({
      ...futureTwinMockResponse,
      query: query
    });
    
    setIsLoading(false);
  };

  const getImpactColor = (impact) => {
    return impact === 'Positive' ? 'text-green-400' : 'text-red-400';
  };

  const getAchievabilityColor = (achievability) => {
    if (achievability === 'High') return 'bg-green-500/20 text-green-400';
    if (achievability === 'Medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles size={40} className="text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">FutureTwin AI</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Simulate future outcomes based on your actions
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Ask Your Future Twin</h2>
          
          <div className="space-y-4">
            <div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What if I study 4 hours daily from today?&#10;What if I exercise 5 days a week?&#10;What if I complete one project per month?"
                data-testid="futuretwin-input"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[150px] text-lg"
              />
            </div>
            
            <GradientButton 
              onClick={handleSimulate} 
              className="w-full text-lg py-4"
              disabled={isLoading || !query.trim()}
              data-testid="simulate-future-btn"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing Future...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={20} />
                  Simulate Future
                </span>
              )}
            </GradientButton>
          </div>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6" data-testid="futuretwin-result">
            {/* Query Echo */}
            <Card className="bg-indigo-900/20 border border-indigo-500/30">
              <p className="text-gray-300 italic">"{result.query}"</p>
            </Card>

            {/* Impact & Achievability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className={getImpactColor(result.impact)} size={24} />
                  <h3 className="text-lg font-semibold text-white">Impact</h3>
                </div>
                <p className={`text-3xl font-bold ${getImpactColor(result.impact)}`}>
                  {result.impact}
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="text-indigo-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Achievability</h3>
                </div>
                <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getAchievabilityColor(result.achievability)}`}>
                  {result.achievability}
                </span>
              </Card>
            </div>

            {/* Required Habits */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-400" size={24} />
                <h3 className="text-xl font-semibold text-white">Required Habits</h3>
              </div>
              <ul className="space-y-3">
                {result.requiredHabits.map((habit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Habits to Avoid */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="text-red-400" size={24} />
                <h3 className="text-xl font-semibold text-white">Habits to Avoid</h3>
              </div>
              <ul className="space-y-3">
                {result.habitsToAvoid.map((habit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Insights */}
            <Card className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-yellow-400" size={24} />
                <h3 className="text-xl font-semibold text-white">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {result.insights.map((insight, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-300 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Try Another */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null);
                  setQuery('');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Ask Another Question →
              </button>
            </div>
          </div>
        )}

        {/* Example Questions */}
        {!result && (
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Example Questions</h3>
            <div className="space-y-2">
              {[
                'What if I wake up at 5 AM every day?',
                'What if I read 30 pages daily?',
                'What if I exercise 5 times a week?',
                'What if I reduce social media to 30 mins per day?'
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                  data-testid={`example-question-${index}`}
                >
                  {example}
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const Target = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

export default FutureTwin;