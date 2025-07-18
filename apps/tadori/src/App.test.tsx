import { render } from '@testing-library/preact';
import App from './App';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have edit instruction text', () => {
    const { getByText } = render(<App />);
    expect(getByText(/save to reload/i)).toBeTruthy();
  });

  it('should have a Learn Preact link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/Learn Preact/i);
    expect(linkElement).toBeTruthy();
    expect(linkElement.getAttribute('href')).toBe('https://github.com/preactjs/preact');
  });
});