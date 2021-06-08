

const info=(...params) =>{
      if(process.env.NODE_ENV!=='test'){

            console.log(...params)
      }
/*       El middleware que genera información sobre las solicitudes HTTP obstruye la salida de ejecución de la prueba. Modificamos el logger para que no imprima en la consola en modo de prueba
 */}

const error=(...params) =>{
      console.log(...params)
}

module.exports ={
      info,error
}