require('dotenv').config(); //Es importante que dotenv se importe antes de importar el modelo note. Esto asegura que las variables de entorno del archivo .env estén disponibles globalmente antes de que se importe el código de los otros módulos.
const express=require('express');
const morgan = require('morgan');//Para logear en la consola informacion del request.
const app= express();
const cors= require('cors');
const Note=require('./models/note');

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


/*RUTAS---------------------------------------------------------------- */

    app.get('/info', (request, response) => {
      
      response.send('<h1>Hello World!</h1>')//Dado que el parametro es un string, express establece automáticamente el valor del header Content-Type en text/html. El código de estado de la respuesta predeterminado es 200.
    })
    
    app.get('/api/notes', (request, response)=>{
          Note.find({}).then(notes=>{
                response.json(notes);
          })
    });

    app.get('/api/notes/:id', (request, response,next)=>{

          Note.findById(request.params.id) 
          .then(note => {
                if(note){
                      response.json(note);
                }else{//Si no se encuentra ningún objeto coincidente en la base de datos, el valor de note será null y se ejecutará el bloque else
                      response.status(404).end();
                }
            })
            .catch(error => next(error)); //Si se rechaza la promesa, por ejemplo, por un id mal mormateado, se ejecuta este codigo
            //Si se llama a la función next con un parámetro, la ejecución continuará en el middleware del controlador de errores.
    })

    app.delete('/api/notes/:id', (request, response,next)=>{

      Note.findByIdAndRemove(request.params.id)
      .then(result=>{
            response.status(204).end()
      })
      .catch(error=>next(error));
    })

    const generateId=() =>{
      const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))//Math.max(...[1,2,3,..,n]) == Math.max(1,2,3,...,n)
      : 0
      return maxId + 1
    };

    app.post('/api/notes', (request, response, next)=>{
          const body= request.body;

          

          const note = new Note({//Los objetos de nota se crean con la función de constructor Note
                content: body.content,
                important: body.important || false,
                date: new Date(),
          })

          note.save()
          .then(savedNote=>{
           // console.log(savedNote) -> id como objeto.
           //console.log(savedNote.toJSON()) -> id como string
            return savedNote.toJSON()})// Los datos devueltos en la respuesta (savednote) son la versión formateada creada con el método toJSON
          .then(savedAndFormattedNote=>{
                response.json(savedAndFormattedNote)
          })
          .catch(error =>next(error))
    });

    app.put('/api/notes/:id', (request, response)=>{
          const body=request.body;

          const note={
            content: body.content,
            important: body.important,
            /*No estamos editando aqui el date ya que no se esta creando uno nuevo (la fecha es del dia que se creo, no cuando se editó) */
          }

          Note.findByIdAndUpdate(request.params.id, note, {new: true})
          .then(updatedNote=>{
                response.json(updatedNote)
          })
          .catch(error=>next(error))
    });

/*MIDDLEWARES DE ERROR---------------------------------------------------------------- */

    const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }
    
    app.use(unknownEndpoint)

    const errorHandler =(error, request, response, next)=>{
      console.log(error.message);
      if(error.name==='CastError'){//El controlador de errores comprueba si el error es una excepción CastError, en cuyo caso sabemos que el error fue causado por un ID de objeto no válido para Mongo.En todas las demás situaciones de error, el middleware pasa el error al controlador de errores Express predeterminado.
            return response.status(400).send({error: 'id mal formateado'})
      }else if(error.name==='ValidationError'){//Para controlar errores de validacion.
            return response.status(400).json({error: error.message})
      }
      next(error);//Si se llama a la función next con un parámetro, la ejecución continuará en el middleware del controlador de errores.
      }

      app.use(errorHandler);


/*INICIO Y ESCUCHA DEL SERVIDOR---------------------------------------------------------------- */

    const PORT= process.env.PORT;
    
    app.listen(PORT,()=>{
          console.log(`Server running on port ${PORT}`);
    })


//git push heroku main >> Para guardar en el servidor de heroku cada vez que queremos desplegar el ultimo commit a heroku
//las solicitudes HTTP GET a la dirección www.serversaddress.com/index.html o www.serversaddress.com mostrarán el frontend de React. Las solicitudes GET a la dirección www.serversaddress.com/api/notes serán manejadas por el código del backend.

/*CONTROLADORES DE ERRORES >>Dado que el controlador de endpoint desconocido responde a todas las solicitudes con 404 unknown endpoint, no se llamará a ninguna ruta o middleware después de que el middleware de endpoint desconocido haya enviado la respuesta. 
La única excepción a esto es el controlador de errores que debe estar al final, después del controlador de endpoints desconocido. */

/*Hay un detalle importante con respecto al uso del método findByIdAndUpdate. De forma predeterminada, el parámetro updatedNote del controlador de eventos recibe el documento original sin las modificaciones. 
Agregamos el parámetro opcional { new: true }, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original. */