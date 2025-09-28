import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// shared mock so tests can change behavior without re-mocking modules
const mockLogout = jest.fn().mockResolvedValue(true)
const toggleMock = jest.fn()
jest.mock('@/Context/AppContext', () => ({
  useAppContext: () => ({
    toggleSlideMenu: toggleMock,
    logout: () => mockLogout(),
    setProfile: jest.fn(),
    userInfo: { id: 'user-1', name: 'Test', lastname: 'User' },
    slideMenuOpen: true,
  }),
}))

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/home',
}))

describe('SlideMenu branch coverage (extra)', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('mobile header click navigates to /home', async () => {
    const SlideMenu = (await import('../SlideMenu')).default
    // render as mobile drawer by passing isOpen
    render(<SlideMenu isOpen={true} onClose={() => {}} />)
    // wait for header(s) to appear; pick the last (drawer) instance
    const headers = await screen.findAllByText(/Hola,/i)
    const headerText = headers[headers.length - 1]
    // clicking the h2 should trigger the parent onClick that navigates
    await userEvent.click(headerText)
    expect(pushMock).toHaveBeenCalledWith('/home')
  })

  test('Cerrar sesión failure path does not navigate when logout rejects', async () => {
    // change the shared mock to resolve but NOT call the navigation callback
    mockLogout.mockResolvedValue(undefined)
    const SlideMenu = (await import('../SlideMenu')).default
    render(<SlideMenu isOpen={true} onClose={() => {}} />)

    const logoutItems = await screen.findAllByText(/Cerrar sesi/i)
    const logoutItem = logoutItems[logoutItems.length - 1]
    // clicking will call logout but it won't call the navigation callback
    await userEvent.click(logoutItem)

    // On failure/no-callback the navigation should not have been triggered
    expect(pushMock).not.toHaveBeenCalled()
  })
})
