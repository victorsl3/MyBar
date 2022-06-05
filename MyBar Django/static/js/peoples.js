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

$(document).ready(function(){
    var map = L.map('map').setView([40.4195959, -3.698879], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
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
        url: "get_peoples",
        beforeSend: function() {
            
        },
        success: function (response) {
            console.log(response);
            for (var i = 0; i < response['data'].length; i++) {
                circle = new L.circle([response['data'][i]['LATITUD'], response['data'][i]['LONGITUD']], {color: getColor(response['data'][i]['PEATONES']), fillOpacity: 0.2, radius: 200}).addTo(map);
                circle.bindPopup('<p>'+response['data'][i]['NOMBRE_VIAL']+'</p><p>Tipo de calle: '+response['data'][i]['OBSERVACIONES_DIRECCION']+'</p><p>DISTRITO: '+response['data'][i]['DISTRITO']+'</p><p>PEATONES ESTIMADOS: '+parseInt(response['data'][i]['PEATONES'])+'</p>');
            }
        },
        error: function (response) {
            console.log(response)
        }
    })
});