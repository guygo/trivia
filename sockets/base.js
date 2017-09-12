
var users = [];
var rooms=[];
var game=require('../models/Game');
module.exports=function(io)
{



    io.sockets.on('connection', function (socket) {
        var user = addUser();
       var countdown = 3000;
        var seconds = (countdown) % 60;
       var  minutes = parseInt( countdown / 60 ) % 60;
        socket.on('start',function(){

                setInterval(function() {
        
                    seconds--;
                    if (seconds > 0) {
                    } else {
                        seconds = 60;
                        minutes--;
                    }
                    io.sockets.emit('timer', {Min: minutes,Sec:seconds});
                }, 1000);
        });
    });


    var addUser = function() {
        var user = {
            name: Moniker.choose(),
            clicks: 0
        }
        users.push(user);
        updateUsers();
        return user;
    }


    io.sockets.on('connection',function(socket){

        socket.on('join', function (room) {

            var found = $.inArray('specialword', categories) > -1;
            
            socket.join(room);
            


        });
        socket.on('sendanswer',function(data){
    
        


        });

    });
}
