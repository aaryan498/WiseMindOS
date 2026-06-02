import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
} from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';

const roadmapItems = [
  {
    title: 'Unified productivity dashboard',
    status: 'Completed',
    category: 'Core',
    quarter: 'Q2 2026',
    description: 'Centralize goals, habits, projects, and daily plans into one clear operating view.',
    icon: BarChart3,
  },
  {
    title: 'Focus room streaks',
    status: 'Completed',
    category: 'Focus',
    quarter: 'Q2 2026',
    description: 'Track deep-work sessions and make short focus wins visible across the product.',
    icon: TimerReset,
  },
  {
    title: 'FutureTwin decision simulator',
    status: 'In Progress',
    category: 'AI',
    quarter: 'Q3 2026',
    description: 'Preview likely outcomes from routines, goals, and long-running commitments.',
    icon: Brain,
  },
  {
    title: 'Goal risk alerts',
    status: 'In Progress',
    category: 'Insights',
    quarter: 'Q3 2026',
    description: 'Detect stale goals, overloaded weeks, and habit drift before progress stalls.',
    icon: ShieldCheck,
  },
  {
    title: 'Shared accountability circles',
    status: 'Planned',
    category: 'Collaboration',
    quarter: 'Q4 2026',
    description: 'Invite a small trusted group to follow milestones and celebrate completed sprints.',
    icon: Layers3,
  },
  {
    title: 'Adaptive planning assistant',
    status: 'Planned',
    category: 'AI',
    quarter: 'Q4 2026',
    description: 'Suggest daily plans based on energy, overdue work, and upcoming personal deadlines.',
    icon: Sparkles,
  },
];

const milestones = [
  {
    quarter: 'Q2 2026',
    title: 'Foundation',
    summary: 'Core tracking, dashboards, authentication polish, and responsive public pages.',
    status: 'Completed',
  },
  {
    quarter: 'Q3 2026',
    title: 'Intelligence',
    summary: 'FutureTwin simulations, insight alerts, stronger analytics, and guided planning.',
    status: 'In Progress',
  },
  {
    quarter: 'Q4 2026',
    title: 'Community',
    summary: 'Accountability circles, richer sharing flows, and collaborative goal support.',
    status: 'Planned',
  },
  {
    quarter: 'Q1 2027',
    title: 'Personalization',
    summary: 'Adaptive routines, custom templates, and smarter recommendations from usage patterns.',
    status: 'Planned',
  },
];

const statusStyles = {
  Completed: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  'In Progress': 'border-indigo-400/30 bg-indigo-500/10 text-indigo-300',
  Planned: 'border-purple-400/30 bg-purple-500/10 text-purple-300',
};

const statusOptions = ['All', 'Completed', 'In Progress', 'Planned'];
const categoryOptions = ['All', 'Core', 'Focus', 'AI', 'Insights', 'Collaboration'];

const Roadmap = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    return roadmapItems.filter((item) => {
      const statusMatches = selectedStatus === 'All' || item.status === selectedStatus;
      const categoryMatches = selectedCategory === 'All' || item.category === selectedCategory;
      return statusMatches && categoryMatches;
    });
  }, [selectedCategory, selectedStatus]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <section className="border-b border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-indigo-400/50 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link to="/signup">
            <GradientButton className="w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                Start Tracking
                <ArrowRight size={18} />
              </span>
            </GradientButton>
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
              <CalendarDays size={16} />
              Product roadmap
            </div>
            <h1 className="young-serif-regular text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Building the operating system for intentional growth.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              Track what has shipped, what is being built now, and what is planned next for WiseMindOS.
            </p>
          </Motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Milestones', value: milestones.length, icon: Target },
              { label: 'Active builds', value: roadmapItems.filter((item) => item.status === 'In Progress').length, icon: Clock3 },
              { label: 'Completed items', value: roadmapItems.filter((item) => item.status === 'Completed').length, icon: CheckCircle2 },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                >
                  <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-lg">
                    <Icon className="mb-4 text-indigo-300" size={24} />
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                  </Card>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-indigo-300">
                <Filter size={16} />
                Filter the plan
              </div>
              <h2 className="young-serif-regular text-3xl font-bold text-white">Feature pipeline</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-wrap gap-2" aria-label="Filter by status">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      selectedStatus === status
                        ? 'border-indigo-400 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white outline-none focus:border-indigo-400"
                aria-label="Filter by category"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Motion.div
                  key={item.title}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                >
                  <Card className="flex h-full flex-col border border-white/10 bg-white/5 backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/10">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="rounded-xl bg-indigo-500/15 p-3 text-indigo-300">
                        <Icon size={24} />
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-400">
                      <span className="rounded-full bg-white/10 px-3 py-1">{item.category}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1">{item.quarter}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-gray-400">{item.description}</p>
                  </Card>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="young-serif-regular text-3xl font-bold text-white">Milestone timeline</h2>
            <p className="mt-3 text-gray-400">A quarter-by-quarter view of how the product matures.</p>
          </div>

          <div className="relative grid gap-4 lg:grid-cols-4">
            {milestones.map((milestone, index) => (
              <Motion.div
                key={milestone.quarter}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
              >
                <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-lg">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-indigo-300">{milestone.quarter}</span>
                    <span className={`rounded-full border px-3 py-1 text-xs ${statusStyles[milestone.status]}`}>
                      {milestone.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{milestone.summary}</p>
                </Card>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Roadmap;
