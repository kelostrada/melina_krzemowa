import React from "react";
import { ManageIotComponent } from "../ManageIot";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(() => ({
    isLoading: false,
    isAuthenticated: true,
    getAccessTokenSilently: jest.fn(() => Promise.resolve("access-token")),
  })),
  withAuthenticationRequired: jest.fn(),
}));

jest.mock("../../config", () => ({
  getConfig: jest.fn(() => ({
    domain: "test-domain.com",
    clientId: "123",
    apiOrigin: "http://localhost:3001",
    audience: "test-audience",
  })),
}));

describe("The ManageIot component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("renders", () => {
    render(<ManageIotComponent />);
  });

  it("makes a call to the API when the button is clicked", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        payload: {
          socket1: true,
          socket2: true,
          socket3: true,
          socketUSB: true,
          currentElectricity: 100,
          currentPower: 10.1,
          currentVoltage: 235.5,
        },
      })
    );

    render(<ManageIotComponent />);
    fireEvent.click(screen.getByText("Refresh"));

    await waitFor(() => screen.getByTestId("api-result"));

    expect(await screen.findByText(/Socket 1 - true/)).toBeInTheDocument();
    expect(await screen.findByText(/Socket 2 - true/)).toBeInTheDocument();
    expect(await screen.findByText(/Socket 3 - true/)).toBeInTheDocument();
    expect(await screen.findByText(/Socket USB - true/)).toBeInTheDocument();
    expect(
      await screen.findByText(/Current Electricity - 100mA/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Current Power - 10.1W/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Current Voltage - 235.5V/)
    ).toBeInTheDocument();
  });

  it("shows the warning content when there is no audience", async () => {
    const { getConfig } = require("../../config");

    getConfig.mockImplementation(() => ({
      getConfig: () => ({
        domain: "test-domain.com",
        clientId: "123",
        apiOrigin: "http://localhost:3001",
      }),
    }));

    render(<ManageIotComponent />);

    expect(
      await screen.findByText(/You can't call the API at the moment/)
    ).toBeInTheDocument();
  });
});
