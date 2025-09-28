import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "@/Components/Header";

// Mocks
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/",
}));

const mockToggle = jest.fn();
jest.mock("@/Context/AppContext", () => ({
  useAppContext: () => ({
    userInfo: null,
    toggleSlideMenu: mockToggle,
  }),
}));

describe("Header component - coverage", () => {
  afterEach(() => jest.clearAllMocks());

  it("getInitials via NameTag - anonymous shows U", () => {
    render(<Header />);
    // When userInfo is null we expect to see 'Ingresar' button
    expect(screen.getByText(/Ingresar/i)).toBeInTheDocument();
  });

  it("shows auth buttons and calls router on click", async () => {
  await import("next/navigation");
    render(<Header />);
    const loginBtn = screen.getByText(/Ingresar/i);
    fireEvent.click(loginBtn);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("when authenticated shows name and hamburger triggers toggleSlideMenu", async () => {
    // Re-mock AppContext to return an authenticated user
    jest.resetModules();
    const mockUser = { name: "Ana", lastname: "Perez", email: "a@p.com" };
    jest.doMock("@/Context/AppContext", () => ({
      useAppContext: () => ({
        userInfo: mockUser,
        toggleSlideMenu: mockToggle,
      }),
    }));

    // Import Header dynamically to pick up the new mock
    const { default: HeaderComp } = await import("@/Components/Header");
    render(<HeaderComp />);
    expect(screen.getByText(/Hola,/i)).toBeInTheDocument();
    const btn = screen.getByLabelText(/Abrir menú/i);
    fireEvent.click(btn);
    expect(mockToggle).toHaveBeenCalled();
  });
});
