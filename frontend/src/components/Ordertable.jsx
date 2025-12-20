// Orders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import pizza from "../assets/pizza.svg";
import burger from "../assets/burger.svg";
import chicken from "../assets/chicken.svg";
import bakery from "../assets/bakery.svg";
import beverage from "../assets/bevarage.svg";
import seafood from "../assets/seafood.svg";
import { getUserFromToken } from "../apis/auth.js";

import scanner from "../assets/scanner.jpg";

const Orders = () => {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedTable] = useState({ number: "01", customer: "Watson Joyce" });

  const iconMap = {
    "pizza.svg": pizza,
    "burger.svg": burger,
    "chicken.svg": chicken,
    "bakery.svg": bakery,
    "beverage.svg": beverage,
    "seafood.svg": seafood,
  };

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    axios
      .get("https://task-management-app-backend-m5rk.onrender.com/categories")
      .then((res) => {
        setCategories(res.data);

        const chickenCategory = res.data.find(
          (cat) => cat.title.toLowerCase() === "chicken"
        );

        if (chickenCategory) {
          setSelectedCategory(chickenCategory.id);

          // fetch chicken menu items by default
          axios
            .get(`https://task-management-app-backend-m5rk.onrender.com/menu-items/${chickenCategory.id}`)
            .then((menuRes) => setMenuItems(menuRes.data))
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, []);

  /* =========================
     FETCH MENU BY CATEGORY
  ========================= */
  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);

    axios
      .get(`https://task-management-app-backend-m5rk.onrender.com/menu-items/${category.id}`)
      .then((res) => setMenuItems(res.data))
      .catch(console.error);
  };

  /* =========================
     CART LOGIC
  ========================= */
  const addToCart = (item) => {
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  /* =========================
     SEND TO KITCHEN
  ========================= */
  const sendToKitchen = async () => {
    if (cart.length === 0) return;

    const user = getUserFromToken();

    const orderPayload = {
      customerId: user.id,
      customerName: selectedTable.customer,
      tableNumber: selectedTable.number,
      items: cart.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      tax,
      total,
      status: "In Process",
    };

    try {
      await axios.post("https://task-management-app-backend-m5rk.onrender.com/orders", orderPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCart([]);
      navigate("/orderspart");
    } catch (err) {
      console.error("Order failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-[Poppins]">
      <div className="flex flex-col lg:flex-row">
        {/* ================= LEFT SECTION ================= */}
        <div className="w-full lg:w-[68%] p-6">
          {/* CATEGORIES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`relative rounded-xl cursor-pointer p-4 border-2 h-[150px]
                ${
                  selectedCategory === category.id
                    ? "border-[#2196F3]"
                    : "border-transparent"
                } bg-[#1a1a1a]`}
              >
                <img
                  src={iconMap[category.icon]}
                  alt={category.title}
                  className="absolute top-4 right-4 w-10 h-10 opacity-80"
                />

                <h3 className="text-lg font-semibold">{category.title}</h3>
                <p className="text-sm text-gray-400">
                  {category.items_count} items
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 my-8"></div>

          {/* MENU ITEMS (TEMPLATE STYLE) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => {
              const cartItem = cart.find((i) => i.id === item.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={item.id}
                  className="bg-[#1f2122] rounded-xl p-4 h-[150px] flex flex-col justify-between"
                >
                  {/* TOP */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Order → Kitchen
                    </p>

                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-pink-300 font-semibold text-sm mt-1">
                      ${item.price}
                    </p>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      Table {selectedTable.number}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={quantity === 0}
                        className="w-6 h-6 bg-[#2a2d2e] text-white rounded-full text-sm"
                      >
                        –
                      </button>

                      <span className="text-sm">
                        {String(quantity).padStart(2, "0")}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 bg-pink-300 text-black rounded-full text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        {/* ================= RIGHT PANEL ================= */}
        <div className="w-full lg:w-[32%] p-6">
          <div className="bg-[#292C2D] rounded-2xl p-6 h-full flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Table {selectedTable.number}
                </h2>
                <p className="text-sm text-gray-300">
                  {selectedTable.customer}
                </p>
              </div>

              <button className="text-gray-300 hover:text-white rotate-90">
                ✎
              </button>
            </div>

            {/* ORDER ITEMS */}
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#4a4e4f] rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* NUMBER BADGE */}
                    <span className="w-7 h-7 rounded-full bg-pink-300 text-black text-xs flex items-center justify-center font-medium">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* NAME */}
                    <p className="text-sm">
                      {item.name}{" "}
                      <span className="text-gray-300 text-xs">
                        × {item.quantity}
                      </span>
                    </p>
                  </div>

                  {/* PRICE */}
                  <p className="text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div className="mt-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Tax 5%</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-gray-500 my-3"></div>

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="mt-auto">
              <p className="text-center text-sm text-gray-300 mb-3">
                Payment Method
              </p>

              <div className="flex justify-center">
                <div className="bg-[#4a4e4f] p-4 rounded-xl">
                  <img src={scanner} className="w-24" />
                </div>
              </div>

              <p className="text-center text-xs text-gray-300 mt-2">
                Scan QR Code
              </p>

              <button
                onClick={sendToKitchen}
                disabled={cart.length === 0}
                className={`w-full mt-6 py-3 rounded-xl font-medium
    ${
      cart.length === 0
        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
        : "bg-pink-300 text-black"
    }`}
              >
                Send To Kitchen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
