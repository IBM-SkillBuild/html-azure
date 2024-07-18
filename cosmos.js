const endpoint = ""; 
const key = "";

async function fetchData() {
    try {
        const response = await fetch(`${endpoint}/dbs/your-database-id/colls/your-collection-id/docs/your-document-id`, {mode: 'no-cors'},{
            method: "GET",
            headers: {
                "Authorization": `masterKey=${key}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Documento recuperado:", data);
        } else {
            console.error("Error al recuperar el documento:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

fetchData();