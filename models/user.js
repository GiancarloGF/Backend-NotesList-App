const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');//Libreria de mongoose para validar datos en el schema.

const userSchema=new mongoose.Schema({
      email: {
            type: 'string',
            unique: true
      },
      name: String,
      passwordHash: String,
      notes:[
            {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Note'
            }
      ]
})

userSchema.set('toJSON',{
      transform: (document, returnedObject) => {
            returnedObject.id=returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
            delete returnedObject.passwordHash
      }
})

userSchema.plugin(uniqueValidator)

const User=mongoose.model('User', userSchema)

module.exports=User;