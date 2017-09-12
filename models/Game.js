var mongoose = require('mongoose');
mongoose.set('debug', true);
var Schema = mongoose.Schema;

var player= new Schema({

    name: String,
    score:Number,
    NumberOfQuestion:Number
});




var room= new Schema({
   
    title: {type: String, required:true},
    NumberOfPlayer:Number,
    Admin:String,
    Password:String,
   players:[{ type: Schema.Types.ObjectId, ref: 'Players' }]
});

var Room = mongoose.model('Room', room);
var Players= mongoose.model('Players', player);
module.exports ={

    Room: Room,
    Players: Players

};