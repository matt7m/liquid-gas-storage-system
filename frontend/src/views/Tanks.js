import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import axios from "axios";

const data = [
    { id: 1, name: "Item A", value: 1 },
    { id: 2, name: "Item B", value: 2 },
    { id: 3, name: "Item C", value: 2 },
];

function Tanks() {
    const [tanks, setTanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        axios.get("http://localhost:8080/api/depot/gas_tanks")
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [response.data];
                const mappedData = data.map(tank => {
                    return {
                        id: tank.id,
                        license: tank.licenseNumber,
                        capacity: tank.capacity,
                        status: Math.floor(Math.random() * 2) + 1
                    };
                });
                console.log(mappedData)
                setTanks(mappedData);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
                console.error("Błąd pobierania danych:", err);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Flota autocystern</h2>
                    <p className="text-gray-600">System podglądu autocystern do załadunków i rozładunków gazu LPG</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-blue-600">-</div>
                        <div className="text-sm text-gray-600">Cysterny</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-green-600">
                            -
                        </div>
                        <div className="text-sm text-gray-600">Auta dostępne</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-purple-600">
                            -
                        </div>
                        <div className="text-sm text-gray-600">Auta w trasie</div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Lista cystern</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Cysterna
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Pojemność
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading === false ? (
                                    <div className="bg-red-200 p-2"> Brak danych / połączenie z serwerem nieaktywne </div>
                                ) : (
                                    tanks.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    #{item.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.license}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.capacity} L
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200">
                                                    Podgląd
                                                </button>
                                                {item.status === 1 ? (
                                                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200">
                                                        W trasie
                                                    </button>
                                                ) : (
                                                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200">
                                                        Dostępny
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tanks;