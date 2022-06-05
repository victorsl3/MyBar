$(document).ready(function(){
    $.ajax({
        type: 'GET',
        url: "get_bars",
        beforeSend: function() {
            
        },
        success: function (response) {
            bars = response['bars'];
            for (var i = 0; i < bars.length; i++) {
                var estado = 'Desconocido';
                if(bars[i].hasOwnProperty('opening_hours')){
                    estado = bars[i]['opening_hours']['open_now'] ? 'Abierto' : 'Cerrado';
                }
                
                $("#bars_list").append(`
                    <a href="bar/`+bars[i]['reference']+`" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">`+bars[i]['name']+`</h5>
                            <small>`+estado+`</small>
                        </div>
                        <p class="mb-1">`+bars[i]['formatted_address']+`</p>
                        <small>And some small print.</small>
                    </a>
                `);
              }
        },
        error: function (response) {
            console.log(response)
        }
    })
});