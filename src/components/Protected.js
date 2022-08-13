import { Redirect } from "react-router-dom";

const Protected = ({ isLoggedIn, children }) => {
 if (isLoggedIn !== true) {
 return <Redirect to="/" replace />;
 }
 return children;
};

export default Protected;