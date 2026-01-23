import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

// Mock the store
jest.mock('@/store', () => ({
  useProgressStore: () => ({
    progress: {
      level: 5,
      xp: 250,
    },
  }),
}));

describe('Header', () => {
  it('should render the logo', () => {
    render(<Header />);
    expect(screen.getByText('Cyber')).toBeInTheDocument();
    expect(screen.getByText('Shield')).toBeInTheDocument();
  });

  it('should render navigation items', () => {
    render(<Header />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<Header currentPage="training" />);
    const trainingLink = screen.getAllByText('Training')[0].closest('a');
    expect(trainingLink).toHaveClass('bg-cyber-800/50');
  });

  it('should display user level and XP', () => {
    render(<Header />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('should render Admin Login link', () => {
    render(<Header />);
    const adminLinks = screen.getAllByText('Admin Login');
    expect(adminLinks.length).toBeGreaterThan(0);
  });

  it('should toggle mobile menu', () => {
    render(<Header />);
    
    // Find the mobile menu button (Menu icon button)
    const menuButton = screen.getByRole('button', { name: '' });
    
    // Click to open
    fireEvent.click(menuButton);
    
    // Mobile nav should now be visible - check for multiple Training links
    const trainingLinks = screen.getAllByText('Training');
    expect(trainingLinks.length).toBeGreaterThan(1);
  });
});
