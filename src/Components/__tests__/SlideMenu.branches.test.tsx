import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const routerPushMock = jest.fn();
const logoutMock = jest.fn((cb: () => void) => cb());
const toggleMock = jest.fn();

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: routerPushMock }), usePathname: () => '/' }));
jest.mock('@/Context/AppContext', () => ({
  useAppContext: () => ({
    userInfo: { id: '1', name: 'Sara', lastname: 'Lopez' },
    slideMenuOpen: true,
    toggleSlideMenu: toggleMock,
    logout: logoutMock,
  }),
}));

import SlideMenu from '../SlideMenu';

describe('SlideMenu branches - mobile header click', () => {
  it('clicking header inside drawer stops propagation and navigates', async () => {
    const user = userEvent.setup();
    // force mobile layout
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 320 });
    window.dispatchEvent(new Event('resize'));

    render(<SlideMenu isOpen={true} />);

    const headers = await screen.findAllByText(/Hola,/i);
    expect(headers.length).toBeGreaterThan(0);

    // click the header in the drawer
    const header = headers[0];
    await user.click(header);
    // router push should be called by the header's click handler
    expect(routerPushMock).toHaveBeenCalledWith('/home');
  });
});
