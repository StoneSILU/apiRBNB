var express = require('express');
var controller = require('./controller');
var User = require('./models/User')
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                console.log('erreur bizarre')
            }
            if (!user) {
                return done(null, false, { message: "Unknown User" })
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) {
                    console.log('erreur bizarre')
                }

                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Invalid Password' })
                }
            })
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    })
});


router.get('/', controller.getApp)
router.post('/login',
    passport.authenticate('local', {
        session: false
    }),
    function (req, res) {
        res.status(200);
        res.send(JSON.stringify({
            user: req.user,
            ID: req.user.ID,
            token: token,
            hasErrors: false,
            message: "You are log"
        }));
    });
router.get('/search', controller.search);
router.get('/chat', controller.chat);
router.delete('/user', controller.deleteUser)
router.delete('/home', controller.deleteHome)
router.post('/createhome', controller.createHome);
router.post('/sendmessage', controller.sendMessage);
router.post('/sendEmail', controller.sendEmail);
router.post('/updateInfos', controller.updateInfos)

module.exports = router