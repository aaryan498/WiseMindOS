import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
  it('renders the progress bar correctly', () => {
    render(<ProgressBar progress={50} />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('clamps progress to a maximum of 100', () => {
    render(<ProgressBar progress={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('clamps progress to a minimum of 0', () => {
    render(<ProgressBar progress={-20} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('hides the label when showLabel is false', () => {
    render(<ProgressBar progress={50} showLabel={false} />);
    expect(screen.queryByText('Progress')).not.toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ProgressBar progress={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
