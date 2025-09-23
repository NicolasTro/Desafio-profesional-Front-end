import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/Digital Money House/i)).toBeInTheDocument();
  });
});
