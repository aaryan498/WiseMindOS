import GradientButton from './GradientButton';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  accent = 'indigo',
  testId
}) => {
  const accentStyles = {
    blue: 'from-blue-500/20 to-cyan-500/10 text-blue-300 border-blue-400/20',
    emerald: 'from-emerald-500/20 to-green-500/10 text-emerald-300 border-emerald-400/20',
    green: 'from-green-500/20 to-emerald-500/10 text-green-300 border-green-400/20',
    indigo: 'from-indigo-500/20 to-purple-500/10 text-indigo-300 border-indigo-400/20',
    purple: 'from-purple-500/20 to-pink-500/10 text-purple-300 border-purple-400/20'
  };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center"
      data-testid={testId}
    >
      {Icon && (
        <div className={`mb-5 rounded-2xl border bg-gradient-to-br p-4 ${accentStyles[accent] || accentStyles.indigo}`}>
          <Icon size={36} aria-hidden="true" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">{description}</p>

      {actionLabel && onAction && (
        <GradientButton onClick={onAction} className="mt-6" data-testid={`${testId}-action`}>
          {actionLabel}
        </GradientButton>
      )}
    </div>
  );
};

export default EmptyState;
