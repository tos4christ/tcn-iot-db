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
        // console.log(response, " the response from signin in");
        // Expected response
        // data.message,
        // data.token,
        // data.userName,
        // data.isLoggedIn
        // data.company
        // data.department
        // data.email
        // data.approval_level
        localStorage.setItem("userName", response.data.userName);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", response.data.isLoggedIn);
        localStorage.setItem("department", response.data.department);
        localStorage.setItem("approval_level", response.data.approval_level);
        localStorage.setItem("company", response.data.company);
        localStorage.setItem("email", response.data.email);
        //socket.emit("userSignin", { name: response.data.userName });
        // if the company is EKEDC then push to Disco route
        // if the company is TCN then push to Tcn route with the approval level
        if(response.data.company === "DISCO") {
          history.push("/api/tickets/disco");
        } else if(response.data.company === "TCN") {
          history.push("/api/tickets/tcn");
        }
        
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
              linkTo="/api/tickets/register"
            />
            <Button id="" text={"Login"} onClick={() => "coming"} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
