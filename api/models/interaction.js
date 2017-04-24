import mongoose from 'mongoose'
import bcrypt   from 'bcrypt-nodejs'

// define the schema for our user model
const interactionSchema = mongoose.Schema({

    users             : Array,
    id_1              : {
      like            : Boolean,
      block           : Boolean,
      report          : Boolean
    },
    id_2              : {
      like            : Boolean,
      block           : Boolean,
      report          : Boolean
    }

})

// methods ======================
//


// create the model for users
const model = mongoose.model('Interaction', userSchema)

export default model
