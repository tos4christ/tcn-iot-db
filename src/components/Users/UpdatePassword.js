import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Text from "../Inputs/Text";
import Button from "../Inputs/Button";

const UpdatePassword = (props) => {
  const history = useHistory();
  let [password, setPassWord] = useState("");
  let [show, setShow] = useState("disabled");

  // Get the email from the query parameters
  const search = history.location.search;
  const email = new URLSearchParams(search).get('email');

  const confirm_password = (e) => {
    // check if the password here matches the password and set show to true
    const check = password === e ? "enabled" : "disabled";
    if (check) {
      setShow(check);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "https://tcnnas.org/changepassword";
    const data = {
      email,
      password
    }
    fetch(url, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( (res) => res.json())
    .then( (response) => {
      console.log(response, 'the response')
      // This would push to the signin page for the user to now login
      history.push(`/signin`);
    })
    .catch( e => console.error(e));
  }
  return (
    <div className="py-4 responders-bg container-fluid bg-light">
      <div className="row my-4">
        <div className="col-sm-4 mx-auto mt-4 pt-4 bg-white shadow">
          <div className="signup-bg-user"></div>
          <form className="mt-3" onSubmit={handleSubmit} autoComplete="on">  
            <div className="update_password"><h2>Update Password</h2></div>          
            <Text
              placeholder="Password"
              type="password"
              name="paassword1"
              icon="fa fa-lock"
              nameChange={ setPassWord }
            />
            <Text
              placeholder="Confirm Password"
              type="password"
              name="paassword2"
              icon="fa fa-lock"
              nameChange={ confirm_password }
            />
            <Button text="Update Password" show={show} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
