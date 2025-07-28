import { stats } from "./Data/stats";

const StatsGrid = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {stats.map((stat, index) => (
      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
        <stat.icon className="w-6 h-6 text-rose-500 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default StatsGrid;
