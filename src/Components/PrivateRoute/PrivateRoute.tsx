import App from "../../App";
import LoginPage from "../../Pages/LoginPage/LoginPage";

const PrivateRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return isAuthenticated ? <App /> : <LoginPage />;
};

export default PrivateRoute;
