import { motion as Motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Entrepreneur',
      review:
        'WiseMindOS transformed how I track my goals. The 21-day habit system helped me build consistency, and the analytics dashboard gives me the clarity I need to make better decisions.',
      rating: 5,
      avatar: 'SM',
    },
    {
      name: 'James Chen',
      role: 'Software Developer',
      review:
        'The FutureTwin AI feature is incredible. Being able to simulate outcomes has revolutionized my decision-making process. This is the productivity tool I never knew I needed.',
      rating: 5,
      avatar: 'JC',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Product Manager',
      review:
        'Finally, a tool that understands holistic development. The combination of habit tracking, goal management, and project tracking keeps me aligned with my vision. Highly recommended!',
      rating: 5,
      avatar: 'ER',
    },
    {
      name: 'Alex Thompson',
      role: 'Designer',
      review:
        'The UI is beautiful and intuitive. I appreciate how smooth the experience is. WiseMindOS makes productivity feel effortless, and the animations are a delight.',
      rating: 5,
      avatar: 'AT',
    },
    {
      name: 'Lisa Wang',
      role: 'Fitness Coach',
      review:
        'I recommend WiseMindOS to all my clients. The habit tracking and progress visualization tools help them stay motivated. It\'s become an essential part of their transformation journey.',
      rating: 5,
      avatar: 'LW',
    },
    {
      name: 'Marcus Johnson',
      role: 'Academic Researcher',
      review:
        'The analytics and data-driven insights are exceptional. As someone who values data, I appreciate the detailed reports and visualizations. This tool elevates personal development to a science.',
      rating: 5,
      avatar: 'MJ',
    },
  ];

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const sectionTitleVariant = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="py-20 px-4 relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        {/* Heading */}
        <Motion.div
          className="text-center mb-16"
          variants={sectionTitleVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold young-serif-regular text-white mb-2">
            Loved by Our Community
          </h2>
          <div className="h-1 w-40 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full" />
          <p className="text-gray-400 mt-3 text-base md:text-lg">
            Discover what users are saying about their WiseMindOS experience
          </p>
        </Motion.div>

        {/* Testimonials Grid */}
        <Motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </Motion.div>

        {/* Bottom CTA */}
        <Motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-base md:text-lg">
            Join{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              thousands of achievers
            </span>{' '}
            transforming their lives with WiseMindOS
          </p>
        </Motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
