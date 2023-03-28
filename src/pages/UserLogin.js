import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Text from "../components/Inputs/Text";
import Button from "../components/Inputs/Button";
import Link from "../components/Inputs/Links";
//import socket from "../utility/socketioConnection";

const UserLogin = () => {
  const history = useHistory();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const changeEmail = (email) => {
    setEmail(email);
    localStorage.setItem("userSocketEmail", email);
  };
  const changePassword = (password) => {
    setPassword(password);
    localStorage.setItem("userSocketPassword", password);
  };
  const handleSubmission = (e) => {
    e.preventDefault();
    const url = "https://tcnnas.org/ticketsignin";
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
        // Expected response
        // data.message,
        //   data.token,
        //   data.userName,
        //   data.isLoggedIn
        localStorage.setItem("userId", response.data.userName);
        localStorage.setItem("token", response.data.token);
        //socket.emit("userSignin", { name: response.data.userName });
        history.push("/user-dashboard");
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <div className="py-4 responders-bg container-fluid bg-light">
      <div className="row mt-4">
        <div className="col-sm-3 mx-auto mt-4 pt-4 bg-white shadow">
          <div className="login-bg"></div>
          <form className="mt-3" onSubmit={handleSubmission} autoComplete="on">
            <Text
              type={"email"}
              placeholder={"User Email"}
              name={"email"}
              icon={"fa fa-envelope"}
              nameChange={changeEmail}
            />
            <Text
              type={"password"}
              placeholder={"Password"}
              name={"password"}
              icon={"fa fa-lock"}
              nameChange={changePassword}
            />
            <Link
              question="Not Registered? "
              link="Signup"
              linkTo="/user-register"
            />
            <Button id="" text={"Login"} onClick={() => "coming"} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
