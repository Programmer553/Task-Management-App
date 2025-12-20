import { useEffect, useState } from "react";
import InventoryFilters from "../components/InventoryFilters";
import InventoryTable from "../components/InventoryTable";
import AddInventoryModal from "../components/AddInventoryModal";
import ChickenImg from "../assets/Rectangle.png";

const API = "http://localhost:5000/inventory";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("InStock");
  const [filterValue, setFilterValue] = useState("Litre");
  const [filterQuantity, setFilterQuantity] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // FETCH INVENTORY
  const fetchInventory = async () => {
    const res = await fetch(API);
    const data = await res.json();

    const formatted = data.map((item) => ({
      ...item,
      image: item.image || ChickenImg,
      stock: `${item.quantity} In Stock`,
      quantity: String(item.quantity),
    }));

    setProducts(formatted);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const resetAllFilters = () => {
    setFilterStatus("All");
    setFilterCategory("All");
    setFilterStock("InStock");
    setFilterValue("Litre");
    setFilterQuantity("");
    setPriceMin("");
    setPriceMax("");
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchInventory();
  };

  // EDIT
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // ADD
  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // SAVE (ADD / UPDATE)
  const handleSave = async (product) => {
    const payload = {
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: Number(product.quantity),
      status: product.status,
      perishable: product.perishable,
      image: product.image,
    };

    if (product.id) {
      await fetch(`${API}/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    fetchInventory();
  };

  const counts = {
    All: products.length,
    Active: products.filter((p) => p.status === "Active").length,
    Inactive: products.filter((p) => p.status === "Inactive").length,
    Draft: products.filter((p) => p.status === "Draft").length,
  };

  const filteredProducts = products.filter((item) => {
    if (filterStatus !== "All" && item.status !== filterStatus) return false;
    if (filterCategory !== "All" && item.category !== filterCategory)
      return false;
    if (priceMin && item.price < Number(priceMin)) return false;
    if (priceMax && item.price > Number(priceMax)) return false;
    return true;
  });

  return (
    <div className="w-full min-h-screen text-white px-4 sm:px-6 lg:px-10 pb-10 pt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-lg font-semibold text-gray-300 px-3">
          {counts.All} total products
        </h1>

        <button
          onClick={handleAdd}
          className="bg-[#FAC1D9] text-black font-semibold px-5 py-2 rounded-lg hover:bg-[#f7b4d0] transition w-full sm:w-auto cursor-pointer"
        >
          Add New Inventory
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="w-full lg:w-[350px]">
          <InventoryFilters
            categories={categories}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStock={filterStock}
            setFilterStock={setFilterStock}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterQuantity={filterQuantity}
            setFilterQuantity={setFilterQuantity}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            resetAllFilters={resetAllFilters}
            isModalOpen={isModalOpen}
            counts={counts}
          />
        </div>

        <div className="flex-1">
          <InventoryTable
            items={filteredProducts}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        productToEdit={editingProduct}
        categories={categories.filter((c) => c !== "All")}
      />
    </div>
  );
}
