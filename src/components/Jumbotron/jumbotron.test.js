import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
import Jumbotron from "./Jumbotron";
import { Router } from "react-router-dom";

it("renders jumbotron", () => {
  const historyMock = {
    push: jest.fn(),
    location: {},
    listen: jest.fn(),
    createHref: jest.fn(),
  };
  let tree = renderer
    .create(
      <Router history={historyMock}>
        <Jumbotron />
      </Router>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
