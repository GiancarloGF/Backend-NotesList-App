const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async(request, response) => {
  let notes=await Note.find({});
  response.json(notes.map(note=>note.toJSON()))
})

notesRouter.get('/:id',async (request, response, next) => {

    const note= await Note.findById(request.params.id);
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

    const savedNote=await note.save();
    response.json(savedNote);//.json hace que se aplique el metodo .toJSON que definimos en models/note.js, pero tambien aplica el metodo Date.toJSON() nativo de JS al date.

  // note.save().then(savedNote => {response.json(savedNote)}).catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response, next) => {
  
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
})

notesRouter.put('/:id', async(request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }
  const updatedNote=await Note.findByIdAndUpdate(request.params.id, note, { new: true });
  response.json(updatedNote);
    
})

module.exports = notesRouter