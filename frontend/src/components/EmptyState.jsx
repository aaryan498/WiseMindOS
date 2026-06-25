import Card from './Card';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  testId,
  className = ''
}) => {
  return (
    <Card
      className={`bg-white/5 backdrop-blur-xl border border-white/10 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center py-12 px-4">
        {Icon && (
          <div className="mb-4 rounded-2xl bg-indigo-500/15 p-4 text-indigo-300 ring-1 ring-indigo-400/20">
            <Icon size={40} aria-hidden="true" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            data-testid={testId}
            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] active:scale-95"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;
