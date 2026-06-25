import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Library,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Workflow,
  Zap,
  Layers3,
} from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import StatCard from '../components/StatCard';
import { useApp } from '../store/AppContext';
import digitwin from '../assets/digitwin.png';

const featureStats = [
  {
    title: 'Core systems',
    value: '8',
    icon: <Layers3 size={22} className="text-white" />,
  },
  {
    title: 'Planning layers',
    value: '4',
    icon: <Workflow size={22} className="text-white" />,
  },
  {
    title: 'AI-powered support',
    value: '24/7',
    icon: <Sparkles size={22} className="text-white" />,
  },
  {
    title: 'Decision clarity',
    value: '1 hub',
    icon: <ShieldCheck size={22} className="text-white" />,
  },
];

const coreFeatures = [
  {
    title: 'Goal Management',
    label: 'Direction',
    icon: Target,
    description: 'Create final, long-term, and mid-term goals that keep your daily work aligned to bigger outcomes.',
    benefits: ['Clarify priorities', 'Track progress visually', 'Stay connected to long-range plans'],
  },
  {
    title: 'Project Tracking',
    label: 'Execution',
    icon: Layers3,
    description: 'Break major goals into manageable projects so progress feels structured instead of overwhelming.',
    benefits: ['Organize milestones', 'Link projects to goals', 'Reduce scattered execution'],
  },
  {
    title: 'Solo Tasks',
    label: 'Action',
    icon: CheckCircle2,
    description: 'Capture tasks, deadlines, and priorities in a focused system built for actual daily movement.',
    benefits: ['Prioritize clearly', 'Reduce missed deadlines', 'Keep momentum visible'],
  },
  {
    title: '21-Day Habit Tracker',
    label: 'Consistency',
    icon: Zap,
    description: 'Build good habits, break bad ones, and make streak-based consistency easier to sustain.',
    benefits: ['Reinforce routines', 'See streak momentum', 'Turn repetition into identity'],
  },
  {
    title: 'Daily Planning',
    label: 'Rhythm',
    icon: CalendarDays,
    description: 'Convert tasks and habits into time-based daily plans that support focus instead of reactive work.',
    benefits: ['Design better days', 'Balance priorities', 'Act with intention'],
  },
  {
    title: 'Focus Room',
    label: 'Deep Work',
    icon: TimerReset,
    description: 'Use dedicated focus sessions to protect attention and build repeatable deep-work habits.',
    benefits: ['Create focus blocks', 'Protect attention', 'Improve follow-through'],
  },
  {
    title: 'FutureTwin AI',
    label: 'Intelligence',
    icon: Brain,
    description: 'Preview possible outcomes from habits, routines, and commitments before they compound.',
    benefits: ['Simulate choices', 'Test scenarios', 'Make calmer decisions'],
  },
  {
    title: 'Analytics and Library',
    label: 'Insight',
    icon: BarChart3,
    description: 'Review productivity signals and capture knowledge in one place so reflection becomes part of progress.',
    benefits: ['Spot patterns early', 'Track discipline', 'Store what matters'],
  },
];

const showcaseSections = [
  {
    eyebrow: 'Connected Planning',
    title: 'Move from long-term goals to today’s execution without losing context.',
    description:
      'WiseMindOS links goals, projects, tasks, habits, and daily planning into one connected operating flow.',
    points: [
      'Map strategy to concrete next steps',
      'Keep priorities visible across different time horizons',
      'Reduce context-switching between disconnected tools',
    ],
    visual: 'planning',
  },
  {
    eyebrow: 'Live Signals',
    title: 'See productivity, discipline, and consistency in one dashboard language.',
    description:
      'Your data is organized to surface the signals that matter: how consistent you are, what is slipping, and where momentum is building.',
    points: [
      'Highlight discipline and productivity trends',
      'Track goal progress and task completion together',
      'Turn reflection into clear next actions',
    ],
    visual: 'insights',
  },
  {
    eyebrow: 'Decision Support',
    title: 'Use FutureTwin AI to think ahead before routines become outcomes.',
    description:
      'The platform extends beyond tracking by helping users reason about consequences, choices, and the direction of their current systems.',
    points: [
      'Simulate what different choices might lead to',
      'Reduce guesswork with structured reflection',
      'Combine planning with predictive thinking',
    ],
    visual: 'future',
  },
];

