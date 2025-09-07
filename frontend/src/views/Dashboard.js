import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import DepotCard from '../components/DepotCard';
import axios from "axios";

const Dashboard = () => {
    const [depots, setDepots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        axios.get("http://localhost:8080/api/depot/list")
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [response.data];

                const mappedData = data.map(tank => {
                    const fillPercentage = Math.round((tank.currentStatus / tank.capacity) * 100);
                    let status = "low";
                    if (fillPercentage > 30) status = "medium";
                    if (fillPercentage > 70) status = "normal";

                    return {
                        id: tank.id,
                        name: tank.name,
                        liquid: tank.gasType?.type || "unknown",
                        fillPercentage,
                        capacity: `${tank.capacity.toLocaleString()} kg`,
                        currentLevel: `${tank.currentStatus.toLocaleString()} kg`,
                        status
                    };
                });
                mappedData.sort((a, b) => a.id - b.id);
                setDepots(mappedData);
                console.log(mappedData);
            })
            .catch(err => {
                console.error("Błąd pobierania danych:", err);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Stats */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2"> Przegląd stanów magazynowych gazu LPG </h2>
                    <p className="text-gray-600">Podgląd na monitorowanie stanów magazynowych gazu w zbiornikach i magazynach do dystrybucji.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-2xl font-bold text-blue-600">{depots.length}</div>
                        <div className="text-sm text-gray-600">Wszystkie zbiorniki</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {depots.filter(tank => tank.status === 'normal').length}
                        </div>
                        <div className="text-sm text-gray-600">Stan dobry</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-2xl font-bold text-yellow-600">
                            {depots.filter(tank => tank.status === 'medium').length}
                        </div>
                        <div className="text-sm text-gray-600">Stan średni</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-2xl font-bold text-red-600">
                            {depots.filter(tank => tank.status === 'low').length}
                        </div>
                        <div className="text-sm text-gray-600">Stan niski</div>
                    </div>
                </div>

                {/* Tank Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {depots.map((depot) => (
                        <DepotCard key={depot.id} tank={depot} />
                    ))}
                </div>

                {/* Additional Info Section */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Informacje systemowe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Status systemu:</span>
                            <span className="ml-2 text-green-600 font-semibold">Aktywny</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Ostatnia weryfikacja danych:</span>
                            <span className="ml-2 text-gray-800 font-semibold">2 dni</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Następne podsumowanie do ewidencji:</span>
                            <span className="ml-2 text-gray-800 font-semibold">5 dni</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;


// temp data to test tankCard
// const tankData = [
//     {
//         id: 'tank-1',
//         name: 'Tank A',
//         liquid: 'Propane',
//         fillPercentage: 78,
//         capacity: '10,000L',
//         currentLevel: '7,800L',
//         status: 'normal'
//     },
//     {
//         id: 'tank-2',
//         name: 'Tank B',
//         liquid: 'Butane',
//         fillPercentage: 45,
//         capacity: '15,000L',
//         currentLevel: '6,750L',
//         status: 'normal'
//     },
//     {
//         id: 'tank-3',
//         name: 'Tank C',
//         liquid: 'Natural Gas',
//         fillPercentage: 92,
//         capacity: '8,500L',
//         currentLevel: '7,820L',
//         status: 'high'
//     },
//     {
//         id: 'tank-4',
//         name: 'Tank D',
//         liquid: 'Methane',
//         fillPercentage: 23,
//         capacity: '12,000L',
//         currentLevel: '2,760L',
//         status: 'low'
//     }
// ];