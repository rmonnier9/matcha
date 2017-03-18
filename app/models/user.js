var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name             : String,
    surname          : String,
    username         : String,
    gender           : { type: String, enum: ['Male', 'Female', 'Unknown'] },
    interestedIn     : {
      male           : Boolean,
      female         : Boolean
    },
    tags             : String,
    pictures         : {
      path1          : String,
      path2          : String,
      path3          : String,
      path4          : String,
      path5          : String
    },
    age              : Number,
    localisation     : Number,
    dateCreation     : { type: Date, default: Date.now },
    dateLastLogin    : Date,
    about            : String,
    popularityRate   : Number,
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

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
