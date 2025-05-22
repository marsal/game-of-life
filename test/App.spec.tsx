import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

// Mock GameOfLife to isolate App component testing
vi.mock('../src/Components/GameOfLife', () => {
  return {
    default: () => <div data-testid="game-of-life-mock">Mocked GameOfLife</div>,
  };
});

describe('App Component Tests', () => {
  it('should render the main heading "Game of life"', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', {
      name: /game of life/i,
    });
    expect(headingElement).toBeInTheDocument();
  });

  it('should render the GameOfLife component', () => {
    render(<App />);
    // Check for the mock's output
    const gameOfLifeElement = screen.getByTestId('game-of-life-mock');
    expect(gameOfLifeElement).toBeInTheDocument();
    expect(gameOfLifeElement).toHaveTextContent('Mocked GameOfLife');
  });
});
