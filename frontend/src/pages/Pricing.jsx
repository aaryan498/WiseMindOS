import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Shield, Sparkles, Zap } from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

const plans = [
  {
    name: 'Starter',
    description: 'For building a personal planning rhythm.',
    monthly: 0,
    yearly: 0,
    cta: 'Start Free',
    accent: 'from-indigo-500 to-blue-500',
    features: [
      '21-day habit tracking',
      'Daily task and goal boards',
      'Basic productivity insights',
      'FutureTwin trial prompts',
    ],
  },
  {
    name: 'Pro',
    description: 'For serious habit, goal, and project systems.',
    monthly: 12,
    yearly: 96,
    cta: 'Choose Pro',
    accent: 'from-purple-500 to-indigo-500',
    highlighted: true,
    features: [
      'Advanced analytics and reports',
      'Unlimited goals and projects',
      'FutureTwin scenario simulations',
      'Priority habit and focus insights',
    ],
  },
  {
    name: 'Team',
    description: 'For accountability groups and guided cohorts.',
    monthly: 29,
    yearly: 240,
    cta: 'Plan Together',
    accent: 'from-fuchsia-500 to-purple-500',
    features: [
      'Shared progress dashboards',
      'Team planning rooms',
      'Admin-ready member controls',
      'Guided onboarding support',
    ],
  },
];

const comparisonRows = [
  ['Habit and task tracking', 'Included', 'Unlimited', 'Unlimited'],
  ['FutureTwin simulations', 'Trial', 'Advanced', 'Team scenarios'],
  ['Analytics depth', 'Basic', 'Advanced', 'Group reporting'],
  ['Support priority', 'Community', 'Priority', 'Dedicated'],
];

const MotionHeader = motion.header;
const MotionSection = motion.section;
const MotionDiv = motion.div;

const Pricing = () => {
  const [billing, setBilling] = useState('monthly');
  const isYearly = billing === 'yearly';

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 py-10">
      <div className="w-full max-w-6xl mx-auto">
        <MotionHeader
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-12"
        >
          <div className="min-w-0 max-w-3xl">
            <Link to="/" className="flex w-fit items-center gap-2 text-sm text-indigo-300 hover:text-white transition mb-6">
              Wise<span className="text-purple-300">Mind</span>OS
            </Link>
            <div className="flex w-fit max-w-full items-start gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-200 mb-5">
              <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
              <span className="min-w-0">Flexible plans for every growth system</span>
            </div>
            <h1 className="max-w-full text-4xl md:text-6xl font-extrabold tracking-normal text-white mb-5">
              Pricing that scales with your discipline.
            </h1>
            <p className="max-w-full text-lg md:text-xl text-gray-400 leading-relaxed">
              Start with personal tracking, then unlock deeper analytics, simulations, and shared planning when your system matures.
            </p>
          </div>

          <div className="w-full min-w-0 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-2">
            <div className="grid grid-cols-2 gap-2">
              {['monthly', 'yearly'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBilling(option)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    billing === option
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_22px_rgba(99,102,241,0.35)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {option === 'monthly' ? 'Monthly' : 'Yearly'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Yearly billing includes two months free.</p>
          </div>
        </MotionHeader>

        <section className="grid min-w-0 grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearly : plan.monthly;
            const cadence = isYearly && price > 0 ? '/yr' : price > 0 ? '/mo' : '';

            return (
              <MotionDiv
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <Card
                  className={`h-full min-w-0 border backdrop-blur-lg transition ${
                    plan.highlighted
                      ? 'bg-white/10 border-purple-400/40 shadow-[0_0_34px_rgba(124,58,237,0.25)]'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${plan.accent} mb-6`} />
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                    {plan.highlighted && (
                      <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-200">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 min-h-14">{plan.description}</p>
                  <div className="my-8">
                    <span className="text-5xl font-extrabold">${price}</span>
                    <span className="text-gray-400 ml-2">{cadence}</span>
                  </div>
                  <Link to="/signup" className="block min-w-0 mb-8">
                    <GradientButton className="w-full flex items-center justify-center gap-2">
                      {plan.cta}
                      <ArrowRight size={18} />
                    </GradientButton>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-300">
                        <Check size={18} className="mt-0.5 text-indigo-300 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </MotionDiv>
            );
          })}
        </section>

        <section className="grid min-w-0 grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 mb-14">
          <Card className="min-w-0 bg-white/5 border border-white/10 backdrop-blur-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-300">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Plan comparison</h2>
                <p className="text-gray-400 text-sm">Pick the tier that matches your operating system.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['2 mo', 'free on yearly'],
                ['3 tiers', 'for every stage'],
                ['24/7', 'AI workflows'],
                ['0 lock-in', 'start free'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-black/20 border border-white/10 p-4">
                  <p className="text-2xl font-bold text-indigo-300">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="min-w-0 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="grid min-w-[680px] grid-cols-4 bg-white/10 text-sm font-semibold text-gray-200">
              <div className="p-4">Feature</div>
              <div className="p-4">Starter</div>
              <div className="p-4">Pro</div>
              <div className="p-4">Team</div>
            </div>
            {comparisonRows.map((row) => (
              <div key={row[0]} className="grid min-w-[680px] grid-cols-4 border-t border-white/10 text-sm text-gray-400">
                {row.map((cell, index) => (
                  <div key={cell} className={`p-4 ${index === 0 ? 'text-white font-medium' : ''}`}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 p-8 md:p-10 text-center shadow-[0_0_45px_rgba(99,102,241,0.28)]"
        >
          <div className="flex justify-center mb-5">
            <div className="rounded-full bg-white/10 p-3 text-white">
              <Zap size={28} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Build the system before motivation fades.</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Turn planning, focus, analytics, and simulations into a daily loop that keeps compounding.
          </p>
          <Link to="/signup">
            <GradientButton className="bg-white text-black hover:bg-gray-100">
              Start with WiseMindOS
            </GradientButton>
          </Link>
        </MotionSection>
      </div>
    </div>
  );
};

export default Pricing;
