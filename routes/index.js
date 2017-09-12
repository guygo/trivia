  var express = require('express');
  var router = express.Router();
  var question=require('../models/question');

  var game=require('../models/Game');
  var passwordHash = require('password-hash');

  
  /* GET home page. */
  router.get('/', function(req, res, next) {
      res.render('signin', { message: req.flash('message') });
  });

  var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
      return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
  }

  router.get('/Trivia',isAuthenticated, function(req, res,next){

    res.render('index');

  });

  router.post('/Trivia', function(req, res,next){

    var data=req.body;

    question.findOne({QuestionNumber: data.number}, function (error, question) {
      if (error) return next(error);
      if (!question) return next(new Error('Nothing is found'));

      var ans= question.answers;

      var user=req.user.username;
      game.Players.findOne({'name':user}).exec(function (err,player) {
        var index=-1;
        for(var i=0;i<ans.length;i++) {
          if (ans[i].title === data.answer) {
            index=i;
            break;
          }
        }

        

        if(index==-1) {
          res.json({score:player.score,num:player.NumberOfQuestion});
          return;
        }
        else {
          var x=index;
          var a=question.answers;
          if (question.answers[index].TrueAnswer) {
            player.score += 20;
            player.NumberOfQuestion++;
            player.save(function (err) {
              if (err) console.log(err);
            });
            res.json({score:player.score,num:player.NumberOfQuestion});
          }
          else
            res.json({score:player.score,num:player.NumberOfQuestion});
        }
      });
    });

  });

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  router.get('/Trivia/:id', function(req, res){

    var x=req.params.id;

    question.findOne({QuestionNumber: req.params.id}, function (error, question){
      if (error) return next(error);
      if (!question) return next(new Error('Nothing is found'));

      var q={title:String,QuestionNumber:Number,answers:[]};

      q.title=question.title;
      q.QuestionNumber=question.QuestionNumber;
      for(var i=0;i<question.answers.length;i++)
      {
        q.answers.push(question.answers[i].title);
      }
      shuffle(q.answers);
      res.send(q);

    });

  });

  router.get('/menu',isAuthenticated,function (req,res,next) {

    res.render('menu');
  })

  router.get('/profile', isAuthenticated,function(req, res, next) {


    var user=req.session.user;

    res.render('profile',{username:user.username,email:user.email});
  });
  router.get('/loggedout', isAuthenticated,function(req, res, next) {
    req.logout();

    res.redirect('/');
  });
  module.exports = function(passport){

    /* GET login page. */
    router.get('/signin', function(req, res) {
      // Display the Login page with any flash message, if any
      res.render('signin', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/signin', passport.authenticate('login', {
      successRedirect: '/menu',
      failureRedirect: '/signin',
      failureFlash : true
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res){
      var messages=req.flash('error');
      res.render('signup',{messages:messages,hasErrors:messages.length>0});
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/menu',
      failureRedirect: '/signup',
      failureFlash : true
    }));

    /* GET Home Page */
    router.get('/', isAuthenticated, function(req, res){
      res.render('/', { user: req.user });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    return router;
  }
  function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){

      return next();
    } else {
      //req.flash('error_msg','You are not logged in');
      res.redirect('/signin');
    }
  }

  router.get('/Lobby',isAuthenticated,function (req,res,next) {



 //find all rooms,rooms array of objects
      game.Room.find(function(err, rooms ){


          var temprooms=[];



          for(var i=0;i<rooms.length;i++){
            var obj={};
            obj.Name=rooms[i].title;
            obj.Admin=rooms[i].Admin;
            obj.PlayersNum=rooms[i].NumberOfPlayer;
           temprooms.push(obj);

          }

          res.render('lobby',{rooms:temprooms});
      });

  });
  router.post('/Lobby',isAuthenticated,function (req,res,next){




    var hashedPassword = passwordHash.generate(req.body.password);


    var name=req.body.name;
    var user=req.user.username;
   
    game.Room.findOne({'title':name}).exec(function (err,data) {

      if (err){
        console.log('Error in SignUp: '+err);

      }
        if(data){
          res.send(true);
          return;
        }
      var room=new game.Room({

        title: req.body.name,

        Admin:req.user.username,
        Password:hashedPassword,
        NumberOfPlayer:1

      });
      game.Players.findOne({'name':user}).exec(function (err,player) {
        room.players.push(player);
        room.save(function (err) {
          if (err) console.log(err);
          // thats it!
        });
      });

      room.save(function (err) {
        if (err) console.log(err);
        // thats it!
      });
      res.send(false);
    });

  });



  router.get('/GameRoom',isAuthenticated,function (req,res,next)

  {
    res.render('GameRoom');

  });















 
