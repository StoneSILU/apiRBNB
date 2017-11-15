const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const bcrypt = require("bcrypt-nodejs")

var UserSchema = mongoose.Schema({
    firstName: { type: String, maxlength: 50 },
    lastName: { type: String, maxlength: 50 },
    username: { type: String, maxlength: 50, unique: true },
    email: { type: String, unique: false },
    password: { type: String },
    birthDate: { type: Number },
    gender: {
        type: String,
        enum: ['Female', 'Male'],
        default: 'Male'
    },
    phone: { type: String, maxLength: 10 },
    creationDate: Number,
    responseRate: { type: Number, max: 100 },
    accountVerified: { type: Boolean },
    lastConnectionDate: { type: Number }
});


UserSchema.statics.authenticate = function (username, password, callback) {
    this.findOne({ username: username }, function (error, user) {
        if (user && bcrypt.compareSync(password, user.password)) {
            callback(null, user);
        } else if (user || !error) {
            // Email or password was invalid (no MongoDB error)
            error = new Error("Your email address or password is invalid. Please try again.");
            callback(error, null);
        } else {
            // Something bad happened with MongoDB. You shouldn't run into this often.
            callback(error, null);
        }
    });
};

UserSchema.statics.createUser = function (newUser, callback) {
    this.findOne({ username: newUser.username }, function (error, user) {
        if (user) {
            console.log("new user name : "+ user.username)
            callback("User already exists")
        } else {
            newUser.save(callback);
        }
    })
}


UserSchema.statics.updateProps = function (options, callback) {
    this.update({ _id: options.id }, { $set: options.properties }, callback);
}

UserSchema.statics.searchUser = function (options, callback) {
    this.find({ $or: [{ username: { '$regex': options.username } }, { email: { '$regex': options.username } }], ID: { '$ne': options.userId } }, { password: 0, _id: 0, contactList: 0 }, callback);
}

UserSchema.statics.getUser = function (id, callback) {
    this.findOne({ _id: id }, callback);
}


UserSchema.statics.comparePassword = function (candidatePassword, password, callback) {
    if (Hash.verify(candidatePassword, password)) {
        callback(null, true);
    } else {
        // Something bad happened with MongoDB. You shouldn't run into this often.
        callback("Invalid password", false);
    }
}

UserSchema.statics.deleteHome = function (userId, callback) {
    this.findByIdAndRemove(userId, callback)
}

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;