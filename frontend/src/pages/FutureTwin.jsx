import { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use mock response with user's query
    setResult({
      ...futureTwinMockResponse,
      query: query
    });
    
    setIsLoading(false);
  };

  const getFeasibilityColor = (feasibility) => {
    if (feasibility === 'High') return 'text-green-400 bg-green-500/20';
    if (feasibility === 'Medium') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
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
            Simulate your future outcomes based on your actions
          </p>
        </div>

        {!result && (
          <>
            {/* Human Model / Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                
                <div className="relative bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-full p-8 border-4 border-indigo-500/30">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-indigo-300"
                  >
                    <circle cx="60" cy="35" r="18" fill="currentColor" opacity="0.8" />
                    
                    <path d="M60 53 L60 85" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
                    
                    <path d="M60 60 L40 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                    <path d="M60 60 L80 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                    
                    <path d="M60 85 L45 110" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
                    <path d="M60 85 L75 110" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
                  </svg>
                </div>

                <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            <Card className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">Ask Your Future Twin</h2>
              
              <div className="space-y-4">
                <div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What if I study 4 hours daily from today?&#10;What if I exercise 5 days a week for 3 months?&#10;What if I wake up at 5 AM every day?&#10;What if I read 30 pages daily?"
                    data-testid="futuretwin-input"
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[180px] text-lg resize-none"
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
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Simulating Future...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={24} />
                      Simulate Future
                    </span>
                  )}
                </GradientButton>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Example Questions</h3>
              <div className="space-y-2">
                {[
                  'What if I wake up at 5 AM every day?',
                  'What if I read 30 pages daily for a year?',
                  'What if I exercise 5 times a week?',
                  'What if I reduce social media to 30 mins per day?',
                  'What if I learn coding 2 hours daily?'
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
          </>
        )}

        {result && (
          <div className="space-y-6" data-testid="futuretwin-result">
            <Card className="bg-indigo-900/20 border border-indigo-500/30">
              <div className="flex items-start gap-3">
                <Sparkles className="text-indigo-400 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="text-gray-400 text-sm mb-1">Your Question:</p>
                  <p className="text-white text-lg font-medium italic">"{result.query}"</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="text-blue-400" size={24} />
                  <h3 className="text-xl font-semibold text-white">Feasibility</h3>
                </div>
                <div className={`inline-block px-6 py-3 rounded-full text-xl font-bold ${getFeasibilityColor(result.feasibility)}`}>
                  {result.feasibility}
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  This goal is {result.feasibility.toLowerCase()} feasible with proper planning and commitment.
                </p>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-3">
                  {result.isGood ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <XCircle className="text-red-400" size={24} />
                  )}
                  <h3 className="text-xl font-semibold text-white">Is It Good?</h3>
                </div>
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${
                  result.isGood 
                    ? 'text-green-400 bg-green-500/20' 
                    : 'text-red-400 bg-red-500/20'
                }`}>
                  {result.isGood ? (
                    <>
                      <CheckCircle size={24} />
                      Yes, Recommended
                    </>
                  ) : (
                    <>
                      <XCircle size={24} />
                      Needs Consideration
                    </>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  {result.isGood 
                    ? 'This action aligns well with personal growth and success.'
                    : 'Consider potential drawbacks before proceeding.'}
                </p>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-400" size={28} />
                <h3 className="text-2xl font-semibold text-white">Benefits</h3>
              </div>
              <ul className="space-y-3">
                {result.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-200">
                    <span className="text-green-400 mt-1 text-xl flex-shrink-0">✓</span>
                    <span className="text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-orange-400" size={28} />
                <h3 className="text-2xl font-semibold text-white">Consequences & Challenges</h3>
              </div>
              <ul className="space-y-3">
                {result.consequences.map((consequence, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-200">
                    <span className="text-orange-400 mt-1 text-xl flex-shrink-0">⚠</span>
                    <span className="text-base">{consequence}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-yellow-400" size={28} />
                <h3 className="text-2xl font-semibold text-white">AI Insights & Recommendations</h3>
              </div>
              <div className="space-y-4">
                {result.insights.map((insight, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-indigo-500">
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-400 font-bold text-lg flex-shrink-0">{index + 1}.</span>
                      <p className="text-gray-200 leading-relaxed text-base">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setQuery('');
                }}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold text-lg"
                data-testid="ask-another-btn"
              >
                Ask Another Question →
              </button>
              <button
                onClick={() => {
                  alert('Feature coming soon: Save insights to your goals!');
                }}
                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all font-semibold text-lg"
              >
                Save to My Goals
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureTwin;