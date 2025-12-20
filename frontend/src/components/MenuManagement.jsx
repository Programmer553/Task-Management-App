import React, { useState, useRef, useEffect } from "react";
const API = "https://task-management-app-backend-m5rk.onrender.com/api";

import FoodImage from "../assets/food.svg";
import AllImage from "../assets/All.svg";
import PizzaImage from "../assets/pizza.svg";
import ChickenImage from "../assets/chicken.svg";
import BurgerImage from "../assets/burger.svg";
import SeaFoodImage from "../assets/seafood.svg";
import BakeryImage from "../assets/bakery.svg";
import BeveragesImage from "../assets/bevarage.svg";

const CATEGORY_ORDER = {
  All: 0,
  Pizza: 1,
  Burger: 2,
  Chicken: 3,
  Bakery: 4,
  Beverage: 5,
  Seafood: 6,
};

function IconEdit() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.66211 15.7736V17.8755C3.66211 17.9971 3.7104 18.1136 3.79635 18.1996C3.88231 18.2856 3.99889 18.3338 4.12044 18.3338H6.22694C6.34827 18.3338 6.46463 18.2857 6.55053 18.2L15.2112 9.53935L12.4612 6.78935L3.79686 15.45C3.71084 15.5358 3.66238 15.6521 3.66211 15.7736ZM13.596 5.6536L16.346 8.4036L17.6844 7.06526C17.8562 6.89336 17.9527 6.66025 17.9527 6.41718C17.9527 6.17411 17.8562 5.941 17.6844 5.7691L16.2314 4.31526C16.0595 4.14341 15.8264 4.04687 15.5834 4.04688C15.3403 4.04687 15.1072 4.14341 14.9353 4.31526L13.596 5.6536Z"
        fill="white"
      />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.98009 18.3308C6.55842 18.3308 6.20642 18.1897 5.92409 17.9073C5.64115 17.6244 5.49967 17.2721 5.49967 16.8504V5.4975H4.58301V4.58083H8.24967V3.875H13.7497V4.58083H17.4163V5.4975H16.4997V16.8504C16.4997 17.2721 16.3585 17.6241 16.0762 17.9064C15.7932 18.1894 15.4409 18.3308 15.0193 18.3308H6.98009ZM8.99034 15.5808H9.90701V7.33083H8.99034V15.5808ZM12.0923 15.5808H13.009V7.33083H12.0923V15.5808Z"
        fill="#E70000"
      />
    </svg>
  );
}

