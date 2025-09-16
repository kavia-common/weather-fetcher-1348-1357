import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders weather fetcher heading and input', () => {
  render(<App />);
  expect(screen.getByText(/Weather Fetcher/i)).toBeInTheDocument();
  const input = screen.getByPlaceholderText(/e\.g\., London/i);
  expect(input).toBeInTheDocument();
});

test('disables Get Weather button when input is empty', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /Get Weather/i });
  expect(button).toBeDisabled();
});

test('enables Get Weather button when input has text', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/e\.g\., London/i);
  fireEvent.change(input, { target: { value: 'Paris' } });
  const button = screen.getByRole('button', { name: /Get Weather/i });
  expect(button).not.toBeDisabled();
});
