import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Twitter,
} from 'lucide-react';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import { validateEmail } from '../utils/helpers';
import { showToast } from '../utils/toastHelper';
import { useApp } from '../store/AppContext';

const initialFormState = {
  name: '',
  email: '',
  message: '',
};

const supportHighlights = [
  {
    icon: Clock3,
    label: 'Average reply',
    value: 'Within 1 business day',
  },
  {
    icon: MessageSquare,
    label: 'Best for',
    value: 'Support, partnerships, product questions',
  },
  {
    icon: MapPin,
    label: 'Operating from',
    value: 'Bengaluru, India',
  },
];

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@wisemindos.com',
    description: 'For support requests, demos, and partnerships.',
    href: 'mailto:hello@wisemindos.com',
    accent: 'bg-indigo-500/15 text-indigo-200',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 80 4728 1140',
    description: 'Monday to Friday, 10:00 AM to 6:00 PM IST.',
    href: 'tel:+918047281140',
    accent: 'bg-purple-500/15 text-purple-200',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'WiseMindOS Studio, 42 Focus Avenue, Indiranagar, Bengaluru 560038',
    description: 'Visits by appointment for collaborator and partner meetings.',
    href: 'https://www.google.com/maps?q=Indiranagar+Bengaluru+560038',
    external: true,
    accent: 'bg-emerald-500/15 text-emerald-200',
  },
];

const socialLinks = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    handle: 'company/wisemindos',
    href: 'https://www.linkedin.com/company/wisemindos',
  },
  {
    icon: Github,
    label: 'GitHub',
    handle: '@WiseMindOS',
    href: 'https://github.com/WiseMindOS',
  },
  {
    icon: Twitter,
    label: 'X / Twitter',
    handle: '@wisemindos',
    href: 'https://x.com/wisemindos',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    handle: '@wisemindos',
    href: 'https://www.instagram.com/wisemindos',
  },
];

