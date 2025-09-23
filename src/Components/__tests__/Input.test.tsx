import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BasicInput from '../input';

describe('BasicInput', () => {
  it('renders with placeholder and calls onChange', async () => {
    const user = userEvent.setup();
    const handle = jest.fn();
    render(<BasicInput placeholder="Escribe" onChange={handle} />);

    const input = screen.getByPlaceholderText(/escribe/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await user.type(input, 'abc');
    // onChange called for each keystroke
    expect(handle).toHaveBeenCalled();
    expect(handle).toHaveBeenCalledWith('abc');
  });
});
