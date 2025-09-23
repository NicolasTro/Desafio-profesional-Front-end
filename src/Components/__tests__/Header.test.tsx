import React from 'react';
import { render } from '@testing-library/react';
import Header from '@/Components/Header';

// Mock next/navigation hooks used by the component
jest.mock('next/navigation', () => ({
	useRouter: () => ({ push: jest.fn() }),
	usePathname: () => '/',
}));

// Mock AppContext hook
jest.mock('@/Context/AppContext', () => ({
	useAppContext: () => ({ userInfo: null, toggleSlideMenu: jest.fn() }),
}));

test('Header renders without crashing', () => {
	const { container } = render(React.createElement(Header, {}));
	expect(container).toBeTruthy();
});
