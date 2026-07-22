import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock AppContext values
const mockGetImportantTasks = vi.fn();
const mockGetBehindTasks = vi.fn();
const mockToggleTaskCompletion = vi.fn();
const mockToggleDailyPlanTaskCompletion = vi.fn();

vi.mock('../store/AppContext', () => ({
  useApp: () => ({
    goals: [],
    user: { name: 'Test User', username: 'testuser', bio: 'My bio' },
    loading: false,
    projects: [],
    tasks: [],
    habits: [],
    dailyPlan: {
      plannedTasks: [
        { id: 'planned-1', title: 'Buy Groceries', completed: false, startTime: '09:00', endTime: '10:00', source: 'task' },
        { id: 'planned-2', title: 'Read Chemistry Book', completed: false, startTime: '11:00', endTime: '12:00', source: 'task' }
      ]
    },
    updateUser: vi.fn(),
    updateUserProfilePic: vi.fn(),
    calculateGoalProgress: vi.fn(),
    calculateProjectProgress: vi.fn(),
    toggleDailyPlanTaskCompletion: mockToggleDailyPlanTaskCompletion,
    getImportantTasks: mockGetImportantTasks,
    getBehindTasks: mockGetBehindTasks,
    toggleTaskCompletion: mockToggleTaskCompletion,
    calculateProductivityScore: () => 80,
    calculateDisciplineScore: () => 90
  }),
}));

// Mock API service
vi.mock('../api/apiService', () => ({
  statsAPI: {
    getWeekly: () => Promise.resolve({ success: true, data: [] })
  }
}));

// Mock sub-widgets to avoid dependency bloat
vi.mock('../components/ClockWidget', () => ({ default: () => <div>ClockWidget</div> }));
vi.mock('../components/DonutChart', () => ({ default: () => <div>DonutChart</div> }));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { animate, transition, initial, exit, whileHover, whileInView, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Dashboard Component - Task Search Filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetImportantTasks.mockReturnValue([
      { id: 'imp-1', title: 'Math Homework', completed: false },
      { id: 'imp-2', title: 'Physics Lab Report', completed: false }
    ]);
    mockGetBehindTasks.mockReturnValue([
      { id: 'beh-1', title: 'English Essay Draft', completed: false }
    ]);
  });

  it('renders the search bar when there are tasks on the dashboard', async () => {
    render(<Dashboard />);
    
    // Wait for the async API data loading to complete
    await screen.findByText('Weekly Trend');

    const searchInput = screen.getByTestId('task-search-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.placeholder).toBe('Search tasks by title...');
  });

  it('filters planned tasks, important tasks, and overdue tasks correctly by query', async () => {
    render(<Dashboard />);
    
    // Wait for the async API data loading to complete
    await screen.findByText('Weekly Trend');

    // Initial load checks: both planned tasks, important tasks, and behind tasks should be present
    expect(screen.getByText('Buy Groceries')).toBeInTheDocument();
    expect(screen.getByText('Read Chemistry Book')).toBeInTheDocument();
    expect(screen.getByText('Math Homework')).toBeInTheDocument();
    expect(screen.getByText('Physics Lab Report')).toBeInTheDocument();
    expect(screen.getByText('English Essay Draft')).toBeInTheDocument();

    // Type query "Math" in search bar
    const searchInput = screen.getByTestId('task-search-input');
    fireEvent.change(searchInput, { target: { value: 'Math' } });

    // Should only show Math Homework
    expect(screen.getByText('Math Homework')).toBeInTheDocument();
    expect(screen.queryByText('Physics Lab Report')).toBeNull();
    expect(screen.queryByText('Buy Groceries')).toBeNull();
    expect(screen.queryByText('Read Chemistry Book')).toBeNull();
    expect(screen.queryByText('English Essay Draft')).toBeNull();
    
    // Shows placeholder for empty categories
    expect(screen.getByText('No planned tasks match "Math"')).toBeInTheDocument();
    expect(screen.getByText('No matching overdue tasks')).toBeInTheDocument();
  });

  it('shows no tasks matching state when search query does not match any titles', async () => {
    render(<Dashboard />);
    
    // Wait for the async API data loading to complete
    await screen.findByText('Weekly Trend');

    const searchInput = screen.getByTestId('task-search-input');
    fireEvent.change(searchInput, { target: { value: 'xyzrandomquery' } });

    // Everything filtered out
    expect(screen.queryByText('Buy Groceries')).toBeNull();
    expect(screen.queryByText('Math Homework')).toBeNull();
    expect(screen.queryByText('English Essay Draft')).toBeNull();

    expect(screen.getByText('No planned tasks match "xyzrandomquery"')).toBeInTheDocument();
    expect(screen.getByText('No matching important tasks')).toBeInTheDocument();
    expect(screen.getByText('No matching overdue tasks')).toBeInTheDocument();
  });
});
