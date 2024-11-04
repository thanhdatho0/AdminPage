import { Outlet } from 'react-router';
import './App.css'
import SideBar from "./Components/SideBar/SideBar.tsx";

function App() {

  return (
    <div className="flex bg-[#1A1B2D]">
        <SideBar />
        <Outlet/>
      {/*<p>This is Admin Page</p>*/}
    </div>
  )
}

export default App
