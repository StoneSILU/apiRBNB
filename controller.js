const bcrypt = require("bcrypt-nodejs")
const nodemailer = require('nodemailer')
const User = require('./models/User')
const Home = require('./models/Home')


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'stivynho95@gmail.com',
        pass: '********'
    }
});


module.exports = {
    getApp: function (req, res) {
        res.send('<h1>Please sign in</h1> <br><form method="GET" action="/login"><p><label>Login</label> : <input type="text" name="login" /></p> <br> <p><label>Password</label> : <input type="password" name="pwd" /></p> <input type="submit" value="Submit" /></form>')
    },
    chat: function (req, res) {
        res.sendFile('index.html', { root: './app/' }, function (err) {
            if (err) sendJSONError(response, 'Erreur server angular app');
        });
    },
    login: function (req, res) {
        var login = req.query.login;
        var pwd = req.query.pwd;
        if (!login || !pwd) {
            res.send('<h1>Password or ogin missing</h1>')
            return
        }
        User.authenticate(login, pwd, (err, user) => {
            if (user) {
                res.send('<h1>Welcome ' + login + '!!!! Happy to see you</h1> <br> <a href="/chat">Would you chat about airbnb?</a><br><h3>Where do you want to go ????</h3> <form method="GET" action="/search"><p><label>City</label> : <input type="text" name="city" /></p><input type="submit" value="Go" /></form> ')
                return
            } else {
                res.send('<h1 style="color: red">Invalid Credentials')
                return
            }
        })
    },
    createHome: function (req, res) {
        var homeData = req.body.homeData;
        if (!homeData) {
            res.send({
                hasErrors: true,
                message: "Home data are missing"
            })
        } else {
            var newHome = new Home(homeData);
            newHome.save((err, ok) => {
                if(err) {
                    res.send({
                        hasErrors: true,
                        message: "Mongo Error"
                    })
                }
                if(ok) {
                    res.status(200)
                    res.send({
                        hasErrors: false,
                        message: 'Home created'
                    })
                }
            })
        }
    },
    search: function (req, res) {
        var city = req.query.city;
        if (!city) {
            res.send({
                hasErrors: true,
                message: "City is missing"
            })
        } else {
            Home.searchByName(city,function(err, list) {
                if (err) {
                    res.send({
                        hasError: true,
                        message: 'Mongo Error'
                    })
                } else {
                    res.status(200)
                    res.send({
                        hasErrors: false,
                    })
                }
            })
        }
    },
    sendMessage: function (req, res) {
        res.send('<h1>sendMessage</h1>')
    },
    sendEmail: function (req, res) {
        var mailOptions = {
            from: '"Tadson airbnb  👻" <stivynho95@gmail.com', // sender address
            to: req.query.mail, // list of receivers
            subject: 'Booking  #8039551093 ✔', // Subject line
            text: 'Thank you, stone! Your reservation in ' + req.query.name + ' at ' + req.query.address + ' is now confirmed. ', // plain text body
            html: '<b>Thank you, stone! Your reservation in ' + req.query.name + ' at ' + req.query.address + ' is now confirmed. </b>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return console.log(error);
            }
            console.log('message envoyé')
            res.status(200)
            res.send(JSON.stringify({ message: "Message sent" }))
        });

    },
    updateInfos: function (req, res) {
        var userInfos = req.body.userInfos
        if (!userInfos) {
            res.send({
                hasErrors: true,
                message: 'User infos are missing'
            })
        } else {
            User.updateInfos(userInfos, function(err, ok) {
                if (err) {
                    res.send({
                        hasErrors: true,
                        message: 'Mongo error'
                    })
                } else {
                    res.send({
                        hasErrors: false,
                        message: 'User infos updated'
                    })
                }
            })
        }
    },
    deleteUser: function (req, res) {
        var userId = req.params.userId
        if (userId) {
            res.send({
                hasErrors: true,
                message: 'User id is missing'
            })
        } else {
            User.deleteUser(userId, function(err, ok) {
                if (err) {
                    res.send({
                        hasError: true,
                        message: 'Mongo Error'
                    })
                } else {
                    res.status(200)
                    res.send({
                        hasError: false,
                    })
                }
            })
        }
    },
    deleteHome: function (req, res) {
        var homeId = req.params.homeId
        if (homeId) {
            res.send({
                hasErrors: true,
                message: 'Home id is missing'
            })
        } else {
            Home.deleteUser(homeId, function (err, ok) {
                if (err) {
                    res.send({
                        hasError: true,
                        message: 'Mongo Error'
                    })
                } else {
                    res.status(200)
                    res.send({
                        hasError: false,
                    })
                }
            })
        }
    }
}