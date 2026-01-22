import React from "react";
import Sidebar from "./SideBar";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      <div className="h-screen">
        <Sidebar/>
      </div>
      <div className="flex flex-col flex-1 h-screen md:px-7 px-2 overflow-hidden">
        <NavBar />
        <main className="flex-1  h-full overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
