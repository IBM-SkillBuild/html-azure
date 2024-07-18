const endpoint = "https://cosmos-db-edu.documents.azure.com:443/"
       
        // Función para convertir una cadena en Base64
        function toBase64(str) {
            return btoa(unescape(encodeURIComponent(str)));
        }

        // Función para generar el encabezado de autorización
        function getAuthorizationToken(verb, resourceType, resourceId, date) {
            const keyBuffer = CryptoJS.enc.Base64.parse(key);
            const text = (verb || "").toLowerCase() + "\n" +
                (resourceType || "").toLowerCase() + "\n" +
                (resourceId || "") + "\n" +
                date.toLowerCase() + "\n" +
                "" + "\n";

            const signature = CryptoJS.HmacSHA256(text, keyBuffer).toString(CryptoJS.enc.Base64);
            return encodeURIComponent(`type=master&ver=1.0&sig=${signature}`);
        }

        // Función para realizar una solicitud HTTP a Cosmos DB
        async function makeRequest(verb, resourceType, resourceId, body = null) {
            const url = `${endpoint}${resourceType}/${resourceId}`;
            const date = new Date().toUTCString();
            const authorization = getAuthorizationToken(verb, resourceType, resourceId, date);

            const options = {
                method: verb,
                headers: {
                    "x-ms-date": date,
                    "x-ms-version": "2018-12-31",
                    "Authorization": authorization,
                    "Content-Type": "application/json"
                }
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }

        async function main() {
            try {
                // Leer todos los elementos del contenedor
                const result = await makeRequest("GET", `dbs/${databaseId}/colls/${containerId}/docs`, "");
                console.log("Documentos en el contenedor:", result.Documents);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        main();
    