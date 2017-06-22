
var map;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var hasOrigin = false;
var isTouched = false;
var line;
var lineCoords;
var lineSymbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  scale: 1
};
var lasso;
var lassoCoords = [];
var lineActive = false;
var lassoActive = false;
//todo: reduce global virables as many as possible

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 34, lng: -40.605}
  });
  var el = document.body;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);

  line = new google.maps.Polyline({
    geodesic: true,
    strokeOpacity: 0,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '5px'
    }],
    map: map
  });

  lasso = new google.maps.Polygon({
    paths: lassoCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.25,
    map: map
  });
}

function handleMoveLine (event) {
  if(lineActive && !hasOrigin && isTouched){
    startX = endX = event.latLng.lat();
    startY = endY = event.latLng.lng(); //could be improved
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
    console.log("Update line at: " + startX + ", " + startY + ", " + endX + ", " + endY)
  }
}

function handleMoveLasso (event) {
  if(lassoActive && !hasOrigin && isTouched){
    lassoCoords.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
    lassoCoords.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
    hasOrigin = true;
  }
  else if(lassoActive && hasOrigin){
    var temp = lassoCoords.pop();
    lassoCoords.push({lat: event.latLng.lat(), lng: event.latLng.lng()});
    lassoCoords.push(temp); //could be done in handleEnd() to save cost
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
    console.log(lineCoords) // object passed to calculateDistance();
    clearAll();
  }

  if(lassoActive){
    console.log("The final area: ");
    console.log(lassoCoords) // object passed to generateReport();
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
