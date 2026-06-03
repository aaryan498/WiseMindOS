import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Compass,
  Github,
  HeartHandshake,
  Linkedin,
  Mail,
  Rocket,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { useApp } from '../store/AppContext';
import digitwin from '../assets/digitwin.png';
import logo from '../assets/logo.jpeg';

const heroStats = [
  {
    label: 'Core promise',
    value: 'Long-term ambition into daily execution',
    icon: Target,
  },
  {
    label: 'Built around',
    value: 'Goals, habits, focus, and future insight',
    icon: Workflow,
  },
  {
    label: 'Team energy',
    value: 'Open-source, contributor-friendly, always evolving',
    icon: Users,
  },
];

const storyMoments = [
  {
    title: 'The problem we saw',
    description:
      'Most productivity tools track one layer of life well, but leave goals, routines, focus, and reflection disconnected.',
    icon: Compass,
  },
  {
    title: 'The system we built',
    description:
      'WiseMindOS connects those layers into one operating flow so every habit, task, and project pushes the same mission forward.',
    icon: BrainCircuit,
  },
  {
    title: 'The future we are chasing',
    description:
      'A calmer, smarter workspace where people can understand patterns early and make better decisions with confidence.',
    icon: Rocket,
  },
];

const valueCards = [
  {
    title: 'Systems, not silos',
    description:
      'We design features to work together so goals, projects, habits, and focus sessions build momentum instead of living in separate tabs.',
    icon: Workflow,
    accent: 'from-indigo-500/20 to-purple-500/10',
  },
  {
    title: 'Human-centered intelligence',
    description:
      'AI should reduce noise and sharpen judgment. We build guidance that supports reflection, planning, and agency.',
    icon: BrainCircuit,
    accent: 'from-cyan-500/20 to-indigo-500/10',
  },
  {
    title: 'Consistency over hype',
    description:
      'Small repeatable actions matter. The product rewards steady progress, not performative productivity.',
    icon: CheckCircle2,
    accent: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    title: 'Build in public',
    description:
      'Open collaboration keeps the roadmap grounded. We welcome contributors, feedback, and ideas that make the system stronger.',
    icon: HeartHandshake,
    accent: 'from-fuchsia-500/20 to-rose-500/10',
  },
];

const teamMembers = [
  {
    name: 'Aaryan Kumar',
    role: 'Core Maintainer',
    handle: '@aaryan498',
    bio: 'Shapes the product direction and keeps the platform centered on aligned execution, modular architecture, and long-term focus.',
    focus: ['Vision', 'Architecture', 'AI'],
    socials: [
      { label: 'GitHub', href: 'https://github.com/aaryan498', icon: Github },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/wisemindos', icon: Linkedin },
      { label: 'Email', href: 'mailto:hello@wisemindos.com?subject=For%20Aaryan%20Kumar', icon: Mail },
    ],
  },
  {
    name: 'Ramya',
    role: 'Open Source Collaborator',
    handle: '@ramyacm23',
    bio: 'Helps turn product ideas into contributor-friendly work, keeping public pages, feature polish, and project momentum moving together.',
    focus: ['Community', 'UX', 'Delivery'],
    socials: [
      { label: 'GitHub', href: 'https://github.com/ramyacm23', icon: Github },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/wisemindos', icon: Linkedin },
      { label: 'Email', href: 'mailto:hello@wisemindos.com?subject=For%20Ramya', icon: Mail },
    ],
  },
  {
    name: 'Shakti Shrey',
    role: 'Frontend Contributor',
    handle: '@ShaktiShrey-01',
    bio: 'Brings product experiences to life with thoughtful interfaces, smoother interactions, and a strong eye for contributor-ready implementation.',
    focus: ['Frontend', 'Motion', 'Polish'],
    socials: [
      { label: 'GitHub', href: 'https://github.com/ShaktiShrey-01', icon: Github },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/wisemindos', icon: Linkedin },
      { label: 'Email', href: 'mailto:hello@wisemindos.com?subject=For%20Shakti%20Shrey', icon: Mail },
    ],
  },
];

