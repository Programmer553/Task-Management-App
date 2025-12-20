import React, { useState } from "react";
import {
  Users,
  ChevronDown,
  Bell,
  User,
  CreditCard,
  ChevronLeft,
} from "lucide-react";
import bg from "../assets/bg.svg";

const ReservationSystem = () => {
  const [selectedFloor, setSelectedFloor] = useState("1st Floor");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState("Today");
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const [formData, setFormData] = useState({
    tableNumber: "01",
    paxNumber: "",
    reservationDate: "",
    reservationTime: "",
    depositFee: "",
    status: "Confirmed",
    title: "Mr",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    customerId: "#12354564",
    paymentMethod: "",
    cardName: "",
    cardNumber: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const dateOptions = [
    "Today",
    "Tomorrow",
    "This Week",
    "This Month",
    "Custom Date",
  ];
  const paymentOptions = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Wallet",
    "Visa Card",
  ];

  const reservations = [
    {
      table: "Bar",
      startTime: "13:00",
      endTime: "15:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: false,
    },
    {
      table: "Bar",
      startTime: "17:00",
      endTime: "18:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: true,
    },
    {
      table: "A1",
      startTime: "17:00",
      endTime: "19:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: true,
    },
    {
      table: "A2",
      startTime: "11:00",
      endTime: "13:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: false,
    },
    {
      table: "A2",
      startTime: "15:00",
      endTime: "17:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: true,
    },
    {
      table: "B1",
      startTime: "11:00",
      endTime: "13:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: false,
    },
    {
      table: "B2",
      startTime: "15:00",
      endTime: "18:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: true,
    },
    {
      table: "B3",
      startTime: "12:00",
      endTime: "15:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: false,
    },
    {
      table: "C1",
      startTime: "18:00",
      endTime: "20:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: true,
    },
    {
      table: "C2",
      startTime: "17:00",
      endTime: "19:00",
      name: "John Doe",
      guests: "01",
      floor: "1st Floor",
      highlight: false,
    },

    {
      table: "A1",
      startTime: "12:00",
      endTime: "14:00",
      name: "Alice Smith",
      guests: "03",
      floor: "2nd Floor",
      highlight: true,
    },
    {
      table: "B2",
      startTime: "16:00",
      endTime: "18:00",
      name: "Bob Wilson",
      guests: "02",
      floor: "2nd Floor",
      highlight: false,
    },

    {
      table: "Bar",
      startTime: "14:00",
      endTime: "16:00",
      name: "Emma Davis",
      guests: "04",
      floor: "3rd Floor",
      highlight: false,
    },
    {
      table: "C1",
      startTime: "18:00",
      endTime: "20:00",
      name: "Chris Brown",
      guests: "02",
      floor: "3rd Floor",
      highlight: true,
    },
  ];

  const tables = ["Bar", "A1", "A2", "B1", "B2", "B3", "C1", "C2"];
  const timeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const CELL_SIZE = 104;

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const getReservationStart = (table, time) => {
    return reservations.find((r) => {
      if (r.table !== table || r.floor !== selectedFloor) return false;
      return r.startTime === time;
    });
  };

  const getReservationWidth = (res) => {
    const duration = timeToMinutes(res.endTime) - timeToMinutes(res.startTime);
    const cells = duration / 60;
    return cells * CELL_SIZE - 8;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ". ");
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, "0")} : ${m} ${ampm}`;
  };

  const handleSave = () => {
    if (!formData.cardName && formData.firstName && formData.lastName) {
      setFormData((prev) => ({
        ...prev,
        cardName: `${prev.firstName} ${prev.lastName}`,
      }));
    }
    setShowAddForm(false);
    setShowDetails(true);
  };

  const handleBackToGrid = () => {
    setShowDetails(false);
  };

  const resetForm = () => {
    setFormData({
      tableNumber: "01",
      paxNumber: "",
      reservationDate: "",
      reservationTime: "",
      depositFee: "",
      status: "Confirmed",
      title: "Mr",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      customerId: "#12354564",
      paymentMethod: "",
      cardName: "",
      cardNumber: "",
    });
  };

  // Reservation Details View
  if (showDetails) {
    return (
      <div className="min-h-screen bg-black text-white font-['Poppins'] p-6">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800"></div>

        {/* Table Image */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-[250px]">
          <img
            src={bg}
            alt="Restaurant Table"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-semibold text-white">
              Table # {formData.tableNumber}
            </h2>
          </div>
        </div>

        {/* Reservation Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Reservation Details</h3>
          <div className="bg-[#292C2D] rounded-xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Table Number</p>
                <p className="text-white font-medium">
                  {formData.tableNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Pax Number</p>
                <p className="text-white font-medium">
                  {formData.paxNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Reservation Date</p>
                <p className="text-white font-medium">
                  {formatDate(formData.reservationDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Reservation Time</p>
                <p className="text-white font-medium">
                  {formatTime(formData.reservationTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Deposit Fee</p>
                <p className="text-white font-medium">
                  {formData.depositFee || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white font-medium">
                  {formData.status || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
          <div className="bg-[#292C2D] rounded-xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Title</p>
                <p className="text-white font-medium">
                  {formData.title || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Full Name</p>
                <p className="text-white font-medium">
                  {formData.firstName || formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Phone number</p>
                <p className="text-white font-medium">
                  {formData.phoneNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email Address</p>
                <p className="text-white font-medium">
                  {formData.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
          <div className="bg-[#292C2D] rounded-xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Customer ID</p>
                <p className="text-white font-medium">{formData.customerId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Payment Method</p>
                <p className="text-white font-medium">
                  {formData.paymentMethod || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Name</p>
                <p className="text-white font-medium">
                  {formData.cardName ||
                    `${formData.firstName} ${formData.lastName}`.trim() ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Card Number</p>
                <p className="text-white font-medium">
                  {formData.cardNumber || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              handleBackToGrid();
              resetForm();
            }}
            className="cursor-pointer text-gray-400 hover:text-white px-6 py-3 transition-colors font-medium"
          >
            Cancel Reservation
          </button>
          <button className="cursor-pointer bg-pink-300 text-black px-8 py-3 rounded-xl font-medium hover:bg-pink-400 transition-colors">
            Change Table
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Poppins']">
      <div className="p-6">
        {/* Floor tabs and actions */}
        <div className="flex items-center justify-between px-6">
          <div className="flex gap-3">
            {["1st Floor", "2nd Floor", "3rd Floor"].map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedFloor === floor
                    ? "bg-pink-300 text-black"
                    : "bg-transparent text-white hover:bg-gray-800"
                }`}
              >
                {floor}
              </button>
            ))}
          </div>

          <div className="flex gap-4 ">
            <div className="relative ">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#3D4142] rounded-lg text-sm hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <span>{selectedDateOption}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showDateDropdown ? "rotate-180 " : ""
                  }`}
                />
              </button>

              {showDateDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDateDropdown(false)}
                  />
                  <div className="absolute top-full mt-2 right-0 bg-[#2A2A2A] rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 min-w-[150px]">
                    {dateOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedDateOption(option);
                          setShowDateDropdown(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                          selectedDateOption === option
                            ? "bg-pink-300/20 text-pink-300"
                            : "text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="px-5 py-2.5 bg-pink-300 text-black rounded-lg text-sm font-medium cursor-pointer"
            >
              Add New Reservation
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Grid */}
      <div className="sm:px-12 px-0 overflow-x-auto h-344 sm:h-auto">
        <div className="sm:inline-block grid grid-cols-1 ">
          <div className="flex">
            <div
              style={{ width: CELL_SIZE, height: 40 }}
              className="flex items-center justify-center bg-black"
            />
            {timeSlots.map((time) => (
              <div
                key={time}
                style={{ width: CELL_SIZE, height: 40 }}
                className="flex items-center justify-center text-sm text-white font-medium bg-black"
              >
                {time}
              </div>
            ))}
          </div>

          {tables.map((table) => (
            <div key={table} className="flex">
              <div
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                className="flex items-center justify-center text-sm text-white font-medium border border-[#5E5E5E] bg-black"
              >
                {table}
              </div>

              {timeSlots.map((time) => {
                const reservation = getReservationStart(table, time);

                return (
                  <div
                    key={`${table}-${time}`}
                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    className="relative border border-[#5E5E5E] bg-black"
                  >
                    {reservation && (
                      <div
                        onClick={() => setShowDetails(true)}
                        className={`absolute top-1 left-1 p-3 z-10 cursor-pointer hover:opacity-90 transition-opacity ${
                          reservation.highlight
                            ? "bg-pink-200 text-black"
                            : "bg-[#3D4142] text-white"
                        }`}
                        style={{
                          width: getReservationWidth(reservation),
                          height: CELL_SIZE - 10,
                          borderRadius: 10,
                        }}
                      >
                        <div className="text-sm font-medium">
                          {reservation.name}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                          <Users className="w-3 h-3" />
                          <span>{reservation.guests}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add Reservation Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-end z-50"
          onClick={() => {
            setShowAddForm(false);
            setShowPaymentDropdown(false);
          }}
        >
          <div
            className="h-full bg-[#1C1C1C] text-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 640,
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
            }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Add New Reservation</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-[#2A2A2A]"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Reservation Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Table Number
                  </label>
                  <div className="relative">
                    <select
                      value={formData.tableNumber}
                      onChange={(e) =>
                        handleInputChange("tableNumber", e.target.value)
                      }
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white appearance-none cursor-pointer"
                    >
                      <option>01</option>
                      <option>02</option>
                      <option>03</option>
                      <option>04</option>
                      <option>05</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Pax Number
                  </label>
                  <input
                    type="text"
                    value={formData.paxNumber}
                    onChange={(e) =>
                      handleInputChange("paxNumber", e.target.value)
                    }
                    placeholder="05 persons"
                    className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={formData.reservationDate}
                    onChange={(e) =>
                      handleInputChange("reservationDate", e.target.value)
                    }
                    className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Reservation Time
                  </label>
                  <div className="relative">
                    <select
                      value={formData.reservationTime}
                      onChange={(e) =>
                        handleInputChange("reservationTime", e.target.value)
                      }
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Deposit Fee
                  </label>
                  <input
                    type="text"
                    value={formData.depositFee}
                    onChange={(e) =>
                      handleInputChange("depositFee", e.target.value)
                    }
                    placeholder="60.00 $"
                    className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white appearance-none cursor-pointer"
                    >
                      <option>Confirmed</option>
                      <option>Pending</option>
                      <option>Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Title
                  </label>
                  <div className="relative">
                    <select
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white appearance-none cursor-pointer"
                    >
                      <option>Mr</option>
                      <option>Ms</option>
                      <option>Mrs</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Full Name
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Watson"
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Joyce"
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="+1 (123) 123 4654"
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="watsonjoyce112@gmail.com"
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <h3 className="text-lg font-semibold mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-300/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-pink-300" />
                    </div>
                    <span className="text-white font-medium">Customer ID</span>
                  </div>
                  <span className="text-gray-400">{formData.customerId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-300/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-pink-300" />
                    </div>
                    <span className="text-white font-medium">
                      Payment Method
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowPaymentDropdown(!showPaymentDropdown)
                      }
                      className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>{formData.paymentMethod || "Select"}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showPaymentDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showPaymentDropdown && (
                      <div className="absolute top-full mt-2 right-0 bg-[#2A2A2A] rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 min-w-[150px]">
                        {paymentOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              handleInputChange("paymentMethod", option);
                              setShowPaymentDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                              formData.paymentMethod === option
                                ? "bg-pink-300/20 text-pink-300"
                                : "text-white"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Number field - show only for card payments */}
                {(formData.paymentMethod === "Credit Card" ||
                  formData.paymentMethod === "Debit Card" ||
                  formData.paymentMethod === "Visa Card") && (
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      placeholder="**** **** **** ****"
                      className="w-full bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] text-white placeholder-gray-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 flex justify-end gap-4">
              <button
                className="cursor-pointer text-gray-400 px-6 py-2 hover:text-white transition-colors"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="cursor-pointer bg-pink-300 text-black px-8 py-3 rounded-lg font-medium hover:bg-pink-400 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationSystem;
