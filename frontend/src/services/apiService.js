import apiClient from './api';

// const determineStatus = (fillPercentage) => {
//     if (fillPercentage >= 80) return 'normal';
//     if (fillPercentage >= 50) return 'medium';
//     if (fillPercentage >= 20) return 'low';
//     return 'critical';
// };

export const apiService = {
    getAllTanks: async () => {
        //const response = await apiClient.get('/depot/list');
        //const transformedData = response.data.map(tankDataMapper);
        const response = apiClient.get('/depot/list')
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [response.data];

                const mapped = data.map(tank => {
                    const fillPercentage = Math.round((tank.currentStatus / tank.capacity) * 100);
                    let status = "low";
                    if (fillPercentage > 30) status = "medium";
                    if (fillPercentage > 70) status = "normal";

                    return {
                        id: tank.id,
                        name: tank.name,
                        liquid: tank.gasType?.type || "unknown",
                        fillPercentage,
                        capacity: `${tank.capacity.toLocaleString()}L`,
                        currentLevel: `${tank.currentStatus.toLocaleString()} L`,
                        status
                    };
                });
                mapped.sort((a, b) => a.id - b.id);
                //setTanks(mapped);
            })
            .catch(err => {
                console.error("Błąd pobierania danych:", err);
            });

        return response;
    },

    // GET: Get fuel level of specific tank by ID
    // getTankById: async (id) => {
    //     const response = await apiClient.get(`/depot/${id}`);
    //     const transformedData = tankDataMapper(response.data);
    //     return { ...response, data: transformedData };
    // },

    // GET: Get current fuel level of specific tank by ID
    getCurrentTankState: (id) => apiClient.get(`/depot/currentState/${id}`),

    // PUT: Load fuel into tank (increase fuel level)
    loadFuel: (tankId, updateValue) =>
        apiClient.put(`/depot/load?id=${tankId}&updateValue=${updateValue}`),

    // PUT: Unload fuel from tank (decrease fuel level)
    unloadFuel: (tankId, updateValue) =>
        apiClient.put(`/depot/unload?id=${tankId}&updateValue=${updateValue}`),


    //DOCS MANAGEMENT
    // GET: Get list of all documents in database
    getAllDocuments: () => apiClient.get('/managements/docs/list'),

    // GET: Get specific document by ARC code
    getDocumentByArc: (arcCode) =>
        apiClient.get(`/managements/doc?arc=${arcCode}`),

    // DELETE: Delete document by ARC code
    deleteDocumentByArc: (arcCode) =>
        apiClient.delete(`/managements/doc_del?arc=${arcCode}`),

    // POST: Add new document to database
    createNewDocument: (documentData) =>
        apiClient.post('/managements/new_doc', documentData),
};