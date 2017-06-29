/*
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

*/
(function () {
  var map;
  var startX = 0;
  var startY = 0;
  var endX = 0;
  var endY = 0;
  var hasOrigin = false;
  var isTouched = false;
  var line;
  var lineCoords;
  var lasso;
  var lassoCoords = [];
  var lineActive = false;
  var lassoActive = false;
  var el = document.body;
  var onLineEnd;
  var onLineMove;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);

  var api = {
    config: function (config) {
      map = config.map;
      line = new google.maps.Polyline({
        map: map
      });
      if(config.polylineConfig){
        line.setOptions(config.polylineConfig);
      }
      else{
        line.setOptions({ //default line config
          geodesic: true,
          strokeOpacity: 0,
          icons: [{
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              scale: 1
            },
            offset: '0',
            repeat: '5px'
          }]
        })
      }
      lasso = new google.maps.Polygon({
        map: map
      });
      if(config.polygonConfig){
        lasso.setOptions(config.polygonConfig);
      }
      else{
        lasso.setOptions({ //default lasso config
          strokeColor: '#FF0000',
          strokeOpacity: 0.3,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.25
        })
      }
      var measure_button = document.getElementById(config.measure_button);
      measure_button.addEventListener("click", drawLine, false);
      var lasso_button = document.getElementById(config.lasso_button);
      lasso_button.addEventListener("click", drawLasso, false);
      onLineEnd = config.onLineEnd;
      onLineMove = config.onLineMove;
    },
  }

  function handleMoveLine (event) {
    if(lineActive && !hasOrigin && isTouched){
      startX = endX = event.latLng.lat();
      startY = endY = event.latLng.lng();
      console.log("Setting origin: " + startX + ", " + startY);
      hasOrigin = true;
    }
    else if(lineActive && hasOrigin){
      endX = event.latLng.lat();
      endY = event.latLng.lng();
      lineCoords = [
        {lat:startX, lng:startY},
        {lat:endX, lng:endY}
      ];
      line.setPath(lineCoords);
      if(onLineMove)
      onLineMove(lineCoords);
      console.log("Update line at: " + startX + ", " + startY + ", " + endX + ", " + endY)
    }
  }

  function handleMoveLasso (event) {
    if(lassoActive && !hasOrigin && isTouched){
      lassoCoords.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
      hasOrigin = true;
    }
    else if(lassoActive && hasOrigin){
      lassoCoords.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
      lasso.setPath(lassoCoords);
    }
  }

  function handleStart (evt) {
    if((lassoActive || lineActive) && !hasOrigin){
      isTouched = true;
      console.log("Origin touch event detected");
    }
    else{
      //todo: draw polugons with measure tool
    }
  }

  function handleEnd (evt){
    if(lineActive){
      console.log("The final line: ");
      if(onLineEnd)
      onLineEnd(lineCoords);
      clearAll();
    }

    if(lassoActive){
      lassoCoords.push(lassoCoords[0])
      console.log("The final area: ");
      if(onLineEnd)
      onLineEnd(lineCoords);
      clearAll();
    }
  }

  function drawLine(){
    map.addListener('mousemove', handleMoveLine);
    lineActive = !lineActive;
    console.log("Draw a line: " + lineActive);
    map.setOptions({draggable: !lineActive});
  }

  function drawLasso(){
    map.addListener('mousemove', handleMoveLasso);
    lassoActive = !lassoActive;
    console.log("Draw free form area: " + lassoActive);
    map.setOptions({draggable: !lassoActive});
  }

  function clearAll(){ //called after finishing drawing
    startX = StartY = endX = endY = 0;
    lineActive = false;
    lassoActive = false;
    hasOrigin = false;
    isTouched = false;
    lineCoords = lassoCoords = [];
    map.setOptions({draggable: true});
    console.log("clearAll is called");
  }

  this.measureTool = api;
})();
