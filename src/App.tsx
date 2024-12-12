import { Outlet, useNavigate } from "react-router";
import "./App.css";
import SideBar from "./Components/SideBar/SideBar.tsx";
import { useContext, useEffect } from "react";
import { UserContext } from "./Components/UserContext/UserContext.tsx";

function App() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user.isAuthenticated) navigate("/login");
  }, []);
  return (
    <div className="flex bg-[#1A1B2D]">
      <SideBar />
      <Outlet />
      {/*<p>This is Admin Page</p>*/}
    </div>
  );
}

export default App;
