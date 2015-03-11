var moments = [{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"25.7616798","lng":"-80.19179020000001"}},{"location":{"lat":"14.613333","lng":"-90.535278"}}];
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
/*function generate_map_marker_popup(event_obj) {
    // Please lint me with JSHint.
    'use strict';
    /* JSHint directives */
    /* global idj, enquire, L */
    /* exported idj */
    /* jshint browser:true, jquery:true */
/*
    var output = "<div class='eventPopup'>";
        if (event_obj.img !=='') { output += "<img src='"+event_obj.img+"' class='eventPopup-thumb' />"; }
        output += "<div class='eventPopup-text'>";
            output += "<div class='eventPopup-details'>";
                output += "<div class='eventPopup-date'>" + event_obj.date + "</div>";
                output += "<h3 class='eventPopup-artist'>" + event_obj.artist + "</h3>";
                output += "<div class='eventPopup-location'>";
                    output += "<div class='eventPopup-cityState'>" + event_obj.location.city_state + "</div>";
                    output += "<div class='eventPopup-venue'>" + event_obj.venue + "</div>";
                output += "</div>";
            output += "</div>";
            output += "<div class='eventPopup-actions'>";
                if(event_obj.fb_link !== null) {
                    output += "<a href='"+event_obj.fb_link+"' class='btn btn-muted btn-mini'>RSVP</a>";
                }
                if(event_obj.link !== null) {
                    output += "<a href='"+event_obj.link+"' class='btn btn-muted btn-mini ticket-link' onclick='track_ticket_link(this)' data-artist-name='"+event_obj.artist+"' data-event-date='"+dateToYMD(new Date(event_obj.date))+"'>"+event_obj.link_text+"</a>";
                }
            output += "</div>";
        output += "</div>";
    output += "</div>";

    return output;
}*/

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
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return (m<=9 ? '0' + m : m) + (d <= 9 ? '0' + d : d) + y;
}

//Adds markers to map from moments
$(window).on('draw_markers',function(event) {
    if(map !== null) {

        if(map.markers_cluster === undefined) {
            ////Uncomment this line and comment the next to enable marker clustering.
            //map.markers_cluster = new L.MarkerClusterGroup({spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: false});
            map.markers_cluster = new L.layerGroup();
        } else {
            window.console.log("reset");
            reset_map();
        }

        //Currently, we only add moments to the map that have a physical location/address
        if(moments !== undefined && moments.length > 0 && map !== undefined) {

            $(moments).each(function() {
                //window.console.log(this);
                //window.console.log(this);
                if(this.location.lat !== null) {
                    //var the_icon = map.event_icon;

                    /*if(this.sold_out) {
                        the_icon = map.event_sold_out_icon;
                    }*/

                    var new_marker = new L.marker([this.location.lat, this.location.lng]/*, {icon: the_icon}*/);//.bindPopup(generate_map_marker_popup(this), {maxWidth: 415, minWidth: 280});
                    map.markers_cluster.addLayer(new_marker);
                }
            });
            if(!map.hasLayer(map.markers_cluster)) {
                map.addLayer(map.markers_cluster);
            }
            ////map.fitBounds(map.markers_cluster.getBounds());
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