const milestones = [
  {
    period: 'Origin',
    title: 'A life operating system takes shape',
    description:
      'WiseMindOS started with one question: what if goals, habits, projects, and focus lived inside one coherent system instead of scattered tools?',
    status: 'Vision',
  },
  {
    period: 'Q1 2026',
    title: 'Modular foundation shipped',
    description:
      'Authentication, trackers, and the first connected dashboard established the core operating layer for daily execution.',
    status: 'Shipped',
  },
  {
    period: 'Q2 2026',
    title: 'Open-source momentum accelerated',
    description:
      'Contributor workflows, public-facing pages, and richer product storytelling made the platform easier to explore and improve together.',
    status: 'Growing',
  },
  {
    period: 'Q3 2026',
    title: 'FutureTwin intelligence expands',
    description:
      'The roadmap pushes deeper into predictive insight, adaptive planning, and smarter support for long-term behavior change.',
    status: 'Next',
  },
];

const milestoneStyles = {
  Vision: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  Shipped: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  Growing: 'border-indigo-400/30 bg-indigo-500/10 text-indigo-300',
  Next: 'border-purple-400/30 bg-purple-500/10 text-purple-300',
};

const About = () => {
  const { token } = useApp();

  const ctaPath = token ? '/dashboard' : '/signup';
  const ctaLabel = token ? 'Open Dashboard' : 'Start Tracking';

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Motion.div
        className="absolute left-6 top-16 h-72 w-72 rounded-full bg-purple-500 blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 28, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Motion.div
        className="absolute bottom-16 right-6 h-72 w-72 rounded-full bg-indigo-500 blur-3xl opacity-20"
        animate={{ x: [0, -42, 0], y: [0, -22, 0] }}
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
              <Sparkles size={16} />
              About WiseMindOS
            </div>

            <h1 className="young-serif-regular text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Building the operating system for intentional growth.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              WiseMindOS exists to transform long-term goals into structured daily execution through connected planning
              systems, habit tracking, focus workflows, and intelligent insight.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Our mission is simple: help people stay focused, stay consistent, and make measurable progress without
              losing sight of the bigger picture.
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

              <a
                href="#team"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-indigo-400/50 hover:bg-white/5 hover:text-white"
              >
                Meet the Team
                <Users size={18} />
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {heroStats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_0_30px_rgba(99,102,241,0.12)]">
                      <div className="mb-4 inline-flex rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                        <Icon size={22} />
                      </div>
                      <p className="text-sm text-gray-400">{item.label}</p>
                      <p className="mt-2 text-base font-semibold leading-6 text-white">{item.value}</p>
                    </Card>
                  </Motion.div>
                );
              })}
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <Card className="relative overflow-hidden border border-white/10 bg-white/5 p-0 backdrop-blur-xl shadow-[0_0_45px_rgba(99,102,241,0.18)]">
              <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-indigo-200 backdrop-blur-md">
                Mission in Motion
              </div>

              <div className="relative h-[460px] overflow-hidden">
                <img src={digitwin} alt="WiseMindOS mission visual" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <Card className="border border-white/10 bg-black/35 backdrop-blur-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={logo}
                          alt="WiseMindOS logo"
                          className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
                        />
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">North Star</p>
                          <h2 className="mt-1 text-xl font-semibold text-white">Design for clarity under pressure.</h2>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-gray-300">
                        Every experience should help users move from scattered effort to a calmer, more intentional
                        rhythm.
                      </p>
                    </Card>

                    <div className="grid gap-3">
                      {['Goals to projects', 'Habits to consistency', 'Focus to measurable progress'].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-gray-200 backdrop-blur-md"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Motion.div>
        </div>
      </section>

      <section id="story" className="relative px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Company Story</p>
            <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
              From fragmented productivity tools to one coherent operating system.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              WiseMindOS was created to close the gap between intention and execution. Instead of asking people to
              manage goals, tasks, habits, and focus in separate places, we are building one shared system that helps
              every action compound.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <Motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
            >
              <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
                <div className="mb-6 border-b border-white/10 pb-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">Why We Exist</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Structure ambition without losing humanity.</h3>
                </div>

                <div className="space-y-4 text-sm leading-7 text-gray-300 sm:text-base">
                  <p>
                    We believe personal growth should feel more like a well-designed system and less like a pile of
                    disconnected checklists. The product is built to align daily choices with long-term direction.
                  </p>
                  <p>
                    That means pairing planning with reflection, measurable progress with deep work, and AI with
                    practical support people can actually trust.
                  </p>
                  <p>
                    The result is a platform that helps users build momentum deliberately, not just stay busy.
                  </p>
                </div>
              </Card>
            </Motion.div>

            <div className="grid gap-4">
              {storyMoments.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Card className="border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </Motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Values and Culture</p>
            <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
              The principles behind how we build.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              These values guide product decisions, contributor collaboration, and the kind of experience we want
              users to feel every day.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {valueCards.map((value, index) => {
              const Icon = value.icon;

              return (
                <Motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card
                    className={`h-full border border-white/10 bg-gradient-to-br ${value.accent} backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]`}
                  >
                    <div className="mb-5 inline-flex rounded-2xl bg-black/25 p-3 text-white">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-300">{value.description}</p>
                  </Card>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="team" className="relative px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Team</p>
              <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
                The people shaping WiseMindOS in public.
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-400">
                WiseMindOS grows through focused builders and open-source collaborators who care about clarity,
                consistency, and making the product easier to improve together.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 backdrop-blur-lg">
              Profile-style contributor cards inspired by the dashboard welcome pattern.
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Motion.div
                key={member.handle}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: index * 0.08 }}
              >
                <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
                  <div className="mb-6 flex flex-col items-center border-b border-white/10 pb-5 text-center">
                    <div className="relative mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-[2px] shadow-[0_0_25px_rgba(99,102,241,0.35)]">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
                        {member.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-gray-900 bg-emerald-400" />
                    </div>

                    <h3 className="text-2xl font-semibold text-white">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium text-indigo-300">{member.role}</p>
                    <p className="mt-1 text-sm text-gray-500">{member.handle}</p>
                  </div>

                  <p className="text-sm leading-6 text-gray-300">{member.bio}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {member.focus.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-gray-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    {member.socials.map((social) => {
                      const Icon = social.icon;

                      return (
                        <Motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ y: -2 }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-gray-300 transition hover:border-indigo-400/40 hover:text-white"
                        >
                          <Icon size={16} />
                          {social.label}
                        </Motion.a>
                      );
                    })}
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
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Milestones</p>
            <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
              Key moments in the company story.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-400">
              A timeline of how the mission has moved from concept to a growing open-source productivity platform.
            </p>
          </div>

          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-indigo-400 via-purple-500/40 to-transparent md:left-1/2" />

            <div className="space-y-6">
              {milestones.map((item, index) => (
                <Motion.div
                  key={item.period}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.07 }}
                  className={`relative pl-12 md:w-1/2 md:pl-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:ml-auto md:pl-8'}`}
                >
                  <div
                    className={`absolute left-[9px] top-8 h-3 w-3 rounded-full border-2 border-indigo-400 bg-gray-950 md:top-9 ${
                      index % 2 === 0 ? 'md:left-auto md:right-[-7px]' : 'md:left-[-7px]'
                    }`}
                  />

                  <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_35px_rgba(99,102,241,0.12)]">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-indigo-300">{item.period}</span>
                      <span className={`rounded-full border px-3 py-1 text-xs ${milestoneStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{item.description}</p>
                  </Card>
                </Motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-indigo-400/20 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl shadow-[0_0_45px_rgba(99,102,241,0.18)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.24em] text-indigo-200">Call to Action</p>
                  <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white sm:text-4xl">
                    Ready to build your next milestone with more clarity?
                  </h2>
                  <p className="mt-4 text-base leading-7 text-gray-300">
                    Start tracking your goals, explore the roadmap, or join the growing community shaping what
                    WiseMindOS becomes next.
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
                    to="/roadmap"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-gray-200 transition hover:border-indigo-400/50 hover:bg-white/5 hover:text-white"
                  >
                    Explore Roadmap
                    <Zap size={18} />
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

export default About;
