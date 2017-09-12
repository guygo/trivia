
index=0;


socket = io.connect();

$(document).ready(function(){


    $('#start').click(function getfirst() {

        socket.emit('start');
        next(index)

    });
    socket.on('timer', function (data) {
        $('#counter').html(data.Min+":"+data.Sec);
    });

    
});


function simple(answer) {
    socket.emit('sendanswer',{Room:'room1' ,Ans:answer});
    var x=answer;
    $.ajax({
        url: '/Trivia',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({answer:x,number:index-1}),
        success: function(data) {


            $('#score').text(data.score);

            $("#question").empty();
            $("#answer").empty();
            next(data.num);
        }
    });
}
function next(numberofquestion) {
    $.ajax({
        url: '/Trivia/'+numberofquestion,
        contentType: 'application/json',
        success: function (response) {

            index++;
            var title=response.title;
            var answers=response.answers;

            $('#start').hide();

            $("#question").append("<div class='questiontitle'>"+title+"</div>");

            answers.forEach(function(item,index){


                $("#answer").append("<button id='"+"btnans"+index+"' class='btn btn-info mybtn col-lg-4' style='button:hover { background: #CF4647; }' >"+item+"</button>");

                $( "#btnans"+index ).bind( "click", function() {
                    simple(item);
                });
            });

            $(".mybtn").animate({left:0},2000);

        },
        error: function (response) {
            console.log("failed");
        }
    });

}
