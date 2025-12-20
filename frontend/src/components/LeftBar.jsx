import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import dashboard from "../assets/dashboard.svg";
import menu from "../assets/menu.svg";
import staff from "../assets/staff.svg";
import inventory from "../assets/inventory.svg";
import reports from "../assets/reports.svg";
import order from "../assets/order.svg";
import reservation from "../assets/reservation.svg";
import logout from "../assets/logout.svg";
import notifications from "../assets/notifications.svg";
import profile from "../assets/profile.svg";

const LeftBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const NavParts = [
    { name: "Dashboard", icon: dashboard },
    { name: "Menu", icon: menu },
    { name: "Staff", icon: staff },
    { name: "Inventory", icon: inventory },
    { name: "Reports", icon: reports },
    { name: "Order/Table", icon: order, path: "order/table" },
    { name: "Reservation", icon: reservation },
  ];

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div className="bg-[#292C2D] flex items-center justify-between px-4 h-[56px]">
          <h1 className="text-[#FAC1D9] font-[Poppins] text-lg font-semibold">
            COSYPOS
          </h1>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Go to notifications"
              onClick={() => navigate("/notifications")}
              className="relative p-1"
            >
              {notifications ? (
                <img
                  src={notifications}
                  alt="notifications"
                  className="w-5 h-5"
                />
              ) : (
                <svg
                  className="w-5 h-5 text-[#FAC1D9]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              )}
            </button>

            <div className="w-px h-5 bg-gray-500" />

            {/* Profile Picture*/}
            <div
              className="w-8 h-8 rounded-full overflow-hidden border border-gray-500 cursor-pointer"
              onClick={() => navigate("/profile")}
              aria-label="Go to profile"
            >
              {profile ? (
                <img
                  src={profile}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600" />
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer text-white p-1 focus:outline-none ml-1"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-[56px] bg-black/50 z-40"
              onClick={closeMobileMenu}
            />

            {/* Dropdown */}
            <div className="absolute right-4 top-full mt-1 bg-[#292C2D] rounded-xl shadow-xl z-50 w-48 overflow-hidden">
              {NavParts.map((item) => (
                <NavLink
                  key={item.name}
                  to={"/" + (item.path || item.name.toLowerCase())}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? "bg-[#FAC1D9] text-[#333333]"
                        : "text-white hover:bg-[#3D4142]"
                    } border-b border-[#3D4142] last:border-b-0`
                  }
                >
                  <img src={item.icon} alt="" className="w-5 h-5" />
                  <p className="font-[Poppins] text-sm">{item.name}</p>
                </NavLink>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#3D4142] w-full transition-colors"
              >
                <img src={logout} alt="logout" className="w-5 h-5" />
                <p className="font-[Poppins] text-sm cursor-pointer">Logout</p>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Desktop Sidebar visible on large screens */}
      <div className="hidden lg:flex min-h-screen min-w-[171px] bg-[#292C2D] flex-col items-center justify-start rounded-tr-[30px] rounded-br-[30px] py-6">
        <h1 className="text-[#FAC1D9] pb-4 font-[Poppins]">COSYPOS</h1>

        {NavParts.map((item) => (
          <NavLink
            key={item.name}
            to={"/" + (item.path || item.name.toLowerCase())}
            className={({ isActive }) =>
              `my-1 w-[117px] h-[85px] rounded-sm ${
                isActive ? "bg-[#FAC1D9]" : "bg-[#292C2D]"
              } ${
                isActive ? "text-[#333333]" : "text-white"
              } border-b border-b-[#3D4142] hover:bg-[#3D4142] transition-colors`
            }
          >
            <div className="flex flex-col items-center justify-center py-4 gap-0.5">
              <img src={item.icon} alt="" className="w-6 h-6" />
              <p className="font-[Poppins] text-sm">{item.name}</p>
            </div>
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-white mt-auto hover:text-[#FAC1D9] transition-colors cursor-pointer"
        >
          <img src={logout} alt="" className="h-6" />
          <p className="font-[Poppins] text-sm">Logout</p>
        </button>
      </div>
    </>
  );
};

export default LeftBar;
