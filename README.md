# MeasureTools-GoogleMaps
It is a JavaScript library implementing lasso tool and straight line drawing based on Google Maps JavaScript API. Users can draw free-hand area with lasso tool or straight line with measure tool, which return an array containing all coordinates.

measureTool library usage:

use it inside initMap() after the declaration of map object:

measureTool.config({
  map: map,                          //your map object
  measure_button: "measure_button",  //id of your measure button
  lasso_button: "lasso_button",      //id of your lasso button
  polylineConfig:null,               //your Polyline specification, set null if you want default setting
  polygonConfig:null                 //your Polygon specification, set null if you want default setting
  onLineEnd: function(coords) {
    console.log(coords);             //coords is the coorditates array when users finish drawing, set null to disable
  },
  onLineMove: function(coords) {
    console.log(coords);             //coords is the coorditates array when users keep drawing, use this if you want real-time distance calculations, set null to disable
  }
});

documentation about PolylineOptions: https://developers.google.com/maps/documentation/javascript/reference#PolylineOptions

default lasso config:
{
  strokeColor: '#FF0000',
  strokeOpacity: 0.3,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.25
}