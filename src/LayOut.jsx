import { Outlet } from "react-router-dom";
import Navbar from "./pages/Navbar";
import React from 'react'


function LayOut() {
  return (
    <div>
      
        <Outlet />
    </div>
  )
}

export default LayOut
