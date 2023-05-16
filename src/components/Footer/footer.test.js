import React from "react";
import renderer from 'react-test-renderer';
import "@testing-library/jest-dom/extend-expect";
import Footer from "./Footer";


it("renders footer component", () => {
  let tree = renderer.create(<Footer />).toJSON();
  expect(tree).toMatchSnapshot()
});
