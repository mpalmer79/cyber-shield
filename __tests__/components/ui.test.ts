import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { 
  Skeleton, 
  ModuleGridSkeleton, 
  LeaderboardSkeleton 
} from '@/components/ui/Skeleton';
import EmptyState, { 
  NoSearchResults, 
  NoProgressData, 
  NoBadgesEarned 
} from '@/components/ui/EmptyState';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Skeleton Component', () => {
  it('should render with default props', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('bg-cyber-800/50');
  });

  it('should render text variant with multiple lines', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBe(3);
  });

  it('should render circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('should render card variant', () => {
    const { container } = render(<Skeleton variant="card" />);
    expect(container.firstChild).toHaveClass('cyber-card');
  });

  it('should render module variant', () => {
    const { container } = render(<Skeleton variant="module" />);
    expect(container.firstChild).toHaveClass('cyber-card');
  });

  it('should apply custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={100} />);
    expect(container.firstChild).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('should disable animation when specified', () => {
    const { container } = render(<Skeleton animate={false} />);
    expect(container.firstChild).not.toHaveClass('animate-pulse');
  });
});

describe('ModuleGridSkeleton', () => {
  it('should render default 6 skeleton modules', () => {
    const { container } = render(<ModuleGridSkeleton />);
    const modules = container.querySelectorAll('.cyber-card');
    expect(modules.length).toBe(6);
  });

  it('should render custom count of skeleton modules', () => {
    const { container } = render(<ModuleGridSkeleton count={3} />);
    const modules = container.querySelectorAll('.cyber-card');
    expect(modules.length).toBe(3);
  });
});

describe('LeaderboardSkeleton', () => {
  it('should render default 10 skeleton items', () => {
    const { container } = render(<LeaderboardSkeleton />);
    const items = container.querySelectorAll('.cyber-card');
    expect(items.length).toBe(10);
  });

  it('should render custom count of skeleton items', () => {
    const { container } = render(<LeaderboardSkeleton count={5} />);
    const items = container.querySelectorAll('.cyber-card');
    expect(items.length).toBe(5);
  });
});

describe('EmptyState Component', () => {
  it('should render with default type', () => {
    render(<EmptyState />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should render custom title and description', () => {
    render(
      <EmptyState 
        title="Custom Title" 
        description="Custom description text" 
      />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    const mockAction = jest.fn();
    render(
      <EmptyState 
        action={{ label: 'Click me', onClick: mockAction }} 
      />
    );
    
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalled();
  });

  it('should render secondary action when provided', () => {
    const mockSecondary = jest.fn();
    render(
      <EmptyState 
        action={{ label: 'Primary', onClick: jest.fn() }}
        secondaryAction={{ label: 'Secondary', onClick: mockSecondary }} 
      />
    );
    
    const button = screen.getByText('Secondary');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockSecondary).toHaveBeenCalled();
  });

  it('should render different types correctly', () => {
    const types = [
      { type: 'no-modules' as const, expected: 'No modules available' },
      { type: 'no-progress' as const, expected: 'No progress yet' },
      { type: 'no-leaderboard' as const, expected: 'Leaderboard is empty' },
      { type: 'no-messages' as const, expected: 'No messages yet' },
      { type: 'no-badges' as const, expected: 'No badges earned yet' },
      { type: 'error' as const, expected: 'Something went wrong' },
      { type: 'offline' as const, expected: "You're offline" },
    ];

    types.forEach(({ type, expected }) => {
      const { unmount } = render(<EmptyState type={type} />);
      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });
});

describe('Specialized Empty States', () => {
  it('NoSearchResults should show query when provided', () => {
    render(<NoSearchResults query="test search" />);
    expect(screen.getByText('No results for "test search"')).toBeInTheDocument();
  });

  it('NoSearchResults should call onClear when clicking clear button', () => {
    const mockClear = jest.fn();
    render(<NoSearchResults onClear={mockClear} />);
    
    fireEvent.click(screen.getByText('Clear search'));
    expect(mockClear).toHaveBeenCalled();
  });

  it('NoProgressData should render start training button', () => {
    const mockStart = jest.fn();
    render(<NoProgressData onStartTraining={mockStart} />);
    
    const button = screen.getByText('Start training');
    fireEvent.click(button);
    expect(mockStart).toHaveBeenCalled();
  });

  it('NoBadgesEarned should render view modules button', () => {
    const mockView = jest.fn();
    render(<NoBadgesEarned onViewModules={mockView} />);
    
    const button = screen.getByText('View modules');
    fireEvent.click(button);
    expect(mockView).toHaveBeenCalled();
  });
});
