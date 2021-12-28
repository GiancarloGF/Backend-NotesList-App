const jwt=require('jsonwebtoken')//Generate JSON web tokens
const bcrypt=require('bcrypt')//Password transformer
const loginRouter=require('express').Router()//Router for login.
const User=require('../models/user')//Bring back user model.

loginRouter.post('/', async (request, response)=>{

      const body=request.body;

      //Returns the user in the db.
      const user=await User.findOne({email:body.email});

      //Compare and verify the request password.
      const passwordCorrect=user===null                       
      ?false
      :await bcrypt.compare(body.password, user.passwordHash)

      //If the user is not authorized, response with and error.
      if(!(user&&passwordCorrect)){                          
            return response.status(401).json({error: 'invalid username or password'})
      }
      //If the user is authorized, a token is created.
      const userForToken={
            email:user.username,
            id:user._id,
      }
      //The token is given back signed digitally using an environment variable string as a secret.
      const token=jwt.sign(userForToken,process.env.SECRET)

      //The token is returned back with the user's username and name.
      response.status(200).send({token, email:user.email, name:user.name})
})

module.exports=loginRouter;