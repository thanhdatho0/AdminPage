import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
import "./index.css";
// import App from './App.tsx'
import { UserProvider } from "./Components/UserContext/UserContext.tsx";
import Routes from "./Routes/Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      {/* <RouterProvider router={router} /> */}
      <Routes />
    </UserProvider>
    {/*<App />*/}
  </StrictMode>
);
