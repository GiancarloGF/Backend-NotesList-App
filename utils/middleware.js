const logger= require('./logger')



const requestLogger = (request, response, next) => {
      logger.info('Method:', request.method)
      logger.info('Path:  ', request.path)
      logger.info('Body:  ', request.body)
      logger.info('---')
      next()
}

const unknownEndpoint = (request, response) => {
      response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler =(error, request, response, next) => {
      if(error.name==='CastError'){//El controlador de errores comprueba si el error es una excepción CastError, en cuyo caso sabemos que el error fue causado por un ID de objeto no válido para Mongo.En todas las demás situaciones de error, el middleware pasa el error al controlador de errores Express predeterminado.
        return response.status(400).send({ error: 'id mal formateado' });
      }else if(error.name==='ValidationError'){//Para controlar errores de validacion.
        return response.status(400).json({ error: error.message });
      }else if(error.name==='JsonWebTokenError'){
            return response.status(401).json({error: 'Invalid token'})//Errores de los tokens de jwt.
      }
      logger.error(error.message);

      next(error);//Si se llama a la función next con un parámetro, la ejecución continuará en el middleware del controlador de errores.
};

module.exports={
      requestLogger,
      unknownEndpoint,
      errorHandler
}
    
    