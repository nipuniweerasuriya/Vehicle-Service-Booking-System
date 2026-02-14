export default function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    red: "bg-red-50 border-red-200 text-red-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className={`card border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`p-3 rounded-lg bg-${color === "blue" ? "blue" : color === "green" ? "green" : color === "yellow" ? "yellow" : color === "red" ? "red" : "purple"}-100`}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
}
