import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = auth.currentUser;

  // if user not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // otherwise render page
  return children;
};

export default ProtectedRoute;
