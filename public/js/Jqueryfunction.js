function formclick() {
    {

        $.ajax({
            url: '/Lobby',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({name: $('#name').val(), password: $('#pass').val()}),
            success: function (response) {

                if(response)
                {
                    alert("room already exist");
                    location.reload();
                }
                else
                {

                    location.replace("/GameRoom");
                }
            }
        });
    }
}


function join(name)
{




    $.ajax({
        url: '/Lobby/'+name,
        method: 'GET',
        contentType: 'application/json',

        success: function (response) {

            if(response) {
                var pass = prompt("Please enter password", "*****");

                $.ajax({
                    url: '/Lobby/' + pass,
                    contentType: 'application/json',

                    success: function (data) {

                        
                    }
                });
            }
            else
            {

                location.replace("/GameRoom");
            }
        }
    });


}