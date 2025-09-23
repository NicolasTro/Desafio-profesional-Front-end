// Jest setup for DOM testing (CommonJS)
require('@testing-library/jest-dom');

// Mock next/navigation or other Next.js-specific modules if needed
// Example:
// jest.mock('next/router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

// Mock MUI Joy Input to a native input for tests
jest.mock('@mui/joy/Input', () => ({
	__esModule: true,
		default: (props) => {
			return require('react').createElement('input', props);
		},
}));

// Provide a safe default global.fetch that tests can override per-suite.
if (typeof global.fetch === 'undefined') {
	const _defaultFetch = jest.fn(() =>
		Promise.resolve({ ok: false, status: 500, text: () => Promise.resolve('') }),
	);
	// mark as default so handlers can detect test environment and simulate upstream
		_defaultFetch.__is_default_fetch = true;
		global.fetch = _defaultFetch;
}
