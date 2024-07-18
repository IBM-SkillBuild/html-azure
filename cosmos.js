const endpoint = "https://<TU-CUENTA>.documents.azure.com:443/";
        const key = "<TU-LLAVE-PRIMARIA>";
        const databaseId = "miBaseDeDatos";
        const containerId = "miContenedor";

        // Función para generar el encabezado de autorización
        function getAuthorizationToken(verb, resourceType, resourceId, date) {
            const masterKey = atob(key);
            const text = (verb || "").toLowerCase() + "\n" +
                (resourceType || "").toLowerCase() + "\n" +
                (resourceId || "") + "\n" +
                date.toLowerCase() + "\n" +
                "" + "\n";

            const hash = CryptoJS.HmacSHA256(text, CryptoJS.enc.Base64.parse(masterKey));
            const signature = CryptoJS.enc.Base64.stringify(hash);

            return encodeURIComponent("type=master&ver=1.0&sig=" + signature);
        }

        // Función para realizar una solicitud HTTP a Cosmos DB
        async function makeRequest(verb, resourceType, resourceId, body = null) {
            const url = `${endpoint}${resourceType}${resourceId}`;
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
            const data = await response.json();
            return data;
        }

        async function main() {
            try {
                // Leer todos los elementos del contenedor
                const result = await makeRequest("GET", `dbs/${databaseId}/colls/${containerId}/docs`, "");
                console.log("Documentos en el contenedor:", result);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        main();