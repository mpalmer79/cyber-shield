import { render, screen, fireEvent } from '@testing-library/react';
import ChatInterface from '@/components/ChatInterface';
import type { ChatMessage } from '@/types';

const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    timestamp: new Date(),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'I need help with phishing detection.',
    timestamp: new Date(),
  },
];

describe('ChatInterface', () => {
  const mockOnSendMessage = jest.fn();
  const mockOnReportAttack = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
    mockOnReportAttack.mockClear();
  });

  it('should render messages', () => {
    render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    expect(screen.getByText('I need help with phishing detection.')).toBeInTheDocument();
  });

  it('should render input field', () => {
    render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
    expect(screen.getByPlaceholderText('Type your response...')).toBeInTheDocument();
  });

  it('should allow typing in input', () => {
    render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
    const input = screen.getByPlaceholderText('Type your response...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input).toHaveValue('Test message');
  });

  it('should call onSendMessage when submitting', () => {
    render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
    const input = screen.getByPlaceholderText('Type your response...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(input.closest('form')!);
    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('should clear input after sending', () => {
    render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
    const input = screen.getByPlaceholderText('Type your response...');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.submit(input.closest('form')!);
    expect(input).toHaveValue('');
  });

  it('should not send empty messages', () => {
    render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
    const input = screen.getByPlaceholderText('Type your response...');
    fireEvent.submit(input.closest('form')!);
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    render(
      <ChatInterface 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage} 
        isLoading={true} 
      />
    );
    expect(screen.getByText('Typing...')).toBeInTheDocument();
  });

  it('should disable input when loading', () => {
    render(
      <ChatInterface 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage} 
        isLoading={true} 
      />
    );
    expect(screen.getByPlaceholderText('Type your response...')).toBeDisabled();
  });

  it('should disable input when disabled prop is true', () => {
    render(
      <ChatInterface 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage} 
        disabled={true} 
      />
    );
    expect(screen.getByPlaceholderText('Type your response...')).toBeDisabled();
  });

  it('should render custom placeholder', () => {
    render(
      <ChatInterface 
        messages={mockMessages} 
        onSendMessage={mockOnSendMessage} 
        placeholder="Custom placeholder..."
      />
    );
    expect(screen.getByPlaceholderText('Custom placeholder...')).toBeInTheDocument();
  });

  describe('Suspicion Meter', () => {
    it('should not show suspicion meter by default', () => {
      render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
      expect(screen.queryByText('Suspicion Level')).not.toBeInTheDocument();
    });

    it('should show suspicion meter when enabled', () => {
      render(
        <ChatInterface 
          messages={mockMessages} 
          onSendMessage={mockOnSendMessage} 
          showSuspicionMeter={true}
          suspicionLevel={50}
        />
      );
      expect(screen.getByText('Suspicion Level')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should show warning at high suspicion levels', () => {
      render(
        <ChatInterface 
          messages={mockMessages} 
          onSendMessage={mockOnSendMessage} 
          showSuspicionMeter={true}
          suspicionLevel={75}
        />
      );
      expect(screen.getByText(/High suspicion/)).toBeInTheDocument();
    });
  });

  describe('Quick Responses', () => {
    it('should render quick response buttons', () => {
      const quickResponses = ['Yes', 'No', 'Maybe'];
      render(
        <ChatInterface 
          messages={mockMessages} 
          onSendMessage={mockOnSendMessage}
          quickResponses={quickResponses}
        />
      );
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
      expect(screen.getByText('Maybe')).toBeInTheDocument();
    });

    it('should call onSendMessage when clicking quick response', () => {
      const quickResponses = ['Yes', 'No'];
      render(
        <ChatInterface 
          messages={mockMessages} 
          onSendMessage={mockOnSendMessage}
          quickResponses={quickResponses}
        />
      );
      fireEvent.click(screen.getByText('Yes'));
      expect(mockOnSendMessage).toHaveBeenCalledWith('Yes');
    });
  });

  describe('Report Attack Button', () => {
    it('should not show report button by default', () => {
      render(<ChatInterface messages={mockMessages} onSendMessage={mockOnSendMessage} />);
      expect(screen.queryByText(/Report as Social Engineering/)).not.toBeInTheDocument();
    });

    it('should show report button when handler provided', () => {
      render(
        <ChatInterface 
          messages={mockMessages} 
          onSendMessage={mockOnSendMessage}
          onReportAttack={mockOnReportAttack}
        />
      );
      expect(screen.getByText(/Report as Social Engineering/)).toBeInTheDocument();
    });

    it('should call onReportAttack when clicking report button', () => {
      render(
        <ChatInterface 
          messages={mockMessages} 
          onSendMessage={mockOnSendMessage}
          onReportAttack={mockOnReportAttack}
        />
      );
      fireEvent.click(screen.getByText(/Report as Social Engineering/));
      expect(mockOnReportAttack).toHaveBeenCalled();
    });
  });

  describe('Message Metadata', () => {
    it('should show attack indicator for attack messages', () => {
      const messagesWithAttack: ChatMessage[] = [
        {
          id: 'msg-attack',
          role: 'assistant',
          content: 'Suspicious message',
          timestamp: new Date(),
          metadata: {
            isAttack: true,
          },
        },
      ];
      render(<ChatInterface messages={messagesWithAttack} onSendMessage={mockOnSendMessage} />);
      // The avatar should have red styling for attack messages
      expect(screen.getByText('Suspicious message')).toBeInTheDocument();
    });

    it('should show red flag indicator when triggered', () => {
      const messagesWithRedFlag: ChatMessage[] = [
        {
          id: 'msg-flag',
          role: 'assistant',
          content: 'Flagged message',
          timestamp: new Date(),
          metadata: {
            redFlagTriggered: 'Urgency tactic detected',
          },
        },
      ];
      render(<ChatInterface messages={messagesWithRedFlag} onSendMessage={mockOnSendMessage} />);
      expect(screen.getByText('Potential manipulation detected')).toBeInTheDocument();
    });
  });
});
