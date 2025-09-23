import { render, screen } from '@testing-library/react';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  it('renders the provided title', () => {
    render(<PageHeader nombre="Mi página" />);
    expect(screen.getByText('Mi página')).toBeInTheDocument();
  });
});
