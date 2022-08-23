import React from "react";

const Links = ({ link, linkTo, question }) => {
  return (
    <div className="d-flex justify-content-between">
      <p className="text-primary">
        {question}
        <a href={linkTo}>
          {link}
        </a>
      </p>
      <p className="ml-5">
        <a href="/" className="text-success">
          Back to home page
        </a>
      </p>
    </div>
  );
};

export default Links;
