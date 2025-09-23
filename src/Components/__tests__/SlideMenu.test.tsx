import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const routerPushMock = jest.fn();
const logoutMock = jest.fn((cb: () => void) => cb());
const toggleMock = jest.fn();

// Mocks
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: routerPushMock }), usePathname: () => '/' }));
jest.mock('@/Context/AppContext', () => ({
  useAppContext: () => ({
    userInfo: { id: '1', name: 'Juan', lastname: 'Perez' },
    slideMenuOpen: true,
    toggleSlideMenu: toggleMock,
    logout: logoutMock,
  }),
}));

import SlideMenu from '../SlideMenu';

describe('SlideMenu', () => {
  beforeEach(() => {
    // ensure desktop layout by defining innerWidth on the window object
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1024 });
    window.dispatchEvent(new Event('resize'));
  });

  it('renders user name and menu items and calls logout', async () => {
    const user = userEvent.setup();
    render(<SlideMenu isOpen={true} />);


  const matches = await screen.findAllByText(/Hola,/i);
  expect(matches.length).toBeGreaterThan(0);

  // menu items (may appear twice: aside + drawer)
  const inicios = await screen.findAllByText('Inicio');
  const cerrar = await screen.findAllByText('Cerrar sesión');
  expect(inicios.length).toBeGreaterThan(0);
  expect(cerrar.length).toBeGreaterThan(0);

    // click cerrar sesión
    const btn = screen.getAllByText('Cerrar sesión')[0];
    await user.click(btn);

  // logout mock should have been called via the context mock
  expect(logoutMock).toHaveBeenCalled();
  // router push should have been triggered by the logout callback
  expect(routerPushMock).toHaveBeenCalled();
  });
});
