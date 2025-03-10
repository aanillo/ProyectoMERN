require('dotenv').config(); // Esto debe ser lo primero para que luego cuando siga corriendo el código entienda QUÉ variables y qué valores hay


const app = require('./app'); //Saco de app, lo que hemos creado allí en esa variable
require('./database');


// Ejecutamos el servidor
async function main() {
    try {
        await app.listen(app.get('port'));
        console.log('El servidor se está escuchando en el puerto:', app.get('port'));
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
    }
}


main();