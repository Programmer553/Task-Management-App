import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PinPage = () => {
  const { state } = useLocation();
  const [pin, setPin] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const order = state?.order;
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDigit = (d) => {
    setPin((p) => {
      if (p.length === 3) {
        navigate("/payment", { state: { order } });
      }
      return p + String(d);
    });
    inputRef.current?.focus();
  };

  const handleBack = () => {
    setPin((p) => p.slice(0, -1));
    inputRef.current?.focus();
  };

  useEffect(() => {
    function onKey(e) {
      if (/^[0-9]$/.test(e.key)) handleDigit(e.key);
      else if (e.key === "Backspace") handleBack();
      else if (e.key === "Enter") console.log("Submit PIN:", pin);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pin]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
  };

  return (
    <div className="bg-[#292C2D] min-h-screen flex justify-center items-center text-white p-6 md:p-0">
      <div className="w-full max-w-[640px] bg-[#292C2D] rounded-2xl flex flex-col items-center py-20 md:py-0">
        <h1 className="font-[Poppins] text-[20px] mb-10 md:mt-60">
          Enter your PIN
        </h1>

        <div className="flex flex-col items-center gap-4 m-10">
          <input
            ref={inputRef}
            value={pin}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
            className="opacity-0 absolute pointer-events-none"
            autoFocus
          />

          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pin.length > i ? "bg-white" : "bg-gray-500"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center my-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-[70px] w-[70px] sm:h-[76px] sm:w-[80px] bg-[#3D4142] rounded-xl flex items-center justify-center text-lg font-medium hover:bg-[#4a4d4e] active:scale-95"
                aria-label={`Digit ${num}`}
              >
                {num}
              </button>
            ))}

            <div />

            <button
              type="button"
              onClick={() => handleDigit(0)}
              className="h-[70px] w-[70px] sm:h-[76px] sm:w-[80px] bg-[#3D4142] rounded-xl flex items-center justify-center text-lg font-medium hover:bg-[#4a4d4e] active:scale-95"
              aria-label="Digit 0"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="h-[70px] w-[70px] sm:h-[76px] sm:w-[80px] bg-[#3D4142] rounded-xl flex items-center justify-center text-lg font-medium hover:bg-[#4a4d4e] active:scale-95"
              aria-label="Backspace"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPage;
