import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
// import fetchJsonp from 'fetch-jsonp';
import Text from "../components/Inputs/Text";
import Button from "../components/Inputs/Button";
import Link from "../components/Inputs/Links";

const Register = () => {
  const history = useHistory();
  let [name, setName] = useState("");
  let [department, setDepartment] = useState("");
  let [approval_level, setApprovalLevel] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [password_match, setPasswordMatch] = useState("");
  // const match = useRouteMatch();
  

  const set_name = (name) => {
    setName(name);
  }
  const set_department = (department) => {
    setDepartment(department);
  }
  const set_approval_level = (level) => {
    setApprovalLevel(level);
  }
  const set_email = (email) => {
    setEmail(email);
  }
  const set_password = (password) => {
    setPassword(password);
  }
  const set_password_match = (password_match) => {
    setPasswordMatch(password_match);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if(password.length < 6 || password_match.length < 6) {
      return;
    }
    if(password !== password_match) {
      return;
    }
    const url = "https://tcnnas.org/ticketsignup";
    const data = {
      name,
      email,
      password,
      department,
      approval_level,
    }
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( (res) => res.json())
    .then( (response) => {     
      // This would push to the signin page for the user to now login
      history.push(`/login`);
    })
    .catch( e => console.log(e));
  }

  return (
    <div className="py-4 responders-bg container-fluid bg-light">
      <div className="row my-4">
        <div className="col-sm-4 mx-auto mt-4 pt-4 bg-white shadow">
          <div className="signup-bg"></div>
          <form className="mt-3" onSubmit={handleSubmit} autoComplete="on">
            <Text
              placeholder="Name"
              type="text"
              name={name}
              nameChange={ set_name }
              icon="fa fa-user"
            />
            <Text
              placeholder="Department"
              type="text"
              name={department}
              nameChange={ set_department }
              icon="fa fa-user"
            />
            <Text
              placeholder="Approval Level"
              type="text"
              name={approval_level}
              nameChange={ set_approval_level }
              icon="fa fa-user"
            />
            <Text
              placeholder="Email"
              type="email"
              name="email"
              icon="fa fa-envelope"
              nameChange={set_email}
            />
            <Text
              placeholder="Password"
              type="password"
              name="paassword1"
              icon="fa fa-lock"
              nameChange={set_password}
            />
            <Text
              placeholder="Re-enter password"
              type="password"
              name="paassword2"
              icon="fa fa-lock"
              nameChange={set_password_match}
            />

            <Link
              question="Already Registered? "
              link="Login"
              linkTo="/login"
            />
            <Button text="Sign Up" />
          </form>          
        </div>
      </div>
    </div>
  );
};

export default Register;
