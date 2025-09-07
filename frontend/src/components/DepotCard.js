import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function DepotCard({ tank }) {
    const getStatusColor = (status, percentage) => {
        if (status === 'normal' || percentage > 70) return '#10b981';
        if (status === 'medium' || percentage > 30) return '#f59e0b';
        return '#ef4444';
    };

    const getStatusText = (status, percentage) => {
        if (status === 'normal' || percentage > 70) return 'Stan dobry';
        if (status === 'medium' || percentage > 30) return 'Stan średni';
        return 'Stan niski';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{tank.name}</h3>
                    <p className="text-gray-600 text-sm">{tank.liquid}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${tank.status === 'low' ? 'bg-red-100 text-red-800' :
                    tank.status === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {getStatusText(tank.status, tank.fillPercentage)}
                </div>
            </div>

            <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="6"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke={getStatusColor(tank.status, tank.fillPercentage)}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 35}`}
                            strokeDashoffset={`${2 * Math.PI * 35 * (1 - tank.fillPercentage / 100)}`}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">{tank.fillPercentage}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Aktualny stan:</span>
                    <span className="font-semibold text-gray-800">{tank.currentLevel}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Pojemność:</span>
                    <span className="font-semibold text-gray-800">{tank.capacity}</span>
                </div>
            </div>
        </div>
    );
}

export default DepotCard;