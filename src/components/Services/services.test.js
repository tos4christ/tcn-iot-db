import React from "react";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import Services from "./Services";

it("renders service component", () => {
  let tree = renderer.create(<Services />).toJSON();
  expect(tree).toMatchSnapshot();
});
