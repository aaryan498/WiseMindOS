import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Onboarding from './Onboarding';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock AppContext
const mockAddGoal = vi.fn();
const mockAddProject = vi.fn();
const mockAddTask = vi.fn();

vi.mock('../store/AppContext', () => ({
  useApp: () => ({
    addGoal: mockAddGoal,
    addProject: mockAddProject,
    addTask: mockAddTask,
    goals: [],
  }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      // Filter out framer-motion specific props to prevent DOM warnings
      const { animate, transition, initial, exit, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    h1: ({ children, ...props }) => {
      const { animate, transition, initial, exit, ...rest } = props;
      return <h1 {...rest}>{children}</h1>;
    },
    p: ({ children, ...props }) => {
      const { animate, transition, initial, exit, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Onboarding Component - State Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockAddGoal.mockImplementation((goal) => Promise.resolve({ id: `real-${goal.id}`, ...goal }));
  });

  it('should load default states when localStorage is empty', () => {
    render(<Onboarding />);
    
    // Check that we start on step 1
    expect(screen.getByTestId('onboarding-step-1')).toBeInTheDocument();
    
    // Check that localStorage step is initialized to "1"
    expect(localStorage.getItem('wisemind_onboarding_step')).toBe('1');
  });

  it('should persist step and state updates to localStorage', async () => {
    render(<Onboarding />);

    // Add a goal
    const goalInput = screen.getByTestId('goal-title-input');
    const addGoalBtn = screen.getByTestId('add-goal-btn');
    
    fireEvent.change(goalInput, { target: { value: 'Learn Testing' } });
    
    // Check currentGoal draft persistence
    const savedCurrentGoal = JSON.parse(localStorage.getItem('wisemind_onboarding_current_goal'));
    expect(savedCurrentGoal.title).toBe('Learn Testing');

    fireEvent.click(addGoalBtn);

    // Check goals list persistence
    const savedGoals = JSON.parse(localStorage.getItem('wisemind_onboarding_goals'));
    expect(savedGoals).toHaveLength(1);
    expect(savedGoals[0].title).toBe('Learn Testing');

    // Click Next to move to step 2
    const nextBtn = screen.getByTestId('step-1-next-btn');
    fireEvent.click(nextBtn);

    // Step should be updated and persisted
    expect(screen.getByTestId('onboarding-step-2')).toBeInTheDocument();
    expect(localStorage.getItem('wisemind_onboarding_step')).toBe('2');
  });

  it('should restore states from localStorage on component mount', () => {
    // Populate localStorage with predefined states
    localStorage.setItem('wisemind_onboarding_step', '2');
    localStorage.setItem(
      'wisemind_onboarding_goals',
      JSON.stringify([{ id: 'test-goal-id', title: 'Persisted Goal', type: 'mid-term' }])
    );
    localStorage.setItem('wisemind_onboarding_selected_goal', 'test-goal-id');
    localStorage.setItem(
      'wisemind_onboarding_current_execution',
      JSON.stringify({ type: 'task', title: 'Persisted Task Draft', deadline: '' })
    );

    render(<Onboarding />);

    // Verify it loads directly into step 2
    expect(screen.getByTestId('onboarding-step-2')).toBeInTheDocument();

    // Verify persisted goals are available for select mapping dropdown
    const select = screen.getByTestId('select-goal-mapping');
    expect(select.value).toBe('test-goal-id');

    // Verify current execution draft is restored
    const executionInput = screen.getByTestId('execution-title-input');
    expect(executionInput.value).toBe('Persisted Task Draft');
  });

  it('should clear all onboarding localStorage keys on finish', async () => {
    // Setup state at step 3
    localStorage.setItem('wisemind_onboarding_step', '3');
    localStorage.setItem(
      'wisemind_onboarding_goals',
      JSON.stringify([{ id: 'goal-1', title: 'Complete GSSoC', type: 'mid-term' }])
    );
    localStorage.setItem(
      'wisemind_onboarding_execution_map',
      JSON.stringify({ 'goal-1': { projects: [], tasks: [{ id: 'task-1', title: 'Write Tests', deadline: '' }] } })
    );

    render(<Onboarding />);

    expect(screen.getByTestId('onboarding-step-3')).toBeInTheDocument();

    const finishBtn = screen.getByTestId('finish-onboarding-btn');
    fireEvent.click(finishBtn);

    await waitFor(() => {
      // Check that onboarding finished flag is set
      expect(localStorage.getItem('wisemind_hasOnboarded')).toBe('true');
      
      // Check that temporary onboarding progress states are cleared
      expect(localStorage.getItem('wisemind_onboarding_step')).toBeNull();
      expect(localStorage.getItem('wisemind_onboarding_goals')).toBeNull();
      expect(localStorage.getItem('wisemind_onboarding_current_goal')).toBeNull();
      expect(localStorage.getItem('wisemind_onboarding_execution_map')).toBeNull();
      expect(localStorage.getItem('wisemind_onboarding_current_execution')).toBeNull();
      expect(localStorage.getItem('wisemind_onboarding_selected_goal')).toBeNull();

      // Check navigation to dashboard
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
