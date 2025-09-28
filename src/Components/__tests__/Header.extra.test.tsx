import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/Components/Header";

// Mock next/navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/home",
}));

// Mock AppContext with a logged-in user
jest.mock("@/Context/AppContext", () => ({
  useAppContext: () => ({
    userInfo: { id: "1", name: "Ana", lastname: "Perez", email: "a@b.com" },
    toggleSlideMenu: jest.fn(),
  }),
}));

test("Header shows greeting when authenticated", () => {
  render(React.createElement(Header, {}));
  expect(screen.getByText(/Hola,/)).toBeTruthy();
});
