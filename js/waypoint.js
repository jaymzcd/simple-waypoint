/* TODOS:
    * Should change polyline/markers to store them in arrays, refactor
    the various collections here so it's not as wasteful
    
    * Add some sort of behavior to allow selecting a route for editing
    and marker display
    
    * Allow inserting at a position in the array for points rather than
    always at the end 
    
*/

var map;
var waypoints = new Array();
var markers = new Array();
var routes = new Array();
var colors = new Array();
var geocoder = new GClientGeocoder();
var start;
var activeRoute = 0;
var hidePoints = false;

function initialize() {
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map"));
        map.setCenter(new GLatLng(51.52, -0.08), 16);
        map.setUIToDefault();
        GEvent.addListener(map, 'click', addWaypoint);
        routes[activeRoute] = new Array();
        colors[activeRoute] = $('#color').val();
    }
}
function addWaypoint(overlay, latlng, overlaylatlng) {
    waypoints = routes[activeRoute];
    
    var wp = new GPoint(latlng.lng(), latlng.lat());
    waypoints.push(wp);
    
    var marker = new GMarker(wp, {draggable: true});
    markers.push(marker);
    
    //GEvent.addListener(marker, "mouseover", handleMarker);
    GEvent.addListener(marker, "dragend", handleMarkerDragEnd);
    
    console.log("Added new waypoint ("+waypoints.length+")");
    drawPath();
    $('.points').append('<li>['+waypoints.length+']'+'('+latlng.lat()+', '+latlng.lng()+')</li>');
  
    // Should cache the point instead of this
    var oldPoint = waypoints[waypoints.length-1];
    var oldLatLng = map.fromContainerPixelToLatLng(oldPoint);
    //console.log("Distance to new point: "+oldLatLng.distanceFrom(latlng)/1000); // in km            
    routes[activeRoute] = waypoints;
}
function clearAll() {
    waypoints = [];
    markers = new Array();
    routes = [];
    activeRoute = 0;
    routes[activeRoute] = new Array();
    map.clearOverlays();
    $('.points').html('');
}
function drawPath() {
    map.clearOverlays();
    for(var x=0; x<routes.length; x++) {
        waypoints = routes[x];
        var polyline = new GPolyline(waypoints, colors[x], 3);
        GEvent.addListener(polyline, "click", clickRoute);
        map.addOverlay(polyline);
        var routeLength = (routes[x].length);
        
        if(x==activeRoute) {
            for(var y=0; y<routeLength; y++) {
                if(!hidePoints) {
                    map.addOverlay(markers[y]);
                }
            }
        }
    }
}

function handleMarker() {
    this.openInfoWindowHtml();
}

function handleMarkerDragEnd() {
    var index = markers.indexOf(this);
    waypoints[index] = new GPoint(this.getLatLng().lng(), this.getLatLng().lat());
    console.log("Dropped pin #"+index);
    drawPath();
}

function clickRoute(e) {
    console.log("Route clicked");
}

function waypointData() {

}