import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";

export default function AddInventoryModal({
  categories,
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "All",
    quantity: "",
    stock: "instock",
    status: "Active",
    price: "",
    image: null,
    perishable: false,
  });

  useEffect(() => {
    if (isOpen && productToEdit) {
      setForm({
        id: productToEdit.id ?? null,
        name: productToEdit.name ?? "",
        category: productToEdit.category ?? "All",
        quantity: productToEdit.quantity ?? "",
        stock: productToEdit.stock ?? "instock",
        status: productToEdit.status ?? "Active",
        price: productToEdit.price ?? "",
        image: productToEdit.image ?? null,
        perishable: !!productToEdit.perishable,
      });
    } else if (isOpen && !productToEdit) {
      setForm({
        id: null,
        name: "",
        category: "All",
        quantity: "",
        stock: "instock",
        status: "Active",
        price: "",
        image: null,
        perishable: false,
      });
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const handleChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave({ ...form, price: form.price ? Number(form.price) : 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div className="flex-1 bg-black/50" onClick={onClose}></div>

      {/* right panel */}
      <div
        className="w-full sm:w-[500px] h-full bg-[#2F3334] text-white 
                      rounded-l-3xl p-6 sm:p-10 overflow-y-auto"
      >
        {/* header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            {form.id ? "Edit Inventory" : "Add New Inventory"}
          </h2>
          <button onClick={onClose}>
            <X
              size={22}
              className="cursor-pointer text-gray-300 hover:text-white"
            />
          </button>
        </div>

        <hr className="border-gray-600 mb-6" />

        <form onSubmit={handleSubmit}>
          {/* IMAGE */}
          <div className="flex flex-col items-start mb-6">
            <div
              className="w-44 h-44 bg-[#3A3E3F] rounded-xl border border-gray-600/40 
                            flex items-center justify-center overflow-hidden"
            >
              {form.image ? (
                <img src={form.image} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={48} className="text-gray-400" />
              )}
            </div>

            <label className="mt-3 text-[#FAC1D9] underline text-sm cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden curosr-pointer"
              />
              Upload Image
            </label>
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-6">
            {/* NAME + CATEGORY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1">Name</p>
                <input
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full bg-[#3A3E3F] p-3 rounded-lg"
                  placeholder="Enter inventory name"
                />
              </div>

              <div>
                <p className="text-sm mb-1 ">Category</p>
                <select
                  value={form.category}
                  onChange={handleChange("category")}
                  className="cursor-pointer w-full bg-[#3A3E3F] p-3 rounded-lg"
                >
                  <option>All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUANTITY + STOCK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1">Quantity</p>
                <input
                  value={form.quantity}
                  onChange={handleChange("quantity")}
                  className="w-full bg-[#3A3E3F] p-3 rounded-lg"
                  placeholder="01"
                />
              </div>

              <div>
                <p className="text-sm mb-1">Stock</p>
                <select
                  value={form.stock}
                  onChange={handleChange("stock")}
                  className="cursor-pointer w-full bg-[#3A3E3F] p-3 rounded-lg"
                >
                  <option>instock</option>
                  <option>outstock</option>
                </select>
              </div>
            </div>

            {/* STATUS */}
            <div>
              <p className="text-sm mb-1">Status</p>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="cursor-pointer w-full bg-[#3A3E3F] p-3 rounded-lg"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Draft</option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <p className="text-sm mb-1">Price</p>
              <input
                value={form.price}
                onChange={handleChange("price")}
                className="w-full bg-[#3A3E3F] p-3 rounded-lg"
                placeholder="Enter price"
              />
            </div>

            {/* PERISHABLE */}
            <div>
              <p className="text-sm mb-1">Perishable</p>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    className="cursor-pointer"
                    type="radio"
                    name="perish"
                    checked={form.perishable === true}
                    onChange={() =>
                      setForm((s) => ({ ...s, perishable: true }))
                    }
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="cursor-pointer"
                    type="radio"
                    name="perish"
                    checked={form.perishable === false}
                    onChange={() =>
                      setForm((s) => ({ ...s, perishable: false }))
                    }
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center mt-10">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-300 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="cursor-pointer bg-[#FAC1D9] text-black font-semibold px-8 py-2 rounded-lg hover:bg-[#f7b4d0] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
