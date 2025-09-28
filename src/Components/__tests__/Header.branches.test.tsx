import React from "react";
import { render, screen } from "@testing-library/react";
// userEvent no es necesario en estos tests

describe("Header - branch coverage for getInitials and pathname", () => {
  afterEach(() => jest.resetModules());

  async function loadWithMocks(pathname: string, userInfo: unknown) {
    const pushMock = jest.fn();
    jest.doMock("next/navigation", () => ({
      useRouter: () => ({ push: pushMock }),
      usePathname: () => pathname,
    }));

    jest.doMock("@/Context/AppContext", () => ({
      useAppContext: () => ({
        userInfo,
        toggleSlideMenu: jest.fn(),
      }),
    }));

    const { default: Header } = await import("@/Components/Header");
    return { Header, pushMock };
  }

  it("shows single 'Iniciar sesión' button on /register", async () => {
    const { Header } = await loadWithMocks("/register", null);
    render(<Header />);
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
  });

  it("getInitials: both name and lastname -> two letters", async () => {
    const user = { name: "Pedro", lastname: "Gomez" };
    const { Header } = await loadWithMocks("/home", user);
    render(<Header />);
    const avatar = screen.getByTitle("Usuario Autenticado");
    expect(avatar).toHaveTextContent(/PG/);
  });

  it("getInitials: only name -> single letter", async () => {
    const user = { name: "Lucia" };
    const { Header } = await loadWithMocks("/home", user);
    render(<Header />);
    const avatar = screen.getByTitle("Usuario Autenticado");
    expect(avatar).toHaveTextContent(/^L$/);
  });

  it("getInitials: only lastname -> single letter", async () => {
    const user = { lastname: "Martinez" };
    const { Header } = await loadWithMocks("/home", user);
    render(<Header />);
    const avatar = screen.getByTitle("Usuario Autenticado");
    expect(avatar).toHaveTextContent(/^M$/);
  });

  it("getInitials: none -> U", async () => {
    const { Header } = await loadWithMocks("/home", {});
    render(<Header />);
    const avatar = screen.getByTitle("Usuario Autenticado");
    expect(avatar).toHaveTextContent(/U/);
  });
});
