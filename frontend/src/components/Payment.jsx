import React, { useRef, useState, useEffect } from "react";
import cash from "../assets/cash.svg";
import debitcard from "../assets/debitcard.svg";
import ewallet from "../assets/ewallet.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";

function currency(n) {
  return n.toFixed(2);
}

export default function PaymentLayout() {
  const [amount, setAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("E-Wallet");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  const items =
    order?.items?.map((i) => ({
      id: i.id,
      name: i.name,
      qty: Number(i.qty),
      price: Number(i.price.replace("₹", "")),
    })) || [];
  const subtotal = items.reduce((t, it) => t + it.qty * it.price, 0);
  const taxRate = 0.05;
  const tax = +(subtotal * taxRate).toFixed(2);
  const tip = Number(amount || 0);
  const total = +(subtotal + tax + tip).toFixed(2);
  const received = total;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDigit = (d) => {
    setAmount((prev) => {
      if ((prev + d).length > 6) return prev;
      if (prev === "0") return String(d);
      return prev + String(d);
    });
  };
  const handleComplete = () => {
    navigate("/order/table");
  };
  const handleBack = () => setAmount((prev) => prev.slice(0, -1));
  const handleClear = () => setAmount("");

  return (
    <div className="flex bg-[#121416] min-h-screen font-[Poppins]">
      {/* LEFTBAR */}

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-[171px] min-h-screen overflow-auto">
        <div className="w-full flex items-start justify-end sm:flex-row flex-col-reverse p-4 pt-24 lg:pt-4">
          {/* LEFT PANEL */}
          <div className="sm:w-[474px] w-full bg-[#292C2D] rounded-2xl text-white shadow-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 px-6 py-6">
              <div>
                <h3 className="text-[25px] font-semibold">Table 01</h3>
                <div className="text-[16px] text-gray-300">Watson Joyce</div>
              </div>

              <button className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-gray-300">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="p-3 px-6 overflow-y-auto max-h-[280px]">
              {items.map((it, index) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between bg-[#3D4142] rounded-lg p-3 mb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-[25px] rounded-full bg-[#FAC1D9] text-[#333] flex items-center justify-center text-sm font-medium">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="font-light">
                        {it.name}{" "}
                        <span className="text-sm text-[#777979]">
                          x {it.qty}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Order · {it.qty} x ${currency(it.price)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">${currency(it.qty * it.price)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 bg-[#3D4142] rounded-lg p-4 mx-6 mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <div>Subtotal</div>
                <div>${currency(subtotal)}</div>
              </div>

              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <div>Tax 5%</div>
                <div>${currency(tax)}</div>
              </div>

              <div className="flex justify-between mb-2">
                <div className="text-sm">Tip</div>
                <div className="text-sm font-light">${currency(tip)}</div>
              </div>

              <div className="border-t border-dashed border-gray-600 mt-2 pt-2 flex justify-between">
                <div className="text-sm">Total</div>
                <div className="text-sm font-light">${currency(total)}</div>
              </div>

              <div className="border-t border-dashed border-gray-600 mt-6 pt-4 flex justify-between text-sm text-gray-300">
                <div>Received</div>
                <div>${currency(received)}</div>
              </div>

              {/* Payment Methods */}
              <div className="text-sm text-gray-300 mb-2 mt-10">
                Payment Method
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <img src={cash} alt="" />

                <img src={debitcard} alt="" />

                <button
                  onClick={() => setSelectedPayment("E-Wallet")}
                  className={`flex-1 px-10 rounded-md border ${
                    selectedPayment === "E-Wallet"
                      ? "bg-[#FAC1D9] text-black"
                      : "bg-[#1f2122] border-[#3D4142]"
                  }`}
                >
                  <img src={ewallet} alt="" />
                </button>
              </div>

              {/* Labels */}
              <div className="hidden sm:flex gap-16 items-center px-10 py-2">
                <h1>Cash</h1>
                <h1>Debit Card</h1>
                <h1>Ewallet</h1>
              </div>

              {/* Order Completed */}
              <div className="mt-6">
                <button
                  onClick={handleComplete}
                  className="cursor-pointer w-full bg-[#FAC1D9] text-black py-3 rounded-xl font-semibold"
                >
                  Order Completed
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT  PANEL */}
          <div className="flex-1 bg-[#292C2D] rounded-2xl p-8 text-white flex flex-col items-center mt-4 sm:mt-0 sm:py-40">
            <h2 className="text-lg font-semibold mb-6">Tips Amount</h2>

            <input
              ref={inputRef}
              type="number"
              value={amount}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setAmount(v);
              }}
              className="opacity-0 absolute pointer-events-none"
            />

            <div className="text-[40px] font-semibold mb-6">
              {amount || 0}.00
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="h-[76px] w-24 bg-[#3D4142] rounded-xl text-xl hover:bg-[#4A4D4E]"
                >
                  {n}
                </button>
              ))}

              <div className="h-[76px] w-24"></div>

              <button
                onClick={() => handleDigit(0)}
                className="h-[76px] w-24 bg-[#3D4142] rounded-xl text-xl hover:bg-[#4A4D4E]"
              >
                0
              </button>

              <button
                onClick={handleBack}
                className="h-[76px] w-24 bg-[#3D4142] rounded-xl text-xl hover:bg-[#4A4D4E]"
              >
                X
              </button>
            </div>

            <div className="flex items-center gap-10 py-10">
              <button className="cursor-pointer text-sm underline text-[#d6d6d6]">
                Print Receipt
              </button>
              <button className="cursor-pointer bg-[#FAC1D9] px-8 py-3 rounded-xl text-black">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