const Contact = () => {
  const { token } = useApp();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const ctaPath = token ? '/dashboard' : '/signup';
  const ctaLabel = token ? 'Open Dashboard' : 'Start Tracking';

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;

    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: '',
      }));
    }

    if (submitMessage) {
      setSubmitMessage('');
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const message = formData.message.trim();

    if (!name) {
      nextErrors.name = 'Please enter your name.';
    } else if (name.length < 2) {
      nextErrors.name = 'Name should be at least 2 characters long.';
    }

    if (!email) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!validateEmail(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!message) {
      nextErrors.message = 'Please tell us how we can help.';
    } else if (message.length < 20) {
      nextErrors.message = 'Message should be at least 20 characters long.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast({ message: 'Please review the highlighted fields.', status: 'error' });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      message: formData.message.trim(),
    };

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      setFormData(initialFormState);
      setErrors({});

      const successMessage = `Thanks ${payload.name.split(' ')[0]}, our team will reply at ${payload.email} within 1 business day.`;
      setSubmitMessage(successMessage);
      showToast({ message: 'Message sent successfully.', status: 'success' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      showToast({ message: 'Unable to send your message right now.', status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Motion.div
        className="absolute top-16 left-8 h-72 w-72 rounded-full bg-purple-500 blur-3xl opacity-20"
        animate={{ x: [0, 36, 0], y: [0, 22, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Motion.div
        className="absolute bottom-16 right-8 h-72 w-72 rounded-full bg-indigo-500 blur-3xl opacity-20"
        animate={{ x: [0, -42, 0], y: [0, -18, 0] }}
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
        <div className="mx-auto max-w-6xl">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
              <MessageSquare size={16} />
              Contact WiseMindOS
            </div>
            <h1 className="young-serif-regular text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Reach the team behind your next focused milestone.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              Questions, partnership ideas, product feedback, or support requests all start here. Send us a note and
              we will route it to the right person quickly.
            </p>
          </Motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {supportHighlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <Motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_0_30px_rgba(99,102,241,0.12)]">
                    <div className="mb-4 inline-flex rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                      <Icon size={22} />
                    </div>
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </Card>
                </Motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.15)]">
              <div className="mb-6 border-b border-white/10 pb-5">
                <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">Send a Message</p>
                <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white">Tell us how we can help</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Share the context, timeline, and the best way to respond. We will take it from there.
                </p>
              </div>

              {submitMessage && (
                <Motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
                  aria-live="polite"
                >
                  {submitMessage}
                </Motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <InputField
                      id="contact-name"
                      label="Name"
                      type="text"
                      value={formData.name}
                      onChange={handleFieldChange('name')}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      data-testid="contact-name-input"
                    />
                    {errors.name && <p className="mt-2 text-sm text-rose-300">{errors.name}</p>}
                  </div>

                  <div>
                    <InputField
                      id="contact-email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleFieldChange('email')}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      data-testid="contact-email-input"
                    />
                    {errors.email && <p className="mt-2 text-sm text-rose-300">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-gray-300">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={handleFieldChange('message')}
                    placeholder="Tell us about your question, collaboration idea, or support request."
                    rows={7}
                    required
                    data-testid="contact-message-input"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-3 text-white transition-all focus:border-transparent focus:outline-none ${
                      errors.message
                        ? 'border-rose-400/70 focus:ring-2 focus:ring-rose-400'
                        : 'border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                    }`}
                  />
                  {errors.message && <p className="mt-2 text-sm text-rose-300">{errors.message}</p>}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-400">
                  Use this form for support, partnership requests, hiring conversations, and feedback on the product
                  experience.
                </div>

                <GradientButton
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                  data-testid="contact-submit-btn"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <Send size={18} />}
                  </span>
                </GradientButton>
              </form>
            </Card>
          </Motion.div>

          <div className="space-y-6">
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.12)]">
                <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">Company Info</p>
                    <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white">Choose your channel</h2>
                  </div>
                  <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                    <Mail size={22} />
                  </div>
                </div>

                <div className="space-y-3">
                  {contactMethods.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <Motion.a
                        key={item.label}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noreferrer' : undefined}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-indigo-400/40 hover:bg-white/5"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`rounded-2xl p-3 ${item.accent}`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">{item.label}</p>
                            <p className="mt-1 text-base font-semibold text-white">{item.value}</p>
                            <p className="mt-1 text-sm leading-6 text-gray-500">{item.description}</p>
                          </div>
                          <ExternalLink size={18} className="mt-1 text-gray-500" />
                        </div>
                      </Motion.a>
                    );
                  })}
                </div>
              </Card>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.12)]">
                <div className="mb-6 border-b border-white/10 pb-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">Social Links</p>
                  <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white">Follow the build</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Keep up with product updates, open source work, and behind-the-scenes progress.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <Motion.a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-indigo-400/40 hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-white/10 p-3 text-gray-200">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{item.label}</p>
                            <p className="text-sm text-gray-400">{item.handle}</p>
                          </div>
                        </div>
                        <ExternalLink size={18} className="text-gray-500" />
                      </Motion.a>
                    );
                  })}
                </div>
              </Card>
            </Motion.div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
          >
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.12)]">
              <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-indigo-300">Map</p>
                  <h2 className="mt-3 young-serif-regular text-3xl font-bold text-white">Find our collaboration hub</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Prefer a walkthrough, partner call, or in-person conversation? Start with a message and we will
                    coordinate the right setup.
                  </p>
                </div>

                <a
                  href="https://www.google.com/maps?q=Indiranagar+Bengaluru+560038"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-indigo-400/50 hover:text-white"
                >
                  Open in Google Maps
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                <iframe
                  title="WiseMindOS collaboration hub map"
                  src="https://www.google.com/maps?q=Indiranagar+Bengaluru+560038&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-80 w-full opacity-80 [filter:grayscale(1)_invert(0.92)_contrast(1.15)]"
                />
              </div>
            </Card>
          </Motion.div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
