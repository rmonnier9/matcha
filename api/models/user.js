import mongoose from 'mongoose'
import bcrypt   from 'bcrypt-nodejs'

// define the schema for our user model
const userSchema = mongoose.Schema({

    firstname        : String,
    lastname         : String,
    login            : String,
    birthDate        : Date,
    gender           : { type: String, enum: ['male', 'female'] },
    interestedIn     : { type: String, enum: ['male', 'female'] },
    about            : String,
    tags             : Array,
    pictures         : Array,
    localisation     : Number,
    popularity		   : Number,
    dateCreation     : { type: Date, default: Date.now },
    dateLastLogin    : Date,
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

})

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

userSchema.methods.getAge = function() {
	const ageDifMs = Date.now() - this.birthDate.getTime();
	const ageDate = new Date(ageDifMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema)
