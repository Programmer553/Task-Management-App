import React, { useState } from "react";
import alertIcon from "../assets/alert.svg";
import { Trash2 } from "lucide-react";

export default function NotificationPage() {
  const [filter, setFilter] = useState("all");
  const [showPopup, setShowPopup] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low Inventory Alert",
      msg: "The stock for Tomato Sauce and Chicken Breast is below threshold.",
      date: new Date().toLocaleDateString("en-GB"),
      isRead: false,
    },
    {
      id: 2,
      title: "New Order Received",
      msg: "A new dine-in order has been placed at Table 5.",
      date: new Date().toLocaleDateString("en-GB"),
      isRead: false,
    },
    {
      id: 3,
      title: "Reservation Reminder",
      msg: "A reservation is scheduled at 7:00 PM for 3 guests.",
      date: new Date().toLocaleDateString("en-GB"),
      isRead: true,
    },
    {
      id: 4,
      title: "Low Inventory Alert",
      msg: "Cheese blocks are reaching critical levels.",
      date: new Date().toLocaleDateString("en-GB"),
      isRead: false,
    },
    {
      id: 5,
      title: "Payment Received",
      msg: "Payment from Order #4321 was processed.",
      date: new Date().toLocaleDateString("en-GB"),
      isRead: true,
    },
    {
      id: 6,
      title: "Cancelled Reservation",
      msg: "Reservation for 2 guests at 8 PM has been cancelled.",
      date: new Date().toLocaleDateString("en-GB"),
      isRead: false,
    },
  ]);

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setFilter("all");

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div className="w-full bg-black min-h-screen text-white relative px-2">
      {showPopup && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 
                        bg-[#2D2D2D] text-white px-6 py-3 
                        rounded-lg shadow-md text-sm z-50"
        >
          All messages are read
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-10 pt-4 sm:pt-0">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-md font-medium text-sm sm:text-base cursor-pointer ${
            filter === "all"
              ? "bg-[#FAC1D9] text-black"
              : "bg-[#2d2d2d] text-gray-300"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`px-5 py-2 rounded-md font-medium text-sm sm:text-base cursor-pointer ${
            filter === "unread"
              ? "bg-[#FAC1D9] text-black"
              : "bg-[#2d2d2d] text-gray-300"
          }`}
        >
          Unread
        </button>

        <button
          onClick={markAllAsRead}
          className="bg-[#FAC1D9] text-black px-5 py-2 rounded-md font-medium ml-auto sm:ml-auto text-sm sm:text-base cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="px-4 sm:px-10 mt-6 pb-10">
        {filtered.map((n, index) => (
          <div
            key={n.id}
            className={`
              px-4 sm:px-6 py-5 
              flex flex-col sm:flex-row 
              sm:justify-between sm:items-center 
              gap-4
              ${index % 2 === 0 ? "bg-[#0F0F0F]" : "bg-[#2A2A2A]"}
              border-b border-[#222]
              rounded-md sm:rounded-none
            `}
          >
            <div className="flex gap-4 items-start sm:items-center">
              <img src={alertIcon} alt="alert" className="h-10 w-10" />

              <div>
                <h2 className="font-semibold text-base">{n.title}</h2>
                <p className="text-gray-300 text-sm">{n.msg}</p>

                <p className="text-gray-400 text-xs mt-2 sm:hidden">{n.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:flex-row flex-row-reverse justify-between sm:justify-end">
              <p className="text-gray-400 text-sm hidden sm:block">{n.date}</p>

              <button
                onClick={() => deleteNotification(n.id)}
                className="bg-[#303030] hover:bg-[#3a3a3a] px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={14} className="text-red-500" />
                <span className="text-xs">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
