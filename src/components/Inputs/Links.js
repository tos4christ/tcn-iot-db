import React from "react";

const Links = ({ link, linkTo, question }) => {
  return (
    <div className="d-flex">
      <p>
        {question}
        <a href={linkTo} className="text-primary ">
          {link}
        </a>
      </p>
      <a href="/" className="text-success ml-auto">
        Back to home page
      </a>
    </div>
  );
};

export default Links;
