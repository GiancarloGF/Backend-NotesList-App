const mongoose=require('mongoose');

const noteSchema =new mongoose.Schema({
      content: {
            type: String,
            minlength: 5,
            required: true
      },
      date: {
            type: Date,
            required: true
      },
      important: Boolean,
      
      user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
      }
})


noteSchema.set('toJSON', {//Aunque la propiedad _id de los objetos Mongoose parece un string, de hecho es un objeto. El método toJSON que definimos lo transforma en un string solo para estar seguros.
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

module.exports=mongoose.model('Note', noteSchema);