import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import axios from "axios";

function DataList() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // search filter
    const [dateFilter, setDateFilter] = useState("");       // "YYYY-MM-DD"
    const [documentFilter, setDocumentFilter] = useState(""); // np. "25PL000120"
    const [operationFilter, setOperationFilter] = useState("");

    // start data init from backend
    const fetchAll = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get("http://localhost:8080/api/managements/docs/list");
            const data = Array.isArray(res.data) ? res.data : [res.data];

            const mapped = data.map(d => ({
                id: d.id,
                documentNumber: d.documentNumber,
                date: new Date(d.date).toLocaleDateString("pl-PL"),
                operation: d.operation,
                gasTank: d.gasTank?.licenseNumber || "unknown",
                gasDepot: d.gasDepot?.name || "unknown",
                gasAmount: d.gasAmount,
                description: d.description,
            }));

            setDocs(mapped);
        } catch (e) {
            console.error(e);
            setError(e.message || "Błąd pobierania");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // search button action
    const searchByArcode = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get("http://localhost:8080/api/managements/arc", { params: { arc: documentFilter } });
            const mapped = [{
                id: response.data.id,
                documentNumber: response.data.documentNumber,
                date: new Date(response.data.date).toLocaleDateString("pl-PL"),
                operation: response.data.operation,
                gasTank: response.data.gasTank?.licenseNumber || "unknown",
                gasDepot: response.data.gasDepot?.name || "unknown",
                gasAmount: response.data.gasAmount,
                description: response.data.description,
            }];

            setDocs(mapped);
        } catch (e) {
            console.error(e);
            setError(e?.response?.data || e.message || "Błąd filtrowania");
        } finally {
            setLoading(false);
        }

    };

    const searchByDate = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const res = await axios.get("http://localhost:8080/api/managements/date", {
                params: { date: dateFilter }
            });

            const data = Array.isArray(res.data) ? res.data : [res.data];
            const mapped = data.map(d => ({
                id: d.id,
                documentNumber: d.documentNumber,
                date: new Date(d.date).toLocaleDateString("pl-PL"),
                operation: d.operation,
                gasTank: d.gasTank?.licenseNumber || "unknown",
                gasDepot: d.gasDepot?.name || "unknown",
                gasAmount: d.gasAmount,
                description: d.description,
            }));

            setDocs(mapped);
        } catch (e) {
            console.error(e);
            setError(e?.response?.data || e.message || "Błąd filtrowania");
        } finally {
            setLoading(false);
        }

    };

    // data filter
    const handleClearFilters = () => {
        setDateFilter("");
        setDocumentFilter("");
        setOperationFilter("");
        fetchAll();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Operacje magazynowe</h2>
                    <p className="text-gray-600">Lista dokumentów operacji wydań i przyjęć magazynowych</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-green-600">17</div>
                        <div className="text-sm text-gray-600">Importy razem</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-orange-600">
                            9
                        </div>
                        <div className="text-sm text-gray-600">Exporty razem</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                        <div className="text-2xl font-bold text-purple-600">
                            -
                        </div>
                        <div className="text-sm text-gray-600">Liczba operacji</div>
                    </div>
                </div>

                {/* Search Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtry wyszukiwania</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Wyszukaj po dacie
                            </label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Numer dokumentu
                            </label>
                            <input
                                type="text"
                                value={documentFilter}
                                onChange={(e) => setDocumentFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Wprowadź numer dokumentu"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Operacja
                            </label>
                            <select
                                value={operationFilter}
                                onChange={(e) => setOperationFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">Wszystkie operacje</option>
                                <option value="Przyjęcie">Przyjęcie</option>
                                <option value="Wydanie">Wydanie</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex space-x-4">
                            <button
                                onClick={searchByDate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-xs font-medium">
                                Wyszukaj po dacie
                            </button>
                            <button
                                onClick={searchByArcode}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-xs font-medium">
                                Wyszukaj po kodzie arc
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-xs font-medium">
                                Wyszukaj po operacji dokumentu
                            </button>
                        </div>

                        <div className="mt-2">
                            <button
                                onClick={handleClearFilters}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-md text-xs font-medium"
                            >
                                Wyczyść filtrowanie
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Przyjęcia i wydania ze składu</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kod dokumentu
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Data operacji
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Operacja
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ilość
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Opis
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Transport
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Magazyn
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    // <div className="bg-red-200 p-2"> Brak danych / połączenie z serwerem nieaktywne </div>
                                    <tr><td colSpan="7" className="p-4 text-center text-red-500">Połączenie z serwerem nieaktywne</td></tr>
                                ) : docs.length === 0 ? (
                                    <tr><td colSpan="7" className="p-4 text-center text-gray-500">Brak danych</td></tr>
                                ) : (
                                    docs.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {item.documentNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-low text-gray-900">
                                                {item.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.operation === "import" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-600">
                                                        {item.operation}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600">
                                                        {item.operation}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.gasAmount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-low text-gray-900">
                                                {item.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-low text-gray-900">
                                                {item.gasTank}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.gasDepot}
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

export default DataList;