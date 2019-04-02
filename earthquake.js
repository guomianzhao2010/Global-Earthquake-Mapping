var myMap = L.map("map", {
  center: [37.77, -122.67],
  zoom: 5
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZ3VvbWlhbnpoYW8yMDEwIiwiYSI6ImNqdGs2bm16bjA4MGI0OWs2OGh4c2lvODUifQ.7Qf1OAT1zQ6r1mtSp2rFTw"
}).addTo(myMap);

var link="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data){
var eachspot= data.features;
createcircles(eachspot); 
});

function createcircles(eachspot){
  for(var i = 0; i < eachspot.length; i++)
  {
    L.circle([eachspot[i].geometry.coordinates[1], eachspot[i].geometry.coordinates[0]], {
      color: pickcolor(eachspot[i].properties.mag),
      fillColor: pickcolor(eachspot[i].properties.mag),
      fillOpacity: 1,
      radius: eachspot[i].properties.mag*10000
    })
    .bindPopup("<h3>" + eachspot[i].properties.place +"</h3><hr><p>" + new Date(eachspot[i].properties.time) + "</p>")
    .addTo(myMap);
  }
}

function pickcolor(mag){
var color="";

if (mag<1.0){
  color='#FED976';
}
else if (mag<2.0) {
  color = '#FEB24C';
}

else if (mag<3.0) {
  color = '#E31A1C';
}

else if (mag<4.0) {
  color = '#BD0026' ;
}

else{
  color='#800026' ;
}

return color;
}

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = ["less than 1   ", "1-2", "2-3", "3-4","bigger than 4   "];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + pickcolor(grades[i]) + '"></i> ' + labels[i] + '<br>' ;
    }

    return div;
};

legend.addTo(myMap);