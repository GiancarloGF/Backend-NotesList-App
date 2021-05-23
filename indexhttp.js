//Importamos el modulo de servidor web integrado de node: http.
const http=require('http');

let notes = [
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
    ]





//Definimos la creacion del servidor.
const app=http.createServer((request, response)=>{
      response.writeHead(200, {'Content-Type': 'application/json'});//Header de la respuesta.
      response.end(JSON.stringify(notes));//Contenido de la respuesta (JSON < definido en la cabecera)
});

//Guardamos en variable el numero del puerto.
const PORT=3000;

//Hacemos que el servidor "escuche" las peticiones enviadas al puerto 3001.
app.listen(PORT)

//Codigo que se ejecutara luego de crearse el servidor.
console.log(`Server running on port ${PORT}` )

