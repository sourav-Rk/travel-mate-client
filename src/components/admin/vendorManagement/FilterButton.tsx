export const FilterButtons = ({ activeFilter, setActiveFilter, getStatusCount }: any) => (
  <div className="flex flex-wrap gap-2 lg:flex-1">
    {[
      { key: "all", label: "All", color: "bg-blue-600 hover:bg-blue-700" },
      { key: "pending", label: "Pending", color: "bg-amber-600 hover:bg-amber-700" },
      { key: "verified", label: "Verified", color: "bg-emerald-600 hover:bg-emerald-700" },
      { key: "reviewing", label: "Reviewing", color: "bg-blue-600 hover:bg-blue-700" },
      { key: "rejected", label: "Rejected", color: "bg-red-600 hover:bg-red-700" }
    ].map(({ key, label, color }) => (
      <button
        key={key}
        onClick={() => setActiveFilter(key)}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          activeFilter === key 
            ? `${color} text-white` 
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {label} ({getStatusCount(key)})
      </button>
    ))}
  </div>
);
