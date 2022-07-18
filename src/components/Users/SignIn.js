import React from "react";
import { withRouter } from 'react-router-dom';
import Text from "../../components/Inputs/Text";
import Button from "../../components/Inputs/Button";
import Link from "../../components/Inputs/Links";
// import socket from "../utility/socketioConnection";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.state = {
      email: '',
      password: ''
    }
  }
  setEmail(email) {
    this.setState({email:email})
  }
  setPassword(password) {
    this.setState({password: password})
  }
  handleSubmission = (e) => {
    e.preventDefault();
    const url = "/signin";
    const email = this.state.email;
    const password = this.state.password;
    if (email === "" || password === "") {
      return;
    }
    const data = { email, password };
    fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((response) => {
      // check the response to see if this is their first login attempt
      // const firstLogin = response.status;

      // If first login then redirect to change password page
      this.props.history.push({pathname: `/changePassword`});
      
      //If this is not the first login Redirect to home page
      this.props.history.push({pathname: `/home`});
    })
    .catch((error) => console.error(error.message));
  };
  
  render() {
    return (
      <div className="py-4 responders-bg container-fluid bg-light">
        <div className="row mt-4">
          <div className="col-sm-4 mx-auto mt-4 pt-4 bg-white shadow">
            <div className="login-bg"></div>
            <form className="mt-3" onSubmit={this.handleSubmission} autoComplete="on">
              <Text
                type={"email"}
                placeholder={"User Email"}
                name={"email"}
                icon={"fa fa-envelope"}
                nameChange={ this.setEmail }
              />
              <Text
                type={"password"}
                placeholder={"Password"}
                name={"password"}
                icon={"fa fa-lock"}
                nameChange={ this.setPassword }
              />
              <Link
                question="Not Registered? "
                link="Sign Up"
                linkTo="/signup"
              />
              <Button id="" text={"Login"} onClick={() => "coming"} />
            </form>
          </div>
        </div>
      </div>
    );
  }  
};

export default withRouter(SignIn);
