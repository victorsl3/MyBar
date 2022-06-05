var map = L.map("map");

$(document).ready(function(){
    function getColor(d) {
        return d > 1000 ? '#800026' :
               d > 500  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 20   ? '#FEB24C' :
               d > 10   ? '#FED976' :
                          '#FFEDA0';
    }
    
    
    var OpenStreetMap_Mapnik = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 25,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);
    
    map.locate({setView: true, maxZoom: 25});
    
    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map).bindPopup("Tu estas aqui, con " + radius + " metros de aproximacion").openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }
    
    function onLocationError(e) {
        alert(e.message);
    }
    
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    
    
    
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);

    $.ajax({
        type: 'GET',
        url: "peoples/get_peoples",
        beforeSend: function() {
            
        },
        success: function (response) {
            console.log(response);
            for (var i = 0; i < response['data'].length; i++) {
                circle = new L.circle([response['data'][i]['LATITUD'], response['data'][i]['LONGITUD']], {color: getColor(response['data'][i]['PEATONES']), fillOpacity: 0.2, radius: 400}).addTo(map);
                circle.bindPopup('<p>'+response['data'][i]['NOMBRE_VIAL']+'</p><p>Tipo de calle: '+response['data'][i]['OBSERVACIONES_DIRECCION']+'</p><p>DISTRITO: '+response['data'][i]['DISTRITO']+'</p><p>PEATONES ESTIMADOS: '+response['data'][i]['PEATONES']+'</p>');
            }
        },
        error: function (response) {
            console.log(response)
        }
    })
});


$("#search_bars").click(function () {
    var iconoBase = L.Icon.extend({
        options: {
            iconSize:     [45, 45],
            iconAnchor:   [45, 45],
            popupAnchor:  [-20, -45]
        }
    });
    
    var folder = "static/";
    var iconoCerveza1 = new iconoBase({iconUrl: folder+'img/cerveza.png'});  
    var iconoCerveza2 = new iconoBase({iconUrl: folder+'img/closed.png'});  
    var iconoCerveza3 = new iconoBase({iconUrl: folder+'img/crowded.png'});  
    
    $.ajax({
        type: 'GET',
        url: "bars/get_bars",
        success: function (response) {
            console.log(response);
            bars = response['bars'];
            for (var i = 0; i < bars.length; i++) {
                var estado = 'Desconocido';
                if(bars[i].hasOwnProperty('opening_hours')){
                    estado = bars[i]['opening_hours']['open_now'] ? 'Abierto' : 'Cerrado';
                }

                var icon = iconoCerveza1;
                if(response['capacities'][i]['capacity'] == 'Low'){
                    icon = iconoCerveza2;
                }else if(response['capacities'][i]['capacity'] == 'Above average'){
                    icon = iconoCerveza3;
                }
                marker = new L.marker([bars[i]['geometry']['location']['lat'], bars[i]['geometry']['location']['lng']], {icon: icon})
                    .bindPopup(`
                        <h3>`+bars[i]['name']+`</h3>
                        <small>Dirección: `+bars[i]['formatted_address']+`</small><br>
                        <small>Actualmente: `+estado+`</small><br>
                        <small>`+response['capacities'][i]['capacity']+`</small><br>
                        <button><a href="bars/bar/`+bars[i]['reference']+`">Ver detalles</a></button>
                    `)
                    .addTo(map);
              }
        },
        error: function (response) {
            console.log(response)
        }
    })
});