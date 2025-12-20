import React, { useState, lazy, Suspense } from "react";
import LeftBar from "./components/LeftBar";
import LoginPage from "./Login";
import Dashboard from "./components/Dashboard";
import { Routes, Route, useLocation } from "react-router-dom";
import ReservationSystem from "./components/ReservationSystem";
import Ordertable from "./components/Ordertable";
import Payment from "./components/Payment";
import OrdersPart from "./components/OrdersPart";
import PinPage from "./components/PinPage";
import Notifications from "./components/Notifications";
import Inventory from "./components/Inventory";
import ReportPage from "./components/ReportPage";
import ProfilePage from "./components/ProfilePage";
import MainContent from "./MainContent";
import Register from "./Register";
const StaffManagement = lazy(() => import("./components/StaffManagement"));
const MenuManagement = lazy(() => import("./components/MenuManagement"));
function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const location = useLocation();

  const showLeftBar =
    location.pathname !== "/register" && location.pathname !== "/";

  return (
    <div className="bg-black text-white flex min-h-screen font-[Poppins]">
      {showLeftBar && (
        <LeftBar activePage={activePage} setActivePage={setActivePage} />
      )}
      <div className="flex-1">
        {(location.pathname !== "/" && location.pathname !== "/register")  && <MainContent />}
        
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order/table" element={<Ordertable />} />
          <Route path="/orderspart" element={<OrdersPart />} />
          <Route path="/pin" element={<PinPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reservation" element={<ReservationSystem />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
