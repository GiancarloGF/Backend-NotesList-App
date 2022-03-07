
const config =require('./utils/config'); //Valiables de entorno
const express=require('express'); 
require('express-async-errors');//Nos permite omitir el try-catch en el async/await
const app= express();
const cors= require('cors');
const notesRouter=require('./controllers/notes');
const usersRouter=require('./controllers/users');
const loginRouter=require('./controllers/login');
const weatherRouter=require('./controllers/weather');
const middleware=require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');


/*CONECCION CON MONGO A TRAVEZ DE MONGOOSE-------------------------------------------------------------- */

logger.info('Connecting to...' , config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

/*MIDDLEWARES---------------------------------------------------------------- */
app.use(cors());
app.use(express.static('build'));//Para hacer que express muestre contenido estático.
app.use(express.json());//El json-parser funciona para que tome los datos JSON de una solicitud, los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto request antes de llamar al controlador de ruta.
app.get('/dashboard',  (request, response)=>{
  response.redirect('/')
})
app.use(middleware.requestLogger);
app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/weather', weatherRouter);
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports=app;


//git push heroku main >> Para guardar en el servidor de heroku cada vez que queremos desplegar el ultimo commit a heroku
//las solicitudes HTTP GET a la dirección www.serversaddress.com/index.html o www.serversaddress.com mostrarán el frontend de React. Las solicitudes GET a la dirección www.serversaddress.com/api/notes serán manejadas por el código del backend.

/*CONTROLADORES DE ERRORES >>Dado que el controlador de endpoint desconocido responde a todas las solicitudes con 404 unknown endpoint, no se llamará a ninguna ruta o middleware después de que el middleware de endpoint desconocido haya enviado la respuesta.
La única excepción a esto es el controlador de errores que debe estar al final, después del controlador de endpoints desconocido. */

/*Hay un detalle importante con respecto al uso del método findByIdAndUpdate. De forma predeterminada, el parámetro updatedNote del controlador de eventos recibe el documento original sin las modificaciones.
Agregamos el parámetro opcional { new: true }, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original. */