var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var player=require('../models/Game');
module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {



                findOrCreateUser = function(){
                    // find a user in Mongo with provided username

                    var name = req.body.name;
                    var email = req.body.email;
                    var username = req.body.username;
                    var password = req.body.password;
                    var password2 = req.body.password2;

                    // Validation
                    req.checkBody('name', 'Name is required').notEmpty();
                    req.checkBody('email', 'Email is required').notEmpty();
                    req.checkBody('email', 'Email is not valid').isEmail();
                    req.checkBody('username', 'Username is required').notEmpty();
                    req.checkBody('password', 'Password is required').notEmpty();
                    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

                    var errors = req.validationErrors();

                    if(errors) {
                        var messages=[];
                        errors.forEach(function(error){
                            messages.push(error.msg);
                        });
                        return done(null,false,req.flash('error',messages));
                    }




                    User.findOne({ 'username' :  username }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists with username: '+username);
                            return done(null, false, req.flash('error','User Already Exists'));
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.username = username;
                            newUser.password = createHash(password);
                            newUser.email = req.param('email');
                            newUser.firstName = req.param('firstName');
                            newUser.lastName = req.param('lastName');
                            req.session.user={username:username,email:email};
                            // save the user
                            var newplayer=new player.Players({name: username,
                                score:0,
                                NumberOfQuestion:0});
                            newplayer.save(function (err) {
                                if (err) console.log(err);
                                // thats it!
                            });

                            newUser.save(function(err) {
                                if (err){
                                    console.log('Error in Saving user: '+err);
                                    throw err;
                                }
                                console.log('User Registration succesful');
                                return done(null, newUser);
                            });
                        }
                    });
                };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}