function AvatarPlaceholder({ size = 12 }) {
  const px = `${size * 4}px`;

  const iconSize = size * 2;

  return (
    <div
      style={{ width: px, height: px }}
      className="bg-[#2a3240] rounded-md flex items-center justify-center"
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect
          width="80"
          height="80"
          rx="5.20043"
          fill="url(#pattern0_2013_15430)"
        />
        <defs>
          <pattern
            id="pattern0_2013_15430"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlink:href="#image0_2013_15430"
              transform="translate(-0.25) scale(0.00150602)"
            />
          </pattern>
          <img
            src={FoodImage}
            alt="Product Placeholder"
            className="w-full h-full object-cover"
          />
        </defs>
      </svg>
    </div>
  );
}
function CategoryIcon({ type = "all", className = "w-6 h-6 object-contain" }) {
  const iconMap = {
    all: AllImage,
    pizza: PizzaImage,
    chicken: ChickenImage,
    burger: BurgerImage,
    seafood: SeaFoodImage,
    bakery: BakeryImage,
    beverage: BeveragesImage,
    beverages: BeveragesImage,
  };

  const iconSrc = iconMap[type?.toLowerCase()] || AllImage;

  return (
    <div className={className}>
      <img
        src={iconSrc}
        alt={type}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
const MENU_GRID =
  "grid-cols-[40px_56px_2.5fr_2fr_140px_120px_100px_140px_100px]";

export default function MenuManagement() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");

  const [activeTab, setActiveTab] = useState("normal");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => {
        // 🔹 create ALL category
        const totalCount = data.reduce(
          (sum, c) => sum + Number(c.count || 0),
          0
        );

        const allCategory = {
          id: "all",
          title: "All",
          count: totalCount,
          highlight: true,
        };

        const merged = [allCategory, ...data];

        const sorted = merged.sort((a, b) => {
          const aOrder = CATEGORY_ORDER[a.title] ?? 99;
          const bOrder = CATEGORY_ORDER[b.title] ?? 99;
          return aOrder - bOrder;
        });

        setCategories(sorted);
      });

    fetch(`${API}/menu-items`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("menu-items is not array:", data);
          setItems([]);
        }
      })
      .catch((err) => {
        console.error("menu-items fetch failed:", err);
        setItems([]);
      });
  }, []);

  function handleSaveCategory(payload) {
    fetch(`${API}/categories`, {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      fetch(`${API}/categories`)
        .then((res) => res.json())
        .then(setCategories);
    });

    setDrawerOpen(false);
    setEditing(null);
  }

  function handleSaveItem(payload) {
    fetch(`${API}/menu-items`, {
      method: payload.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      fetch(`${API}/menu-items`)
        .then((res) => res.json())
        .then(setItems);
    });

    setDrawerOpen(false);
    setEditing(null);
  }

  function openAddCategory() {
    setEditing({ type: "category", data: {} });
    setDrawerOpen(true);
  }
  function openAddItem() {
    setEditing({ type: "item", data: {} });
    setDrawerOpen(true);
  }

  function openEditCategory(cat) {
    setEditing({ type: "category", data: cat });
    setDrawerOpen(true);
  }
  function openEditItem(itm) {
    setEditing({ type: "item", data: itm });
    setDrawerOpen(true);
  }

  function handleDeleteItem(id) {
    if (!confirm("Delete this item?")) return;

    fetch(`${API}/menu-items/${id}`, { method: "DELETE" }).then(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter(
          (it) => it.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#0f0f10] text-gray-100 font-[Poppins]">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 gap-8">
          <div>
            <div>
              <h1>Categories</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={openAddCategory}
              className="px-4 sm:py-2 py-1 rounded-lg bg-[#FAC1D9] border font-semibold border-gray-700 text-black cursor-pointer"
            >
              Add New Category
            </button>
          </div>
        </div>

        <div className="mb-10">
          <div
            className="
  grid gap-3
 grid-cols-2
sm:grid-cols-3
md:grid-cols-4
lg:grid-cols-7
  w-full
"
          >
            {categories.map((c) => (
              <div
                key={c.title}
                onClick={() => setActiveCategory(c.title)}
                className={`"p-4 h-[104px] flex items-center" rounded-lg cursor-pointer transition-shadow
    ${
      activeCategory === c.title
        ? "bg-[#FAC1D9] text-[#111]"
        : "bg-[#292C2D] text-gray-100"
    }
          ${c.highlight ? "col-span-1 lg:col-span-1" : ""}`}
              >
                <div className="flex items-center justify-between gap-3 ">
                  <div>
                    <div className="font-semibold text-lg ml-5">{c.title}</div>
                    <div className="text-xs mt-1 ml-5">{c.count} items</div>
                  </div>
                  <div className="w-10 h-10 ml-[-12px] flex-shrink-0 rounded bg-[#2a3240] flex items-center justify-center overflow-hidden">
                    <CategoryIcon
                      type={c.title}
                      className={
                        activeCategory === c.id
                          ? "text-gray-900"
                          : "text-pink-300"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h1 className="font-bold text-lg mb-3">Special menu all items</h1>

        <div className="mb-6">
          <div className="hidden md:flex items-center justify-between gap-4 mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("normal")}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  activeTab === "normal"
                    ? "bg-[#FAC1D9] text-gray-900 font-semibold"
                    : "bg-transparent text-gray-300"
                }`}
              >
                Normal Menu
              </button>
              <button
                onClick={() => setActiveTab("deals")}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  activeTab === "deals"
                    ? "bg-[#FAC1D9] text-gray-900 font-semibold"
                    : "bg-transparent text-gray-300"
                }`}
              >
                Special Deals
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  activeTab === "new"
                    ? "bg-[#FAC1D9] text-gray-900 font-semibold"
                    : "bg-transparent text-gray-300"
                }`}
              >
                New Year Special
              </button>
              <button
                onClick={() => setActiveTab("dessert")}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  activeTab === "dessert"
                    ? "bg-[#FAC1D9] text-gray-900 font-semibold"
                    : "bg-transparent text-gray-300"
                }`}
              >
                Desserts & Drinks
              </button>
            </div>

            <div>
              <button
                onClick={openAddItem}
                className="px-4 py-2 rounded-lg bg-[#FAC1D9] text-gray-900 font-semibold cursor-pointer"
              >
                Add Menu Item
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setActiveTab("normal")}
                className={`w-full text-left px-3 py-3 rounded ${
                  activeTab === "normal"
                    ? "bg-[#FAC1D9] text-gray-900"
                    : "bg-[#292C2D] text-gray-100"
                }`}
              >
                Normal Menu
              </button>

              <button
                onClick={() => setActiveTab("deals")}
                className={`w-full text-left px-3 py-3 rounded ${
                  activeTab === "deals"
                    ? "bg-[#FAC1D9] text-gray-900"
                    : "bg-[#292C2D] text-gray-100"
                }`}
              >
                Special Deals
              </button>

              <button
                onClick={() => setActiveTab("new")}
                className={`w-full text-left px-3 py-3 rounded ${
                  activeTab === "new"
                    ? "bg-[#FAC1D9] text-gray-900"
                    : "bg-[#292C2D] text-gray-100"
                }`}
              >
                New Year Special
              </button>

              <button
                onClick={() => setActiveTab("dessert")}
                className={`w-full text-left px-3 py-3 rounded ${
                  activeTab === "dessert"
                    ? "bg-[#FAC1D9] text-gray-900"
                    : "bg-[#292C2D] text-gray-100"
                }`}
              >
                Desserts & Drinks
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={openAddItem}
                className="w-full max-w-xs px-4 py-3 rounded bg-[#FAC1D9] text-gray-900 font-medium"
              >
                + Add Menu Item
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block text-xs text-gray-400 px-4 py-2">
          <div className={`grid ${MENU_GRID} items-center`}>
            <div className="pl-1">
              <input
                type="checkbox"
                className="form-checkbox h-3 w-3 bg-gray-700 border-gray-500 rounded text-pink-300 focus:ring-pink-300 cursor-pointer"
              />
            </div>

            <div>Product</div>
            <div>Product Name</div>
            <div>Item ID</div>
            <div>Stock</div>
            <div>Category</div>
            <div>Price</div>
            <div>Availability</div>
            <div>Actions</div>
          </div>
        </div>

        <div className="space-y-3 mt-3">
          {filteredItems.map((it, idx) => (
            <div
              key={it.id}
              className={`${
                idx % 2 === 0 ? "bg-[#292C2D]" : "bg-[#3D4142]"
              } rounded-lg`}
            >
              <div className="lg:hidden w-full">
                <div className="lg:hidden bg-[#292C2D] rounded-lg p-4 space-y-2">
                  <div className="flex gap-3">
                    <img
                      src={FoodImage}
                      alt={it.product}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold">{it.product}</div>
                      <div className="text-xs text-gray-400">{it.desc}</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>{it.category}</span>
                    <span>{it.itemId}</span>
                    <span>{it.stock}</span>
                    <span>{it.availability}</span>
                    <span>{it.price}</span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <IconEdit />
                    <IconTrash />
                  </div>
                </div>
              </div>
              <div
                className={`
    hidden lg:grid ${MENU_GRID}
    gap-3
    px-4 py-4
  `}
              >
                <div className="flex justify-center md:justify-start">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 bg-gray-700 border-gray-500 rounded text-pink-300 focus:ring-pink-300 cursor-pointer"
                  />
                </div>

                <div className="md:flex md:items-center md:justify-start">
                  <div className="flex items-center justify-center">
                    <img
                      src={FoodImage}
                      alt={it.product}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                    />
                  </div>
                </div>

                <div className="md:px-2">
                  <div className="font-semibold text-gray-100">
                    {it.product}
                    <div className="text-xs text-gray-400 mt-1">{it.desc}</div>
                  </div>
                </div>

                <div className="text-sm text-gray-300">{it.itemId} </div>

                <div className="text-sm text-gray-300">{it.stock}</div>

                <div className="text-sm text-gray-300">{it.category}</div>

                <div className="text-sm text-gray-300">{it.price}</div>

                <div className="text-sm text-[#FAC1D9]">{it.availability}</div>

                <div className="flex items-center gap-2 justify-start lg:justify-center flex-wrap">
                  <button
                    onClick={() => openEditItem(it)}
                    className="p-2 rounded hover:bg-[#3b465a] cursor-pointer"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(it.id)}
                    className="p-2 rounded hover:bg-[#E70000]/30 cursor-pointer"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 cursor-pointer"
            onClick={() => {
              setDrawerOpen(false);
              setEditing(null);
            }}
          />
          <div className="w-full md:w-[420px] bg-[#1c1c1d] h-full shadow-xl overflow-auto border-l border-gray-800 z-50 p-6">
            <DrawerContent
              editing={editing}
              onCancel={() => {
                setDrawerOpen(false);
                setEditing(null);
              }}
              onSaveCategory={handleSaveCategory}
              onSaveItem={handleSaveItem}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DrawerContent({
  editing,
  onCancel,
  onSaveCategory,
  onSaveItem,
  categories,
}) {
  if (!editing) return null;
  if (editing.type === "category") {
    return (
      <CategoryForm
        initial={editing.data}
        onCancel={onCancel}
        onConfirm={onSaveCategory}
      />
    );
  } else {
    return (
      <ItemForm
        initial={editing.data}
        onCancel={onCancel}
        onConfirm={onSaveItem}
        categories={categories}
      />
    );
  }
}

function CategoryForm({ initial = {}, onCancel, onConfirm }) {
  const [icon, setIcon] = useState(initial.icon || "");
  const [title, setTitle] = useState(initial.title || "");
  const [menu, setMenu] = useState(initial.menu || "");
  const [description, setDescription] = useState(initial.description || "");
  const [count, setCount] = useState(initial.count ?? 0);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    setIcon(initial.icon || "");
    setTitle(initial.title || "");
    setMenu(initial.menu || "");
    setDescription(initial.description || "");
    setCount(initial.count ?? 0);
    setErrors({});
  }, [initial]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIcon(reader.result);
    reader.readAsDataURL(file);
  }

  function validate() {
    const err = {};
    if (!title.trim()) err.title = "Enter category name";
    return err;
  }

  function submit() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    const payload = {
      id: initial.id || undefined,
      title: title.trim(),
      count: Number(count || 0),
      icon,
      menu,
      description,
    };
    onConfirm(payload);
  }

  return (
    <div className="text-sm">
      <h3 className="text-lg font-semibold mb-4">
        {initial.id ? "Edit Category" : "Add New Category"}
      </h3>
      <hr className="border-gray-700 mb-4" />

      <div className="mb-6 w-1/2">
        <div className="bg-[#292C2D] rounded-lg p-4 h-32 flex items-center justify-center">
          {icon ? (
            <div className="w-1/2 h-1/2 flex items-center justify-center">
              <img
                src={icon}
                alt="icon"
                className="max-h-full max-w-1/2 object-contain rounded"
              />
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm">
              <svg width="40" height="20" fill="none" className="mx-auto mb-2">
                <path
                  d="M3 7h4l2-2h6l2 2h4v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"
                  stroke="#aaa"
                  strokeWidth="1.2"
                />
                <path d="M8 13l2 2 3-3 4 4" stroke="#aaa" strokeWidth="1.2" />
              </svg>
              Select icon here
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <label
            onClick={() => fileRef.current.click()}
            className="text-sm text-pink-300 cursor-pointer underline"
          >
            Change Icon
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </div>

      <div className="space-y-6">
        {" "}
        <div>
          <label className="text-sm text-gray-300">Category Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter category name"
            className="mt-1 w-full p-3 bg-[#292C2D] border border-gray-700 rounded text-gray-200"
          />
          {errors.title && (
            <div className="text-xs text-red-400 mt-1">{errors.title}</div>
          )}
        </div>
        <div>
          <label className="text-sm text-gray-300">Select Menu</label>
          <select
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            className="cursor-pointer mt-1 w-full p-3 bg-[#292C2D] border border-gray-700 rounded text-gray-200"
          >
            <option value="">Select menu</option>
            <option value="All">All</option>
            <option value="Pizza">Pizza</option>
            <option value="Burger">Burger</option>
            <option value="Chicken">Chicken</option>
            <option value="Bakery">Bakery</option>
            <option value="Beverage">Beverage</option>
            <option value="Seafood">Seafood</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="write your category description here"
            className="mt-1 w-full p-3 bg-[#292C2D] border border-gray-700 rounded text-gray-200"
          />
        </div>
        <div className="flex justify-end gap-4 pt-2">
          <label
            onClick={onCancel}
            className="px-4 py-2 underline cursor-pointer"
          >
            Cancel
          </label>

          <button
            onClick={submit}
            className="px-5 py-2 bg-pink-300 text-gray-900 rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
function ItemForm({ initial = {}, onCancel, onConfirm, categories = [] }) {
  const [form, setForm] = useState({
    id: initial.id || "",
    product: initial.product || "",
    desc: initial.desc || "",
    itemId: initial.itemId || "",
    stock: initial.stock || "",
    category: initial.category || (categories[0] ? categories[0].title : ""),
    price: initial.price || "",
    availability: initial.availability || "In Stock",
  });

  useEffect(() => {
    setForm({
      id: initial.id || "",
      product: initial.product || "",
      desc: initial.desc || "",
      itemId: initial.itemId || "",
      stock: initial.stock || "",
      category: initial.category || (categories[0] ? categories[0].title : ""),
      price: initial.price || "",
      availability: initial.availability || "In Stock",
    });
  }, [initial, categories]);

  function submit() {
    if (!form.product || form.product.trim().length < 1) {
      alert("Enter product name");
      return;
    }
    onConfirm(form);
  }

  return (
    <div className="text-sm">
      <h3 className="text-lg font-semibold mb-4">
        {form.id ? "Edit Item" : "Add Menu Item"}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400">Product Name</label>
          <input
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            className="mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
            placeholder="Name"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400">Description</label>
          <textarea
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
            rows={4}
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400">Item ID</label>
            <input
              value={form.itemId}
              onChange={(e) => setForm({ ...form, itemId: e.target.value })}
              className="mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
              placeholder="#id"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Stock</label>
            <input
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
              placeholder="119 items"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400">Price</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
              placeholder="$55.00"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400">Availability</label>
          <select
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            className="cursor-pointer mt-2 p-3 w-full rounded bg-[#292C2D] text-gray-200"
          >
            <option>In Stock</option>
            <option>Out of Stock</option>
            <option>Limited</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <label
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 underline"
          >
            Cancel
          </label>
          <button
            onClick={submit}
            className="cursor-pointer px-4 py-2 rounded bg-[#FAC1D9] text-gray-900"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
