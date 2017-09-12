
var Question=require('../models/Quetion');



var mongoose = require('mongoose');
mongoose.connect('localhost:27017/TriviaDB');
var fs = require('fs');
var obj=[];
fs.readFile('/Trivia/Quesitonseed/data.json', 'utf8', function (err, data) {
    if (err) throw err;

    obj=JSON.parse(data);

  // console.log(obj[0].question);
    
    var quetions=[];
    var answers=[];
    for(var i=0 ;i<obj.length;i++)
    {
        
        
        
            answers.push({title:obj[i].answers[0],TrueAnswer:true });
            for(var j=1 ;j<obj[i].answers.length;j++)
            {
                answers.push({title:obj[i].answers[j],TrueAnswer:false });
            }
              var x= obj[i].question; 

            quetions.push(new Question({title:x,QuestionNumber:i,answers:answers}));
            answers=[];
    
        }
        function seed(){
            var done=0;
    
          
            for(var i=0;i<quetions.length;i++){
                quetions[i].save(function(err,result){
                   done++;
                    if(done===quetions.length)
                        exit();

                });

            }
            function exit(){
               
                mongoose.disconnect();
            }
        }

    seed();
    
});


