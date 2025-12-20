import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import back from "./assets/back.svg";
import notifications from "./assets/notifications.svg";
import profile from "./assets/profile.svg";

export default function MainContent({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  /* PAGE TITLES */
  const getPageTitle = () => {
    if (location.pathname === "/dashboard") return "Dashboard";
    if (location.pathname === "/inventory") return "Inventory";
    if (location.pathname === "/notifications") return "Notification";
    if (location.pathname === "/staff") return "Staff";
    if (location.pathname === "/menu") return "Menu";
    if (location.pathname === "/reports") return "Reports";
    if (location.pathname === "/order/table") return "Orders";
    if (location.pathname === "/orderspart") return "Orders";
    if (location.pathname === "/staff") return "Staff";
    if (location.pathname === "/pin") return "Orders";
    if (location.pathname === "/payment") return "Orders";
    if (location.pathname === "/reservation") return "Reservation";
    if (location.pathname === "/profile") return "Profile";
    if (location.pathname === "/register") return "Register";
    return "";
  };

  /*  SUBTITLE  */
  const getSubtitle = () => {
    if (location.pathname === "/notifications") {
      return "You've 3 unread notifications";
    }
    return "";
  };

  return (
    <div className="bg-black w-full sm:px-10 px-2 pt-[60px] lg:pt-8 ">
      {/* TOP HEADER  */}
      <div className="flex items-start justify-between">
        {/* LEFT SIDE — BACK ARROW + PAGE TITLE */}
        <div className="flex gap-2 items-start ">
          <button onClick={() => navigate(-1)}>
            <img src={back} alt="back" className="h-[30px] cursor-pointer" />
          </button>

          <div>
            <h1 className="text-xl font-[Poppins] ">{getPageTitle()}</h1>

            {location.pathname === "/notifications" && (
              <p className="text-sm text-gray-400 my-0 sm:my-3 ">
                {getSubtitle()}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — ICONS */}

        <div className=" hidden lg:flex items-center gap-4 ">
          <Link to="/notifications">
            <img src={notifications} alt="notifications" className="h-5  " />
          </Link>

          <p>|</p>

          <Link to="/profile">
            <img src={profile} alt="profile" className="h-9 " />
          </Link>
        </div>
      </div>
    </div>
  );
}
