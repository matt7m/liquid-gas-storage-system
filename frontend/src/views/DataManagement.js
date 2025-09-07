import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import TankCard from '../components/DepotCard';
import axios from "axios";

const tanks = [
    { name: "WSZ 4517H", value: 1 },
    { name: "WSZ 4518H", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "5", value: 6 },
    { name: "5", value: 7 },
    { name: "5", value: 8 }
];

const depots = [
    { name: "Zbironik 1", value: 1 },
    { name: "Zbiornik 2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "5", value: 6 },
    { name: "5", value: 7 },
    { name: "5", value: 8 }
];

function DataManagement() {
    const [formData, setFormData] = useState({
        documentNumber: "",
        date: "",
        operation: "",
        gasTankId: "",
        gasDepotId: "",
        gasAmount: "",
        description: ""
    });

    const [filteredDocs, setFilteredDocs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [originalArc, setOriginalArc] = useState(null);
    const [editForm, setEditForm] = useState({
        documentNumber: "",
        date: "",
        operation: "",
        gasTankId: "",
        gasDepotId: "",
        gasAmount: "",
        description: ""
    });

    const [documentFilter, setDocumentFilter] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            documentNumber: formData.documentNumber,
            date: formData.date,
            operation: formData.operation,
            gasTank: { id: Number(formData.gasTankId) },
            gasDepot: { id: Number(formData.gasDepotId) },
            gasAmount: Number(formData.gasAmount),
            description: formData.description
        };

        console.log("Payload do wysyłki:", payload);

        try {
            const response = await axios.post(
                "http://localhost:8080/api/managements/new_doc",
                payload,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Dodano dokument:", response.data);
            alert("Dokument został dodany!");
        } catch (err) {
            console.error("Błąd podczas dodawania dokumentu:", err);
            const serverMsg =
                err?.response?.data
                    ? typeof err.response.data === "string"
                        ? err.response.data
                        : JSON.stringify(err.response.data)
                    : err.message;
            alert("Nie udało się dodać dokumentu");
        }
    };

    // obsługa przycisku "Wyszukaj"
    const allDocs = async (e) => {
        e.preventDefault();

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

            setFilteredDocs(mapped);
        } catch (e) {
            console.error(e);
            setError(e.message || "Błąd pobierania");
        } finally {
            setLoading(false);
        }

    };

    const searchByArcode = async (e) => {
        e.preventDefault();

        if (documentFilter === "") {
            alert("Podaj numer dokumentu (arc).");
            return;
        }

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

            setFilteredDocs(mapped);
        } catch (e) {
            console.error(e);
            setError(e?.response?.data || e.message || "Błąd filtrowania");
        } finally {
            setLoading(false);
        }

    };

    const handleDelete = async (docNumber) => {
        if (!window.confirm(`Na pewno usunąć dokument ${docNumber}?`)) return;

        try {
            setLoading(true);
            setError(null);

            await axios.delete("http://localhost:8080/api/managements/doc_del", {
                params: { arc: docNumber }
            });

            setFilteredDocs(prev => prev.filter(d => d.documentNumber !== docNumber));
        } catch (e) {
            console.error(e);
            setError(e?.response?.data || e.message || "Błąd usuwania");
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (row) => {
        setEditingId(row.id);
        setOriginalArc(row.documentNumber); // zapamiętaj stary kod dokumentu

        setEditForm({
            documentNumber: row.documentNumber,
            date: row.date,
            operation: row.operation || "",
            gasAmount: String(row.gasAmount ?? ""),
            description: row.description || "",
            gasTankId: row.gasTankId ? String(row.gasTankId) : "",
            gasDepotId: row.gasDepotId ? String(row.gasDepotId) : ""
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setOriginalArc(null);
        setEditForm({
            documentNumber: "",
            date: "",
            operation: "",
            gasAmount: "",
            description: "",
            gasTankId: "",
            gasDepotId: ""
        });
    };

    const onEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(s => ({ ...s, [name]: value }));
    };

    const submitEdit = async (row) => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                documentNumber: editForm.documentNumber.trim(),
                date: editForm.date,
                operation: editForm.operation,
                gasAmount: Number(editForm.gasAmount),
                description: editForm.description || null,
                gasTank: editForm.gasTankId ? { id: Number(editForm.gasTankId) } : null,
                gasDepot: editForm.gasDepotId ? { id: Number(editForm.gasDepotId) } : null
            };

            await axios.put("http://localhost:8080/api/managements/doc_edit", payload, {
                params: { arc: row.documentNumber }
            });

            setFilteredDocs(prev => prev.map(d => {
                if (d.id !== row.id) return d;
                return {
                    ...d,
                    date: new Date(editForm.dateISO).toLocaleDateString("pl-PL"),
                    operation: editForm.operation,
                    gasAmount: Number(editForm.gasAmount),
                    description: editForm.description
                };
            }));

            cancelEdit();
        } catch (e) {
            console.error(e);
            setError(e?.response?.data || e.message || "Błąd edycji");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Nowy dokument</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Numer dokumentu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numer dokumentu
                        </label>
                        <input
                            type="text"
                            name="documentNumber"
                            value={formData.documentNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Wprowadź numer dokumentu"
                        />
                    </div>

                    {/* Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Data
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>

                    {/* Typ operacji */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Typ operacji
                        </label>
                        <select
                            name="operation"
                            value={formData.operation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">Wybierz operację</option>
                            <option value="import">Import</option>
                            <option value="export_eAD">Export eAD</option>
                            <option value="export_eDD">Export eDD</option>
                            <option value="export_WZ">Export WZ</option>
                            <option value="export_ORLEN">Export zew. Orlen</option>
                        </select>
                    </div>

                    {/* Cysterna */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cysterna
                        </label>
                        <select
                            name="gasTankId"
                            value={formData.gasTankId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">Wybierz cysternę</option>
                            <option value="1">Cysterna 	WSZ-4517H</option>
                            <option value="2">Cysterna WSZ-4518H</option>
                            <option value="3">Cysterna WSZ-4519H</option>
                            <option value="4">Cysterna WSZ-80SK</option>
                            <option value="5">Cysterna WR-456FS</option>
                            <option value="6">Cysterna WSZ-79XE</option>
                            <option value="7">Cysterna WSZ-1A36</option>
                            <option value="8">Cysterna WSZ-27AJ</option>
                            <option value="9">Transport zewnętrzny</option>
                        </select>
                    </div>

                    {/* Magazyn */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Magazyn
                        </label>
                        <select
                            name="gasDepotId"
                            value={formData.gasDepotId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">Wybierz magazyn</option>
                            <option value="1">Zbiornik '1'</option>
                            <option value="2">Zbiornik '2'</option>
                            <option value="3">Zbiornik '3'</option>
                            <option value="4">Zbiornik '4'</option>
                            <option value="5">Wagon cysterna</option>
                            <option value="6">Kontener 'A'</option>
                            <option value="7">Kontener 'B'</option>
                            <option value="8">Zbiornik rezerwowy</option>
                        </select>
                    </div>

                    {/* Ilość gazu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ilość gazu (L)
                        </label>
                        <input
                            type="number"
                            name="gasAmount"
                            value={formData.gasAmount}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Podaj ilość gazu"
                        />
                    </div>

                    {/* Opis */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opis
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Wprowadź opis operacji"
                        ></textarea>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Dodaj dokument do ewidencji
                    </button>
                </div>
            </form>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Edycja dokumentów</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>
                    <div className="mt-4">
                        <div className="flex space-x-4">
                            <button
                                onClick={searchByArcode}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-xs font-medium">
                                Szukaj dokumentu
                            </button>
                            <button
                                onClick={allDocs}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-xs font-medium">
                                Wyświetl listę dokumentów
                            </button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 space-y-4">Dokumenty do edycji</h3>
                    </div>
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
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Akcje
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="7" className="p-4 text-center text-blue-500">Wyszukaj danych</td></tr>
                            ) : filteredDocs.length === 0 ? (
                                <tr><td colSpan="7" className="p-4 text-center text-gray-500">Brak danych</td></tr>
                            ) : (
                                filteredDocs.map((item) => {
                                    const isEditing = editingId === item.id;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="documentNumber"
                                                        value={editForm.documentNumber}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm w-48"
                                                        placeholder="Kod dokumentu"
                                                    />
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {item.documentNumber}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        name="dateISO"
                                                        value={editForm.dateISO}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm"
                                                    />
                                                ) : (
                                                    item.date
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {isEditing ? (
                                                    <select
                                                        name="operation"
                                                        value={editForm.operation}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value="import">import</option>
                                                        <option value="export">export</option>
                                                    </select>
                                                ) : item.operation === "import" ? (
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
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="gasAmount"
                                                        value={editForm.gasAmount}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm w-28"
                                                    />
                                                ) : (
                                                    item.gasAmount
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        value={editForm.description}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm w-56"
                                                        placeholder="Opis"
                                                    />
                                                ) : (
                                                    item.description
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                                                {isEditing ? (
                                                    <select
                                                        name="gasTankId"
                                                        value={editForm.gasTankId}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value="">Wybierz cysternę</option>
                                                        {tanks.map(t => (
                                                            <option key={t.id} value={t.id}>
                                                                {t.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    item.gasTank
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                                                {isEditing ? (
                                                    <select
                                                        name="gasDepotId"
                                                        value={editForm.gasDepotId}
                                                        onChange={onEditChange}
                                                        className="border rounded px-2 py-1 text-sm"
                                                    >
                                                        <option value="">Wybierz zbiornik</option>
                                                        {depots.map(d => (
                                                            <option key={d.id} value={d.id}>
                                                                {d.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    item.gasTank
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isEditing ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => submitEdit(item)}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs"
                                                        >
                                                            Zapisz
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded-md text-xs"
                                                        >
                                                            Anuluj
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => startEdit(item)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs"
                                                        >
                                                            Edytuj
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.documentNumber)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs"
                                                        >
                                                            Usuń
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                        // <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        //     <td className="px-6 py-4 whitespace-nowrap">
                                        //         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        //             {item.documentNumber}
                                        //         </span>
                                        //     </td>

                                        //     {/* Data */}
                                        //     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        //         {isEditing ? (
                                        //             <input
                                        //                 type="date"
                                        //                 name="dateISO"
                                        //                 value={editForm.dateISO}
                                        //                 onChange={onEditChange}
                                        //                 className="border rounded px-2 py-1 text-sm"
                                        //             />
                                        //         ) : (
                                        //             item.date
                                        //         )}
                                        //     </td>

                                        //     {/* Operacja */}
                                        //     <td className="px-6 py-4 whitespace-nowrap">
                                        //         {isEditing ? (
                                        //             <select
                                        //                 name="operation"
                                        //                 value={editForm.operation}
                                        //                 onChange={onEditChange}
                                        //                 className="border rounded px-2 py-1 text-sm"
                                        //             >
                                        //                 <option value="import">import</option>
                                        //                 <option value="export">export</option>
                                        //                 {/* dodaj inne, jeśli masz */}
                                        //             </select>
                                        //         ) : item.operation === "import" ? (
                                        //             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-600">
                                        //                 {item.operation}
                                        //             </span>
                                        //         ) : (
                                        //             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600">
                                        //                 {item.operation}
                                        //             </span>
                                        //         )}
                                        //     </td>

                                        //     {/* Ilość */}
                                        //     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        //         {isEditing ? (
                                        //             <input
                                        //                 type="number"
                                        //                 name="gasAmount"
                                        //                 value={editForm.gasAmount}
                                        //                 onChange={onEditChange}
                                        //                 className="border rounded px-2 py-1 text-sm w-28"
                                        //             />
                                        //         ) : (
                                        //             item.gasAmount
                                        //         )}
                                        //     </td>

                                        //     {/* Opis */}
                                        //     <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                                        //         {isEditing ? (
                                        //             <input
                                        //                 type="text"
                                        //                 name="description"
                                        //                 value={editForm.description}
                                        //                 onChange={onEditChange}
                                        //                 className="border rounded px-2 py-1 text-sm w-56"
                                        //                 placeholder="Opis"
                                        //             />
                                        //         ) : (
                                        //             item.description
                                        //         )}
                                        //     </td>

                                        //     {/* Transport / Magazyn – wyświetlasz jak było (możesz też przerobić na selecty do edycji) */}
                                        //     <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">{item.gasTank}</td>
                                        //     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.gasDepot}</td>

                                        //     {/* AKCJE */}
                                        //     <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        //         {isEditing ? (
                                        //             <div className="flex space-x-2">
                                        //                 <button
                                        //                     onClick={() => submitEdit(item)}
                                        //                     className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs"
                                        //                 >
                                        //                     Zapisz
                                        //                 </button>
                                        //                 <button
                                        //                     onClick={cancelEdit}
                                        //                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded-md text-xs"
                                        //                 >
                                        //                     Anuluj
                                        //                 </button>
                                        //             </div>
                                        //         ) : (
                                        //             <div className="flex space-x-2">
                                        //                 <button
                                        //                     onClick={() => startEdit(item)}
                                        //                     className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs"
                                        //                 >
                                        //                     Edytuj
                                        //                 </button>
                                        //                 <button
                                        //                     onClick={() => handleDelete(item.documentNumber)}
                                        //                     className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs"
                                        //                 >
                                        //                     Usuń
                                        //                 </button>
                                        //             </div>
                                        //         )}
                                        //     </td>
                                        // </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DataManagement;