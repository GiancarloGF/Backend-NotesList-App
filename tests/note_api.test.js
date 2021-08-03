const mongoose=require('mongoose');
const supertest=require('supertest');
const helper = require('./test_helper')
const app=require('../app');

const api=supertest(app);  //(1)


const Note=require('../models/note');


beforeEach(async () => {
      await Note.deleteMany({})                    //(2)

      let noteObject=new Note(helper.initialNotes[0]);
      await noteObject.save();

      noteObject=new Note(helper.initialNotes[1]);
      await noteObject.save();
})


test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb()
    
      const noteToView = notesAtStart[0]
    
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
      const processedNoteToView = JSON.parse(JSON.stringify(noteToView)) //(3)
    
      expect(resultNote.body).toEqual(processedNoteToView)
})


    
test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]
    
      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
    
      const notesAtEnd = await helper.notesInDb()
    
      expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length - 1
      )
    
      const contents = notesAtEnd.map(r => r.content)
    
      expect(contents).not.toContain(noteToDelete.content)
})



test('notes are returned as json', async () => {
      await api                                                   //(4)
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
})





test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
})



test('a specific note is within the returned notes', async () => {
      const response = await api.get('/api/notes')
    
      const contents = response.body.map(r => r.content)
    
      expect(contents).toContain(
        'Browser can execute only Javascript'
      )
})



test('there are two notes', async () => {
      const response = await api.get('/api/notes')
    
      expect(response.body).toHaveLength(helper.initialNotes.length)
})
    


test('a valid note can be added', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }
    
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      
      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
      
    
      const contents = notesAtEnd.map(n => n.content)

      expect(contents).toContain(
        'async/await simplifies making async calls'
      )
})



test('note without content is not added', async () => {
      const newNote = {
        important: true
      }
    
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
    
      const notesAtEnd = await helper.notesInDb()
    
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})



afterAll(() => {
      mongoose.connection.close();      //(5)
})




//COMENTARIOS

/* (1)
La prueba importa la aplicación Express del módulo app.js y la envuelve con la función supertest en un objeto llamado superagent. Este objeto se asigna a la variable api y las pruebas pueden usarlo para realizar solicitudes HTTP al backend.
*/

/* (2)
La base de datos se borra al principio, y luego guardamos las dos notas almacenadas en la matriz initialNotes en la base de datos. Al hacer esto, nos aseguramos de que la base de datos esté en el mismo estado antes de ejecutar cada prueba.
 */

/*(3)
El objeto de nota que recibimos como que el cuerpo de la respuesta pasa por la serialización y el análisis de JSON. Este procesamiento convertirá el tipo de valor de propiedad date del objeto de nota del objeto Date en una cadena. Debido a esto, no podemos comparar directamente la igualdad de resultNote.body y noteToView. En su lugar, primero debemos realizar una serialización JSON y un análisis similares para noteToView como lo hace el servidor para el objeto note.
*/

/* (4)
Nuestra prueba realiza una solicitud HTTP GET a la URL api/notes y verifica que se responda a la solicitud con el código de estado 200. La prueba también verifica que el encabezado Content-Type se establece en application/json, lo que indica que los datos están en el formato deseado.
supertest se encarga de que la aplicación que se está probando se inicie en el puerto que utiliza internamente cuando el servidor no esta escuchando para las conexiones.
El api.get().... es asincrono, por lo que tenemos que esperarlo a que reazice su ejecución por lo que le aplicamos el async/await
*/

/* (5)
Una vez que todas las pruebas (actualmente solo hay una) hayan terminado de ejecutarse, tenemos que cerrar la conexión a la base de datos utilizada por Mongoose. Esto se puede lograr fácilmente con el método afterAll:
*/