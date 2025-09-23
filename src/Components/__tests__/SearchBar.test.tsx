import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup();
    const handle = jest.fn();
    render(<SearchBar placeholder="buscar" onSearch={handle} />);
    const input = screen.getByPlaceholderText('buscar');
    await user.type(input, 'hola{Enter}');
    expect(handle).toHaveBeenCalledWith('hola');
  });
});
