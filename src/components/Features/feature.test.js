import React from "react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";
import Features from "./Features";

it("renders features component", () => {
  let tree = renderer.create(<Features/>).toJSON()
  expect(tree).toMatchSnapshot()
});
