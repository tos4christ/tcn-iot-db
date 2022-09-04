import React from "react";
import { withRouter } from 'react-router-dom';
import Text from "../Inputs/Text";
import Button from "../Inputs/Button";

class UpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.confirm_password = this.confirm_password.bind(this);
    this.setPassWord = this.setPassWord.bind(this);
    this.state = {
      password : "",
      show : "disabled",
      email: ""
    }
  }
  componentDidMount() {
    const email = localStorage.getItem("email");
    this.setState({email});
  }

  confirm_password(e) {
    // check if the password here matches the password and set show to true
    const check = this.state.password === e ? "enabled" : "disabled";
    if (check) {
      this.setState({show: check});
    }
  }
  setPassWord(e) {
    this.setState({password: e});
  }
  handleSubmit(e) {
    e.preventDefault();
    const url = "https://tcnnas.org/changepassword";
    const data = {
      email: this.state.email,
      password: this.state.password
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
      // console.log(response, 'the response')
      // This would push to the signin page for the user to now login
      this.props.history.push({pathname: `/home`});
    })
    .catch( e => console.error(e));
  }

  render() {
    return (
      <div className="py-4 responders-bg container-fluid bg-light">
        <div className="row my-4">
          <div className="col-sm-4 mx-auto mt-4 pt-4 bg-white shadow">
            <div className="signup-bg-user"></div>
            <form className="mt-3" onSubmit={this.handleSubmit} autoComplete="on">  
              <div className="update_password"><h2>Update Password</h2></div>          
              <Text
                placeholder="Password"
                type="password"
                name="paassword1"
                icon="fa fa-lock"
                nameChange={ this.setPassWord }
              />
              <Text
                placeholder="Confirm Password"
                type="password"
                name="paassword2"
                icon="fa fa-lock"
                nameChange={ this.confirm_password }
              />
              <Button text="Update Password" show={this.state.show} />
            </form>
          </div>
        </div>
      </div>
    );

  }


}

export default withRouter(UpdatePassword);
