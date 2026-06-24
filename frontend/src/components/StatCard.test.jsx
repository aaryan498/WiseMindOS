import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from './StatCard';

describe('StatCard Component', () => {
  it('renders title and value correctly', () => {
    render(<StatCard title="Total Users" value="1,024" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,024')).toBeInTheDocument();
  });

  it('renders positive trend correctly', () => {
    render(<StatCard title="Revenue" value="$100" trend={{ positive: true, value: 5 }} />);
    const trendEl = screen.getByText(/↑\s*5%\s*from last week/i);
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass('text-emerald-400');
  });

  it('renders negative trend correctly', () => {
    render(<StatCard title="Bounce Rate" value="45%" trend={{ positive: false, value: 2 }} />);
    const trendEl = screen.getByText(/↓\s*2%\s*from last week/i);
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass('text-rose-400');
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <svg data-testid="test-icon"></svg>;
    render(<StatCard title="Test" value="123" icon={<TestIcon />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<StatCard title="Test" value="123" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
