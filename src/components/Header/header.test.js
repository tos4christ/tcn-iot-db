import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Router } from "react-router-dom";
import Header from "./Header";

it("renders header component", () => {
  const historyMock = {
    push: jest.fn(),
    location: {},
    listen: jest.fn(),
    createHref: jest.fn(),
  };
  render(
    <Router history={historyMock}>
      <Header />
    </Router>
  );
});
