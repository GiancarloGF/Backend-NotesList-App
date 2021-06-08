const mongoose=require('mongoose');
const supertest=require('supertest');
const app=require('../app');

const api=supertest(app);
/* La prueba importa la aplicación Express del módulo app.js y la envuelve con la función supertest en un objeto llamado superagent. Este objeto se asigna a la variable api y las pruebas pueden usarlo para realizar solicitudes HTTP al backend.
 */

const Note=require('../models/note');

const initialNotes=[
      {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
      },
      {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
      },
    ]

beforeEach(async () => {
      await Note.deleteMany({})
      let noteObject=new Note(initialNotes[0]);
      await noteObject.save();
      noteObject=new Note(initialNotes[1]);
      await noteObject.save();
})
/* La base de datos se borra al principio, y luego guardamos las dos notas almacenadas en la matriz initialNotes en la base de datos. Al hacer esto, nos aseguramos de que la base de datos esté en el mismo estado antes de ejecutar cada prueba.
 */
test('notes are returned as json', async () => {
      await api
            .get('/api/notes')
            .expect(200)
            // .expect('Content-Type', /application/json/)
})
/* Nuestra prueba realiza una solicitud HTTP GET a la URL api/notes y verifica que se responda a la solicitud con el código de estado 200. La prueba también verifica que el encabezado Content-Type se establece en application/json, lo que indica que los datos están en el formato deseado.
supertest se encarga de que la aplicación que se está probando se inicie en el puerto que utiliza internamente cuando el servidor no esta escuchando para las conexiones.
 */

test('there are two notes', async () => {
      const response = await api.get('/api/notes')
    
      expect(response.body).toHaveLength(initialNotes.length)
    })
    
test('the first note is about HTTP methods', async () => {
      const response = await api.get('/api/notes');
      const contents=response.body.map(r=>r.content);
      expect(contents).toContain('Browser can execute only Javascript');
      /* El método toContain se utiliza para comprobar que la nota que se le ha asignado como parámetro está en la lista de notas devueltas por la API. */
    })

afterAll(() => {
      mongoose.connection.close();
})
/* 
Una vez que todas las pruebas (actualmente solo hay una) hayan terminado de ejecutarse, tenemos que cerrar la conexión a la base de datos utilizada por Mongoose. Esto se puede lograr fácilmente con el método afterAll:
*/