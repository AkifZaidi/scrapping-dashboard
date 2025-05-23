import React, { useState } from "react";
import '../style/userpanel.css'
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import logo_name from "../assets/logo_name.png";

function Userpanel() {
  const [handlemenu, setHandleMenu] = useState("sidebar");
  const dashBoard = [
    {
      title: "Create User",
      path: "/adminpanel/createUser",
      category: "/adminpanel/createUser",
      icon: <i class="ri-flask-fill"></i>,
    },
    {
      title: "User",
      path: "/adminpanel/user",
      category: "/adminpanel/user",
      icon: <i class="ri-lock-password-fill"></i>,
    },
    {
      title: "Scrapper",
      path: "/adminpanel/scrapper",
      category: "/adminpanel/scrapper",
      icon: <i class="ri-lock-password-fill"></i>,
    },
  ];
  const [dashboardItem, setDashboardItem] = useState(dashBoard);
  const Navigation = useNavigate();

  // Sidebar toggle function
  const menuBtnChange = () => {
    console.log("Toggling sidebar:", handlemenu);
    setHandleMenu(!handlemenu);
  };

  const logout = () => {
    Navigation('/');
    // localStorage.removeItem("role")
  };

  // Search bar filtering
  const fillterSearchBar = (i) => {
    const search = i.target.value.toUpperCase();
    const searchData = dashBoard.filter((d) =>
      d.category.toUpperCase().includes(search)
    );
    setDashboardItem(searchData);
  };

  // Handle dashboard navigation (without closing the sidebar)
  const handleBoard = (path) => {
    if (path) {
      Navigation(path);  // Only navigate, do not toggle sidebar
    }
  };


  return (
    <>
      <div className={handlemenu ? "sidebar open" : "sidebar"}>
        <div className="logo-details">
          <div className="logo_name">
            <img src={logo_name} alt="logo" className="logo_img" />
          </div>
          <span onClick={menuBtnChange}>
            {handlemenu ? (
              <i class="ri-close-fill"></i>
            ) : (
              <i class="ri-menu-3-line"></i>
            )}
          </span>
        </div>
        <ul className="nav-list">
          {dashboardItem.map((item, index) => (
            <li
              className="dashboard-li"
              key={index}
              onClick={() => handleBoard(item.path)}  // Pass the path to handleBoard
            >
              {item.icon}
              <span className="links_name">{item.title}</span>
              <span className="tooltip">{item.title}</span>
            </li>
          ))}
          <li className="profile" onClick={logout}>
            <div className="profile-details">
              <i class="ri-logout-box-line"></i>
              <div className="name_job">
                <div className="name">Logout</div>
              </div>
            </div>
            <i className="bx bx-log-out" id="log_out"></i>
          </li>
        </ul>
      </div>
      <main className="content">
        <Outlet />
        {/* This renders the child routes */}
        {/* <Scrapper /> */}
        {/* <ScrapperList/> */}
      </main>

    </>
  );
}

export default Userpanel;