const benefitCards = [
  {
    title: 'One operating system',
    description: 'No more splitting attention between separate habit apps, task boards, notes, and analytics dashboards.',
    icon: Workflow,
  },
  {
    title: 'Built for momentum',
    description: 'Every module is designed to help small actions compound into visible, measurable progress.',
    icon: Rocket,
  },
  {
    title: 'Clarity under pressure',
    description: 'The interface stays calm and structured so important decisions feel easier even during overloaded weeks.',
    icon: ShieldCheck,
  },
];

const renderShowcaseVisual = (visual) => {
  if (visual === 'planning') {
    return (
      <Card className="border border-white/10 bg-black/25 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
        <div className="space-y-3">
          {[
            { label: 'Goal', title: 'Launch a healthier weekly rhythm', accent: 'from-indigo-500/20 to-purple-500/10' },
            { label: 'Project', title: 'Design a repeatable planning system', accent: 'from-cyan-500/20 to-indigo-500/10' },
            { label: 'Today', title: 'Review goals, habits, and top 3 tasks', accent: 'from-emerald-500/20 to-teal-500/10' },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-white/10 bg-gradient-to-r ${item.accent} p-4`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-indigo-200">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (visual === 'insights') {
    return (
      <Card className="border border-white/10 bg-black/25 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Weekly signal blend</p>
            <p className="text-2xl font-bold text-white">84%</p>
          </div>
          <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
            <BarChart3 size={22} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Mon', '72', 'bg-indigo-400'],
              ['Tue', '81', 'bg-cyan-400'],
              ['Wed', '88', 'bg-emerald-400'],
              ['Thu', '79', 'bg-purple-400'],
            ].map(([day, value, bar]) => (
              <div key={day} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                <div className="mx-auto flex h-16 w-full max-w-8 items-end rounded-full bg-white/10 p-1">
                  <div className={`w-full rounded-full ${bar}`} style={{ height: `${value}%` }} />
                </div>
                <p className="mt-3 text-xs text-gray-400">{day}</p>
                <p className="text-sm font-semibold text-white">{value}%</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-200">Habit completion</p>
              <p className="mt-1 text-xl font-bold text-white">6 / 7 done</p>
            </div>
            <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
              <p className="text-sm text-indigo-200">Tasks delivered</p>
              <p className="mt-1 text-xl font-bold text-white">12 this week</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-white/10 bg-black/25 p-0 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
      <div className="relative h-full min-h-[320px]">
        <img src={digitwin} alt="FutureTwin visual demonstration" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-indigo-200">Scenario</p>
              <p className="mt-2 text-sm font-semibold text-white">What happens if your current routine continues for 90 days?</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-indigo-200">Outcome Lens</p>
              <p className="mt-2 text-sm font-semibold text-white">See tradeoffs before they harden into habits.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Features = () => {
  const { token } = useApp();

  const ctaPath = token ? '/dashboard' : '/signup';
  const ctaLabel = token ? 'Open Dashboard' : 'Start Tracking';

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Motion.div
        className="absolute left-8 top-16 h-72 w-72 rounded-full bg-purple-500 blur-3xl opacity-20"
        animate={{ x: [0, 36, 0], y: [0, 24, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Motion.div
        className="absolute bottom-16 right-8 h-72 w-72 rounded-full bg-indigo-500 blur-3xl opacity-20"
        animate={{ x: [0, -42, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <section className="relative border-b border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-indigo-400/50 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link to={ctaPath}>
            <GradientButton className="w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                {ctaLabel}
                <ArrowRight size={18} />
              </span>
            </GradientButton>
          </Link>
        </div>
      </section>

      <section className="relative px-4 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
              <Sparkles size={16} />
              WiseMindOS Features
            </div>

            <h1 className="young-serif-regular text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Every capability you need to turn intention into execution.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              WiseMindOS combines planning, consistency, focus, insight, and decision support into one connected
              productivity system instead of a scattered stack of separate tools.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ctaPath}>
                <GradientButton className="w-full sm:w-auto">
                  <span className="flex items-center justify-center gap-2">
                    {ctaLabel}
                    <ArrowRight size={18} />
                  </span>
                </GradientButton>
              </Link>

              <Link
                to="/roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-indigo-400/50 hover:bg-white/5 hover:text-white"
              >
                View Roadmap
                <Rocket size={18} />
              </Link>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_45px_rgba(99,102,241,0.18)]">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">Feature Stack</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">One system, multiple working modes.</h2>
                </div>
                <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                  <Workflow size={24} />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ['Plan', 'Goals, projects, and tasks stay connected to the same mission.'],
                  ['Focus', 'Daily planning and focus tools protect attention during execution.'],
                  ['Reflect', 'Analytics and AI help you notice patterns before they become problems.'],
                ].map(([title, description], index) => (
                  <Motion.div
                    key={title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-sm font-semibold text-indigo-300">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{description}</p>
                  </Motion.div>
                ))}
              </div>
            </Card>
          </Motion.div>
        </div>
      </section>

      <section className="relative px-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featureStats.map((stat, index) => (
              <Motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
              >
                <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Capability Grid</p>
            <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
              A detailed look at what WiseMindOS can do.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              The platform is designed to support the full cycle of intentional growth, from planning and execution to
              reflection and future-facing decisions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="flex h-full flex-col border border-white/10 bg-white/5 backdrop-blur-lg transition duration-300 hover:border-indigo-400/40 hover:bg-white/10">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
                        <Icon size={24} />
                      </div>
                      <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                        {feature.label}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{feature.description}</p>

                    <div className="mt-5 space-y-2">
                      {feature.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Visual Demonstrations</p>
            <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
              See how the product behaves as a connected operating system.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              These sections show how the capabilities reinforce one another instead of existing as isolated feature lists.
            </p>
          </div>

          <div className="space-y-6">
            {showcaseSections.map((section, index) => (
              <Motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
                  <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center">
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">{section.eyebrow}</p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{section.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">{section.description}</p>

                      <div className="mt-5 space-y-3">
                        {section.points.map((point) => (
                          <div key={point} className="flex items-start gap-3 text-sm text-gray-300">
                            <div className="mt-1 rounded-full bg-indigo-500/15 p-1 text-indigo-300">
                              <CheckCircle2 size={14} />
                            </div>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>{renderShowcaseVisual(section.visual)}</div>
                  </div>
                </Card>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Benefits</p>
            <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
              Why these features work better together.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {benefitCards.map((item, index) => {
              const Icon = item.icon;

              return (
                <Motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_0_30px_rgba(99,102,241,0.12)]">
                    <div className="mb-4 inline-flex rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{item.description}</p>
                  </Card>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-indigo-400/20 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl shadow-[0_0_45px_rgba(99,102,241,0.18)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-indigo-200">Next Step</p>
                  <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
                    Ready to use the full WiseMindOS feature stack?
                  </h2>
                  <p className="mt-4 text-base leading-7 text-gray-300">
                    Start tracking today, explore the roadmap, or go back home to continue browsing the product story.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to={ctaPath}>
                    <GradientButton className="w-full sm:w-auto">
                      <span className="flex items-center justify-center gap-2">
                        {ctaLabel}
                        <ArrowRight size={18} />
                      </span>
                    </GradientButton>
                  </Link>

                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-indigo-400/50 hover:bg-white/5 hover:text-white"
                  >
                    Return Home
                    <Target size={18} />
                  </Link>
                </div>
              </div>
            </Card>
          </Motion.div>
        </div>
      </section>
    </main>
  );
};

export default Features;
