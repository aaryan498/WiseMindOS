import { motion as Motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial, index }) => {
  const { name, role, review, rating, avatar } = testimonial;

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const hoverVariant = {
    rest: { y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } },
  };

  return (
    <Motion.div
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1 }}
      whileHover="hover"
      variants={hoverVariant}
      className="h-full"
    >
      <div className="
        bg-white/5 backdrop-blur-lg border border-white/10 
        rounded-2xl p-6 h-full
        hover:bg-white/10 hover:border-white/20
        transition-all duration-300
        hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]
        flex flex-col
      ">
        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
              viewport={{ once: true }}
            >
              <Star
                size={18}
                className={`${
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            </Motion.div>
          ))}
        </div>

        {/* Review Text */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 flex-grow">
          "{review}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          {/* Avatar */}
          <div className="
            w-12 h-12 rounded-full 
            bg-gradient-to-br from-indigo-500 to-purple-600
            flex items-center justify-center text-white font-bold text-lg
            flex-shrink-0
            shadow-lg
          ">
            {avatar}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm md:text-base truncate">
              {name}
            </h4>
            <p className="text-gray-400 text-xs md:text-sm truncate">
              {role}
            </p>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default TestimonialCard;
