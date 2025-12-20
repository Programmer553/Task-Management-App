import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrdersPart = () => {
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDigit = (d) => {
    setPin((prev) => {
      const updated = prev + d;
      if (updated.length === 4) navigate("/payment");
      return updated.slice(0, 4);
    });
  };
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProfileName(res.data.name);
      })
      .catch(() => {
        setProfileName("Customer");
      });
  }, []);
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // remove from UI after DB success
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error(
        "Failed to delete order",
        err.response?.data || err.message
      );
      alert("Failed to delete order");
    }
  };

  const [selectedTable, setSelectedTable] = useState({
    number: "01",
    customer: "Customer",
  });

  const fallbackOrders = [];

  useEffect(() => {
    axios
      .get("http://localhost:5000/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const mappedOrders = res.data.map((o) => ({
          id: o.id,
          customer: o.customer_name,
          orderNumber: o.id,
          status: o.status,
          statusBadge: o.status,
          statusIndicator:
            o.status === "In Process" ? "Cooking Now" : "Ready to serve",
          indicatorColor: o.status === "In Process" ? "yellow" : "green",
          date: new Date(o.created_at).toDateString(),
          time: new Date(o.created_at).toLocaleTimeString(),
          items: o.items.map((i) => ({
            qty: String(i.quantity).padStart(2, "0"),
            name: i.name,
            price: `₹${i.price}`,
          })),
          subtotal: `₹${o.subtotal}`,
        }));

        setOrders(mappedOrders);
      })
      .catch(() => setOrders([]));
  }, []);

  const tabs = ["All", "In Process", "Completed", "Cancelled"];
  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const searchedOrders = filteredOrders.filter((order) => {
    const customer = order.customer || "";
    const orderNumber = order.orderNumber || "";

    return (
      customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(orderNumber).includes(searchTerm)
    );
  });

  const getStatusClasses = (status) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-700";
      case "In Process":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getIndicatorColor = (color) => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      default:
        return "";
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 font-[Poppins]">
      <div className="max-w-[1350px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg ${
                  activeTab === tab
                    ? "bg-pink-300 text-black"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/orders")}
              className="bg-pink-300 text-black px-5 py-2 rounded-lg font-medium"
            >
              Add New Order
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search a name, order etc"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        {/* Orders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredOrders.length ? filteredOrders : fallbackOrders).map(
            (order) => (
              <div
                key={order.id}
                className="bg-[#292C2D] rounded-[10px] p-5 flex flex-col gap-4"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {/* ORDER NUMBER BOX */}
                    <div className="w-[60px] h-[60px] bg-[#FAC1D9] rounded-[5px] flex items-center justify-center">
                      <span className="text-[25px] font-medium text-[#333]">
                        {String(order.orderNumber).padStart(2, "0")}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[16px] font-medium">
                        {order.customer}
                      </h3>
                      <p className="text-[12px] font-light text-white">
                        Order #{order.orderNumber}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 bg-[#E3FFE4] px-2 py-[5px] rounded-[5px] text-[12px] text-[#333]">
                      ✓ {order.status}
                    </span>

                    <div className="flex items-center gap-2 text-[12px] text-white">
                      <span
                        className={`w-[6px] h-[6px] rounded-full ${
                          order.indicatorColor === "green"
                            ? "bg-[#37D101]"
                            : "bg-yellow-400"
                        }`}
                      />
                      {order.statusIndicator}
                    </div>
                  </div>
                </div>

                {/* DATE / TIME */}
                <div className="flex justify-between text-[16px] font-light">
                  <span>{order.date}</span>
                  <span>{order.time}</span>
                </div>

                <div className="border-t border-[#5E5E5E]" />

                {/* TABLE HEADER */}
                <div className="grid grid-cols-[40px_1fr_60px] text-white/60 text-[16px]">
                  <span>Qty</span>
                  <span>Items</span>
                  <span className="text-right">Price</span>
                </div>

                {/* ITEMS */}
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[40px_1fr_60px] text-[16px]"
                  >
                    <span>{item.qty}</span>
                    <span>{item.name}</span>
                    <span className="text-right">{item.price}</span>
                  </div>
                ))}

                <div className="border-t border-[#5E5E5E]" />

                {/* SUBTOTAL */}
                <div className="flex justify-between text-[16px] font-light">
                  <span>SubTotal</span>
                  <span>{order.subtotal}</span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-2">
                  <button
                    className="w-[79px] h-[64px] border border-[#FAC1D9] rounded-[10px] flex items-center justify-center"
                    onClick={() =>
                      navigate("/order/table", { state: { editOrder: order } })
                    }
                  >
                    <Pencil className="text-[#FAC1D9]" />
                  </button>

                  <button
                    className="w-[79px] h-[64px] border border-[#FAC1D9] rounded-[10px] flex items-center justify-center"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <Trash2 className="text-[#FAC1D9]" />
                  </button>

                  <button
                    onClick={() => navigate("/pin", { state: { order } })}
                    className="ml-auto w-[167px] h-[64px] bg-[#FAC1D9] rounded-[10px] text-[#333] font-medium text-[16px]"
                  >
                    Pay Bill
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPart;
