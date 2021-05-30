
require('dotenv').config(); //Es importante que dotenv se importe antes de importar el modelo note. Esto asegura que las variables de entorno del archivo .env estén disponibles globalmente antes de que se importe el código de los otros módulos.

const mongoose = require('mongoose');

const express=require('express');
const morgan = require('morgan');//Para logear en la consola informacion del request.
const app= express();
const cors= require('cors');

const Note=require('./models/note');
/*MONGOOSE---------------------------------------------------------------- */



/*MIDDLEWARES---------------------------------------------------------------- */
app.use(cors());
app.use(express.static('build'));//Para hacer que express muestre contenido estático.
app.use(express.json());//El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto request antes de llamar al controlador de ruta.


const requestLogger = (request, response, next) => {
      console.log('Method:', request.method)
      console.log('Path:  ', request.path)
      console.log('Body:  ', request.body)
      console.log('---')
      next()
    }

app.use(requestLogger);

//morgan.token('data', function (req, res) { return req.headers['content-type'] })
app.use(morgan(function (tokens, req, res) {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms','hola causa'
      ].join(' ')
    }));

/*BASE DE DATOS FICTICIO---------------------------------------------------------------- */

/* let notes = [
      {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
      },
      { 
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
      },
      {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
      }
    ] */

/*RUTAS---------------------------------------------------------------- */


//     app.get('/', (request, response) => {
//       response.send('<h1>Hello World!</h1>')//Dado que el parametro es un string, express establece automáticamente el valor del header Content-Type en text/html. El código de estado de la respuesta predeterminado es 200.
//     })

    app.get('/info', (request, response) => {
      
      response.send('<h1>Hello World!</h1>')//Dado que el parametro es un string, express establece automáticamente el valor del header Content-Type en text/html. El código de estado de la respuesta predeterminado es 200.
    })
    
    

    app.get('/api/notes', (request, response)=>{
          Note.find({}).then(notes=>{
                response.json(notes);
          })
    });

    app.get('/api/notes/:id', (request, response)=>{

         /* const id = Number(request.params.id);
          const note=notes.find(note=>note.id===id);
          if (note) {
                response.json(note);
          }else{
                response.status(404).end();
          }*/

      //     const id = Number(request.params.id);
          Note.findById(request.params.id) 
          .then(note => {response.json(note);});
    })

    app.delete('/api/notes/:id', (request, response)=>{

          const id = Number(request.params.id);

          notes = notes.filter(note=>note.id!==id);//Nuevo array con todos los recursos menos el que hemos eliminado.

          response.status(204).end();
    })

    const generateId=() =>{
      const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))//Math.max(...[1,2,3,..,n]) == Math.max(1,2,3,...,n)
      : 0
      return maxId + 1
    };

    app.post('/api/notes', (request, response)=>{
          const body= request.body;

          if (!body.content) {
                return response.status(400).json({error: 'falta contenido'});//Con este return se corta la ejecucion del codigo restante.
          }

      //     const note= new{
      //           content: body.content,
      //           important: body.important || false,
      //           date: new Date(),
      //           id: generateId()
      //     }
      //     notes=notes.concat(note);
      //     response.json(note);

          const note = new Note({//Los objetos de nota se crean con la función de constructor Note
                content: body.content,
                important: body.important || false,
                date: new Date(),
          })

          note.save().then(savedNote=>{// Los datos devueltos en la respuesta (savednote) son la versión formateada creada con el método toJSON
                response.json(savedNote)
          })
    });

    app.put('/api/notes/:id', (request, response)=>{
          const note=request.body;
          const id=Number(request.params.id);
          notes=notes.filter(note=>note.id!==id);
          notes=notes.concat(note);
          
          response.json(note);
    });

/*MIDDLEWARES DE ERROR---------------------------------------------------------------- */

    const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }
    
    app.use(unknownEndpoint)

/*INICIO Y ESCUCHA DEL SERVIDOR---------------------------------------------------------------- */

    const PORT= process.env.PORT;
    
    app.listen(PORT,()=>{
          console.log(`Server running on port ${PORT}`);
    })


//git push heroku main>>Para guardar en el servidor de heroku cada vez que queremos desplegar el ultimo commit a heroku
//las solicitudes HTTP GET a la dirección www.serversaddress.com/index.html o www.serversaddress.com mostrarán el frontend de React. Las solicitudes GET a la dirección www.serversaddress.com/api/notes serán manejadas por el código del backend.