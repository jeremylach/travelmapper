//var moments = [{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"25.7616798","lng":"-80.19179020000001"}},{"location":{"lat":"14.613333","lng":"-90.535278"}}];
var map = null;
function mapper() {

    // create a map in the "map" div, set the view to the USA.
    //We check here if the map html is on the page or not.
    // If yes, (map was filtered) then we do not need to recreate the map, only redraw the markers.
    // If no (new page load via ajax) then we create a new map.
    if($("#map .leaflet-map-pane").length === 0) {

        map = L.map('map', {center: [35, -33], zoom: 2});//, layers: [map_style]/*, minZoom: 2*/});//.setView([37, -96], 4);

        /*var map_style = L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
            attribution: '',
            key: "eebc37434ed84128a3212bca58739b4e",
            styleId: 113529,
            maxZoom: 19
        }).addTo(map);
        */

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Jeremy Lach'
        }).addTo(map);

        var MapIcon = L.DivIcon.extend({
            options:  {
                iconSize: [40,41],
                iconAnchor: [0, 41],
                popupAnchor: [0, -23],
                className: "map-icon"
            }
        });

        var SoldOutIcon = MapIcon.extend({
            options: {
                className: "sold-out"
            }
        });

        map.event_icon = new MapIcon();

        map.event_sold_out_icon = new SoldOutIcon();

        //Clears map and draws markers based on moments
        setTimeout(function(){ $(window).trigger("draw_markers");},200);

    } else {
        $(window).trigger("draw_markers");
    }
}


//TODO: Create this markup the jquery way.
function generate_map_marker_popup(moment) {
    
    var output = "<div class='popup'>";
        
        output += "<img src='"+moment.fields.thumbnail+"' class='' />";
        
        output += "<div class=''>";
            output += "<div class='details'>";
                output += "<div class='date'>" + dateToYMD(new Date(moment.fields.created)) + "</div>";
                if (moment.fields.name !=='') {                
                    output += "<h3 class='name'>" + moment.fields.name + "</h3>";
                }
            output += "</div>";
            output += "<div class='popup-actions'>";
                if(moment.link !== null) {
                    output += "<a href='"+moment.fields.link+"' target='_blank' class='btn btn-muted btn-mini'>View on Instagram</a>";
                }
            output += "</div>";
        output += "</div>";
    output += "</div>";

    return output;
}

function reset_map(results) {
    // Please lint me with JSHint.
    'use strict';
    /* JSHint directives */
    /* global idj, enquire, L */
    /* exported idj */
    /* jshint browser:true, jquery:true */

    if(map !== undefined) {
        map.markers_cluster.clearLayers();
    }

}

function remove_map() {
    'use strict';
    /* JSHint directives */
    /* global idj, enquire, L */
    /* exported idj */
    /* jshint browser:true, jquery:true */
    alert("remove");
    if(map !== undefined) {
        map = undefined;
    }
}

function dateToYMD(date) {
    //var d = date.getDate();
    //var m = date.getMonth() + 1;
    //var y = date.getFullYear();
    //return (m<=9 ? '0' + m : m) + (d <= 9 ? '0' + d : d) + y;
    return date.toLocaleString();
}

//Adds markers to map from moments
$(window).on('draw_markers',function(event) {
    if(map !== null) {

        if(map.markers_cluster === undefined) {
            ////Uncomment this line and comment the next to enable marker clustering.
            map.markers_cluster = new L.MarkerClusterGroup({spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: true});
            //map.markers_cluster = new L.layerGroup();
        } else {
            window.console.log("reset");
            reset_map();
        }

        //Currently, we only add moments to the map that have a physical location/address
        if(moments !== undefined && moments.length > 0 && map !== undefined) {

            $(moments).each(function() {
                //window.console.log(this);
                //window.console.log(this);
                if(this.fields.lat !== null) {
                    //var the_icon = map.event_icon;

                    /*if(this.sold_out) {
                        the_icon = map.event_sold_out_icon;
                    }*/

                    var new_marker = new L.marker([this.fields.lat, this.fields.lng]).bindPopup(generate_map_marker_popup(this));/*, {icon: the_icon}*///);//.bindPopup(generate_map_marker_popup(this), {maxWidth: 415, minWidth: 280});
                    map.markers_cluster.addLayer(new_marker);
                }
            });
            if(!map.hasLayer(map.markers_cluster)) {
                map.addLayer(map.markers_cluster);
            } 
        //    map.fitBounds(L.latLngBounds(map.markers_cluster));
            map.fitBounds(map.markers_cluster.getBounds());
        } else {
            map.setView([35, -33], 2);
        }

        /*map.markers_cluster.on('clusterclick', function (a) {
            a.layer.spiderfy();
        });*/

        /*map.markers_cluster.on('click', function (a) {
            $(".leaflet-marker-icon").removeClass("expanded");
            $(a.originalEvent.target).addClass("expanded");
        });*/

        /*map.on("click", function(e) {
            $(".leaflet-marker-icon").removeClass("expanded");
        });*/
    } else {
        reset_map(false);
    }
});

$(document).ready(function() {
});