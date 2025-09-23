import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button component', () => {
  it('renders the label and responds to click', async () => {
    const user = userEvent.setup();
    const handle = jest.fn();
    render(<Button label="Hola" onClick={handle} />);

    expect(screen.getByRole('button', { name: /hola/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /hola/i }));
    expect(handle).toHaveBeenCalledTimes(1);
  });
});
