import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Text from "../../components/Inputs/Text";
import Button from "../../components/Inputs/Button";
import Link from "../../components/Inputs/Links";

const SignUp = (props) => {
  const history = useHistory();
  let [name, setName] = useState("");
  let [role, setRole] = useState("");
  let [email, setMail] = useState("");
  let [password, setPassWord] = useState("");
  // const match = useRouteMatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "/signup";
    const data = {
      name,
      role,
      email,
      password
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
            <Text
              placeholder="Names"
              type="text"
              name={name}
              nameChange={ setName }
              icon="fa fa-user"
            />
            <div className="input-group mb-3 border-bottom">
              <select
                className="form-control custom-select border-0"
                required
                name="role"
                onChange={ e => setRole(e.target.value)}
              >
                <option value="">Role</option>
                <option value="Admin">Admin</option>
                <option value="Support">Support</option>
                <option value="Reviewer">Reviewer</option>                
              </select>
              <div className="input-group-append">
                <span
                  className="input-group-text bg-none border-0"
                  id="basic-addon2"
                >
                  <span className="fa fa-university"></span>
                </span>
              </div>
            </div>                      
            <Text
              placeholder="User Email"
              type="email"
              name="email"
              icon="fa fa-envelope"
              nameChange={ setMail }
            />
            <Text
              placeholder="Password"
              type="password"
              name="paassword1"
              icon="fa fa-lock"
              nameChange={ setPassWord }
            />
            <Link
              question="Already Registered? "
              link="Sign In"
              linkTo="/signin"
            />
            <Button text="Sign Up" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
