var mongoose = require('mongoose');


var QuestionSchema = mongoose.Schema;

var question= new QuestionSchema({

    title: {type: String, required:true},
    QuestionNumber:Number,
    answers:[{
        title: String,
        TrueAnswer:Boolean

    }]

});

module.exports = mongoose.model('Question', question);


