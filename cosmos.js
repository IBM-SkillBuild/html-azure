
let config;
$( document ).ready(function() {
    console.log( "ready!" );
    $.getJSON('./config.json', function(data) {
        config = data;
        console.log('Config loaded:', config);
        
        // Aquí puedes llamar a otras funciones que dependan de `config`
       
        mostrar()
      })
      .fail(function(jqxhr, textStatus, error) {
        console.error('There was a problem with the fetch operation:', textStatus, error);
      });
});



 
 



// Función para crear el encabezado de autenticación
function getAuthorizationToken(verb, resourceType, resourceId, date, masterKey) {
    const key = CryptoJS.enc.Base64.parse(masterKey);
    const text = (verb || "").toLowerCase() + "\n" +
                 (resourceType || "").toLowerCase() + "\n" +
                 (resourceId || "") + "\n" +
                 date.toLowerCase() + "\n" +
                 "" + "\n";

    const signature = CryptoJS.HmacSHA256(text, key).toString(CryptoJS.enc.Base64);

    const MasterToken = "master";
    const TokenVersion = "1.0";
    
    return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);
}

// Función para obtener los documentos
async function getDocuments() {

    const endpoint = config.endpoint;
    const masterKey = config.masterKey;
    const databaseId = config.databaseId;
    const containerId = config.containerId;
    const url = `${endpoint}/dbs/${databaseId}/colls/${containerId}/docs`;
    const date = new Date().toUTCString();
    const resourceId = `dbs/${databaseId}/colls/${containerId}`;
    const authToken = getAuthorizationToken("GET", "docs", resourceId, date, masterKey);
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': authToken,
            'x-ms-date': date,
            'x-ms-version': '2018-12-31',  // Asegúrate de usar la versión correcta
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    }

    const data = await response.json();
    return data.Documents || data.documents || [];
}

// Llamada a la función para obtener y mostrar los documentos
function mostrar(){
    getDocuments().then(documents => {
        console.log('Documents:', documents);
        // Aquí puedes procesar los documentos como desees
        documents.forEach(doc => {
            console.log(doc);
        });
        const table = $('#documentsTable').DataTable({
            data: documents,
            responsive: true,
            columns: [
                { data: 'name' },
                { data: 'edad' },  

            ]
        });
    }).catch(error => {
        console.error(error);
    });
}



 

