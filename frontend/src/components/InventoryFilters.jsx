export default function InventoryFilters({
  categories,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterStock,
  setFilterStock,
  filterValue,
  setFilterValue,
  filterQuantity,
  setFilterQuantity,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  resetAllFilters,
  isModalOpen,
  counts,
}) {
  const statuses = [
    { name: "All", count: counts.All },
    { name: "Active", count: counts.Active },
    { name: "Inactive", count: counts.Inactive },
    { name: "Draft", count: counts.Draft },
  ];

  return (
    <div className="bg-[#292C2D] p-6 rounded-2xl w-full lg:w-[350px] space-y-6">
      <div>
        <h2 className="text-white mb-3 font-semibold text-sm">
          Product Status
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {statuses.map((item) => (
            <button
              key={item.name}
              onClick={() => setFilterStatus(item.name)}
              className={`px-4 py-2 rounded-lg flex justify-between cursor-pointer
                ${
                  filterStatus === item.name
                    ? "bg-[#2F3334] border border-pink-300 text-white font-semibold"
                    : "bg-[#2F3334] text-white border border-transparent"
                }`}
            >
              <span>{item.name}</span>
              <span>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm">Category</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="cursor-pointer w-full bg-[#2F3334] text-white p-3 rounded-lg mt-1 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-gray-300 text-sm">Stock</label>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className=" cursor-pointer w-full bg-[#2F3334] text-white p-3 rounded-lg mt-1 outline-none"
        >
          <option>InStock</option>
          <option>OutStock</option>
        </select>
      </div>

      {!isModalOpen && (
        <>
          <div>
            <label className="text-gray-300 text-sm">Value</label>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="cursor-pointer w-full bg-[#2F3334] text-white p-3 rounded-lg mt-1 outline-none"
            >
              <option>Kg</option>
              <option>Litre</option>
              <option>Piece</option>
            </select>
          </div>

          <div>
            <label className="text-gray-300 text-sm">
              Piece / Item / Quantity
            </label>
            <input
              value={filterQuantity}
              onChange={(e) => setFilterQuantity(e.target.value)}
              className="w-full bg-[#2F3334] text-white p-3 rounded-lg mt-1 outline-none"
              placeholder="50"
            />
          </div>
        </>
      )}
      <div>
        <label className="text-gray-300 text-sm">Price</label>

        <div className="relative mt-1">
          <input
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full bg-[#2F3334] text-white p-3 pr-8 rounded-lg outline-none"
            placeholder="Min"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            $
          </span>
        </div>

        <div className="relative mt-3">
          <input
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full bg-[#2F3334] text-white p-3 pr-8 rounded-lg outline-none"
            placeholder="Max"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            $
          </span>
        </div>
      </div>

      <button
        onClick={resetAllFilters}
        className="w-full bg-pink-300 text-black py-3 rounded-lg font-semibold cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}
