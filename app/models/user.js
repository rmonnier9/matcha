var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    firstname        : String,
    lastname         : String,
    login            : String,
    birthDate        : Date,
    gender           : { type: String, enum: ['Male', 'Female'] },
    interestedIn     : { type: String, enum: ['Male', 'Female'] },
    about            : String,
    tags             : String,
    pictures         : {
        path1          : String,
        path2          : String,
        path3          : String,
        path4          : String,
        path5          : String
    },
    localisation     : Number,
    popularityRate   : Number,
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
