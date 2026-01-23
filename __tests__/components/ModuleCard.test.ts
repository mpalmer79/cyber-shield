import { render, screen, fireEvent } from '@testing-library/react';
import ModuleCard from '@/components/ModuleCard';
import type { TrainingModule } from '@/types';

const mockModule: TrainingModule = {
  id: 'test-module',
  type: 'phishing',
  title: 'Test Module',
  description: 'This is a test module description',
  difficulty: 'beginner',
  status: 'available',
  estimatedMinutes: 15,
  totalScenarios: 10,
  completedScenarios: 3,
  requiredScore: 70,
  icon: '🎣',
  image: 'https://example.com/image.jpg',
  skills: ['Skill 1', 'Skill 2', 'Skill 3'],
};

describe('ModuleCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Default Variant', () => {
    it('should render module title and description', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      expect(screen.getByText('Test Module')).toBeInTheDocument();
      expect(screen.getByText('This is a test module description')).toBeInTheDocument();
    });

    it('should display difficulty badge', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      expect(screen.getByText('beginner')).toBeInTheDocument();
    });

    it('should display estimated time', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      expect(screen.getByText('15 min')).toBeInTheDocument();
    });

    it('should display scenario count', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      expect(screen.getByText('10 scenarios')).toBeInTheDocument();
    });

    it('should display skills tags', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      expect(screen.getByText('Skill 1')).toBeInTheDocument();
      expect(screen.getByText('Skill 2')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).toHaveBeenCalledWith(mockModule);
    });

    it('should not call onClick when locked', () => {
      const lockedModule = { ...mockModule, status: 'locked' as const };
      render(<ModuleCard module={lockedModule} onClick={mockOnClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should display lock icon when locked', () => {
      const lockedModule = { ...mockModule, status: 'locked' as const };
      render(<ModuleCard module={lockedModule} onClick={mockOnClick} />);
      expect(screen.getByRole('button')).toHaveClass('opacity-60');
    });
  });

  describe('Completed Status', () => {
    it('should display checkmark for completed modules', () => {
      const completedModule = { ...mockModule, status: 'completed' as const };
      render(<ModuleCard module={completedModule} onClick={mockOnClick} />);
      expect(screen.getByRole('button')).toHaveClass('border-green-500/30');
    });

    it('should display best score if available', () => {
      const completedModule = { ...mockModule, status: 'completed' as const, bestScore: 95 };
      render(<ModuleCard module={completedModule} onClick={mockOnClick} />);
      expect(screen.getByText('95%')).toBeInTheDocument();
    });
  });

  describe('In Progress Status', () => {
    it('should display progress bar when in progress', () => {
      const inProgressModule = { 
        ...mockModule, 
        status: 'in-progress' as const,
        completedScenarios: 5,
        totalScenarios: 10,
      };
      render(<ModuleCard module={inProgressModule} onClick={mockOnClick} />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Compact Variant', () => {
    it('should render in compact mode', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} variant="compact" />);
      expect(screen.getByText('Test Module')).toBeInTheDocument();
    });

    it('should display difficulty and time inline', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} variant="compact" />);
      expect(screen.getByText('beginner')).toBeInTheDocument();
      expect(screen.getByText('15 min')).toBeInTheDocument();
    });
  });

  describe('Difficulty Colors', () => {
    it('should show green for beginner', () => {
      render(<ModuleCard module={mockModule} onClick={mockOnClick} />);
      const badge = screen.getByText('beginner');
      expect(badge).toHaveClass('text-green-400');
    });

    it('should show yellow for intermediate', () => {
      const intermediateModule = { ...mockModule, difficulty: 'intermediate' as const };
      render(<ModuleCard module={intermediateModule} onClick={mockOnClick} />);
      const badge = screen.getByText('intermediate');
      expect(badge).toHaveClass('text-yellow-400');
    });

    it('should show orange for advanced', () => {
      const advancedModule = { ...mockModule, difficulty: 'advanced' as const };
      render(<ModuleCard module={advancedModule} onClick={mockOnClick} />);
      const badge = screen.getByText('advanced');
      expect(badge).toHaveClass('text-orange-400');
    });

    it('should show red for expert', () => {
      const expertModule = { ...mockModule, difficulty: 'expert' as const };
      render(<ModuleCard module={expertModule} onClick={mockOnClick} />);
      const badge = screen.getByText('expert');
      expect(badge).toHaveClass('text-red-400');
    });
  });
});
