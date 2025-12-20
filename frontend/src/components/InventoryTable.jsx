import { Pencil, Trash2 } from "lucide-react";

export default function InventoryTable({ items, onDelete, onEdit }) {
  return (
    <div className="w-full flex flex-col overflow-hidden rounded-xl">
      {items.map((item, index) => {
        const bgColor = index % 2 === 0 ? "bg-[#292C2D]" : "bg-[#2F3334]";

        return (
          <div
            key={item.id}
            className={`${bgColor} px-4 sm:px-6 py-4 
              flex flex-col sm:flex-row 
              sm:items-center sm:justify-between 
              gap-4 sm:gap-0`}
          >
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex flex-col leading-tight">
                <h3 className="text-[17px] font-semibold text-white">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  Stocked Product :
                  <span className="text-pink-300 ml-1">{item.stock}</span>
                </p>
              </div>
            </div>

            <div className="flex sm:flex-row flex-col gap-6 sm:gap-16">
              <div>
                <p className="text-sm text-gray-300">Status</p>
                <p className="text-xs text-white">{item.status}</p>
              </div>

              <div>
                <p className="text-sm text-gray-300">Category</p>
                <p className="text-xs text-white">{item.category}</p>
              </div>

              <div className="hidden sm:block border-l border-gray-600 h-10"></div>

              <div>
                <p className="text-sm text-gray-300">Retail Price</p>
                <p className="text-xs text-white">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <button
                onClick={() => onEdit(item)}
                className="p-2 hover:bg-white/10 rounded-md cursor-pointer"
              >
                <Pencil size={18} className="text-pink-300" />
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="p-2 hover:bg-red-500/30 rounded-md cursor-pointer"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
