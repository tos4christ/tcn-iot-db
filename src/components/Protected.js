import { Navigate } from "react-router-dom";

const Protected = ({ isLoggedIn, children }) => {
 if (isLoggedIn !== true) {
 return <Navigate to="/" replace />;
 }
 return children;
};

export default Protected;