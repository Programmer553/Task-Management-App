import { useEffect, useState } from "react";

import sales from "../assets/sales.svg";
import revenue from "../assets/revenue.svg";
import occupacy from "../assets/occupacy.svg";
import food from "../assets/food.svg";
import Chart from "./Chart.jsx";
import { useNavigate } from "react-router-dom";

import { getDashboardItems } from "../apis/auth.js";

const MainContent = () => {
  const slideBars = [
    {
      title: "Daily Sales",
      logo: sales,
      price: "$2k",
      date: "9 Feburary 2024",
      barHeights: [4, 8, 7, 6, 4, 5, 7, 8],
      bgColor: "#50CD89",
    },
    {
      title: "Monthly Revenue",
      logo: revenue,
      price: "$55k",
      date: "1 Jan - 1 Feb",
      barHeights: [8, 7, 6, 8, 7, 6, 8, 7],
      bgColor: "#C2E9DD",
    },
    {
      title: "Table Occupacy",
      logo: occupacy,
      price: "25 Tablets",
      date: "",
      barHeights: [4, 8, 7, 6, 4, 5, 7, 8],
      bgColor: "#50CD89",
    },
  ];

  const [popularDishes, setPopularDishes] = useState([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardItems();
        setPopularDishes(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboard();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="bg-black w-full min-h-screen px-6 pt-4 overflow-x-hidden">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex gap-6 mb-6 cursor-pointer">
          {slideBars.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 h-36 flex flex-col justify-center bg-[#292C2D] font-[Poppins] rounded-2xl cursor-pointer"
            >
              <div className="flex justify-between pt-4 px-4">
                <h1 className="font-light text-white">{item.title}</h1>
                <img src={item.logo} alt="" className="h-9 w-9" />
              </div>

              <div className="px-4">
                <h1 className="text-[25px] text-white">{item.price}</h1>
              </div>

              <div className="flex items-end justify-between px-4 pb-4">
                <h1 className="text-[#777979] text-sm">{item.date}</h1>

                <div className="flex items-end gap-2 h-10">
                  {item.barHeights.map((barH, bidx) => (
                    <div
                      key={bidx}
                      style={{
                        width: 4,
                        height: `${barH * 6}px`,
                        background: item.bgColor,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex font-[Poppins] my-10 gap-6 sm:flex-row flex-col">
          <div className="flex bg-[#292C2D] flex-col px-6 py-6 w-full md:w-1/2 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-[20px] text-white font-semibold">
                Popular Dishes
              </h1>
              <button
                onClick={() => {
                  navigate("/order/table");
                }}
                className="text-[#FAC1D9] cursor-pointer underline"
              >
                See All
              </button>
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100">
              {popularDishes.map((dish, idx) => (
                <div
                  className="flex py-4 bg-[#3D4142] my-2 rounded-2xl items-center"
                  key={idx}
                >
                  <img
                    src={dish.icon || food}
                    alt=""
                    className="h-[66px] w-[66px] object-cover rounded-md ml-3"
                  />

                  <div className="px-4 w-full">
                    <div className="flex justify-between items-start">
                      <h1 className="text-white">{dish.name}</h1>

                      <h1
                        className={`text-sm ${
                          dish.stock === 0 ? "text-red-400" : "text-[#FAC1D9]"
                        }`}
                      >
                        {dish.stock === 0 ? "Out of Stock" : "In Stock"}
                      </h1>
                    </div>

                    <div className="flex justify-between">
                      <h1 className="text-[#777979] text-sm">
                        Serving : 1 Person
                      </h1>
                      <h1 className="text-white">${dish.price}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex bg-[#292C2D] flex-col px-6 py-6 w-full md:w-1/2 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-[20px] text-white font-semibold">
                Popular Dishes
              </h1>
              <button
                onClick={() => {
                  navigate("/order/table");
                }}
                className="text-[#FAC1D9] cursor-pointer underline"
              >
                See All
              </button>
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100">
              {popularDishes.map((dish, idx) => (
                <div
                  className="flex py-4 bg-[#3D4142] my-2 rounded-2xl items-center"
                  key={idx}
                >
                  <img
                    src={food}
                    alt=""
                    className="cursor-pointer h-[66px] w-[66px] object-cover rounded-md ml-3"
                  />
                  <div className="px-4 w-full">
                    <div className="flex justify-between items-start">
                      <h1 className="text-white">{dish.name}</h1>
                      <h1
                        className={`text-sm ${
                          dish.stock === "Out of Stock"
                            ? "text-red-400"
                            : "text-[#FAC1D9]"
                        }`}
                      >
                        {dish.stock}
                      </h1>
                    </div>
                    <div className="flex justify-between">
                      <h1 className="text-[#777979] text-sm">
                        Order : x 1 $55.00
                      </h1>
                      <h1 className="text-white">{dish.price}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
