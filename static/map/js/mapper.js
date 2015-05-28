//var moments = [{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"25.7616798","lng":"-80.19179020000001"}},{"location":{"lat":"14.613333","lng":"-90.535278"}}];
var map = null;
var min_filter_date = null;
var max_filter_date = null;
var tag_filter = "";

if(moments !== undefined && moments.length > 0) {
    var min = new Date(moments[moments.length - 1].fields.created);
    var max = new Date(moments[0].fields.created);

    var min_filter_date = new Date(min.toDateString());
    var max_filter_date = new Date(max.toDateString());
    //var min_filter_unix = min_filter_date.getTime() / 1000;
    //var max_filter_unix = max_filter_date.getTime() / 1000;
}

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
        if (moment.fields.media_type == "video") {
            //console.log("video!"); console.log(moment.pk);
            output += '<video width="150" height="150" controls><source src="'+moment.fields.standard_resolution+'" type="video/mp4"/></video>'
        }
        else {
            output += "<img src='"+moment.fields.thumbnail+"' class='' />";
        }
        
        output += "<div class=''>";
            output += "<div class='details'>";
                output += "<div class='date'>" + dateToYMD(new Date(moment.fields.created)) + "</div>";
                if (moment.fields.name !=='') {                
                    output += "<div class='name'>" + moment.fields.name + "</div>";
                }                
                if (moment.fields.caption !=='') {                
                    output += "<div class='caption'>" + moment.fields.caption + "</div>";
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

//Returns true if the given moment_obj has the global tag_filter contained in its tag list
function tag_test(moment_obj) {
    
    if(tag_filter == "") {
        return true;
    }
//console.log(moment_obj.fields.tags);
//console.log(tag_filter);
    if($.inArray(parseInt(tag_filter), moment_obj.fields.tags) !== -1) {

    //console.log("FOUND: ");
    //console.log(moment_obj);
        return true;
    }

    return false;
    //return true;
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
                var this_moment_date = new Date(this.fields.created);
                this_moment_date = new Date(this_moment_date.toDateString());
                window.console.log(min_filter_date);
                window.console.log(this_moment_date >= min_filter_date);
                window.console.log(min_filter_date);
                //window.console.log(this);
                //make sure the moment's created date is between the current date range in view
                if(this.fields.lat !== null && this_moment_date >= min_filter_date && this_moment_date <= max_filter_date && tag_test(this)) {
                    //var the_icon = map.event_icon;

                    /*if(this.sold_out) {
                        the_icon = map.event_sold_out_icon;
                    }*/

                    var new_marker = new L.marker([this.fields.lat, this.fields.lng]).bindPopup(generate_map_marker_popup(this), {maxWidth: 150, minWidth: 150});
                
                    new_marker.on("mouseover", function(e) {
                            e.target.openPopup();
                        });
                    map.markers_cluster.addLayer(new_marker);
                }
            });
            if(!map.hasLayer(map.markers_cluster)) {
                map.addLayer(map.markers_cluster);
            } 
        //    map.fitBounds(L.latLngBounds(map.markers_cluster));
            zoom_to_fit();
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
function zoom_to_fit() {
    map.fitBounds(map.markers_cluster.getBounds());
}
$(document).ready(function() {

/////////
    //TODO: Make sure only tags for the current user and tags from photos within date range appear...
////////
    $( ".tag-filter" ).autocomplete({
      source: tags
    });

    $("#zoom-fit").click(function() {
        zoom_to_fit();
    });

    $(".tag-filter-submit").click(function() {
        tag_filter = $(".tag-filter").val();
        $(window).trigger("draw_markers");
    });
    $(".tag-filter-clear").click(function() {
        tag_filter = "";
        $(".tag-filter").val(tag_filter);
        $(window).trigger("draw_markers");
    });

    if(moments !== undefined && moments.length > 0) {
        
        //var min = new Date(moments[moments.length - 1].fields.created);
        //var max = new Date(moments[0].fields.created);

        //var min_date = new Date(min.toDateString());
        //var max_date = new Date(max.toDateString());
//console.log(new Date(min));        
//console.log(new Date(max).getTime());

        $(".date-filter").dateRangeSlider({
            bounds:{
                min: min_filter_date,
                max: max_filter_date
            },
            defaultValues:{
                min: min_filter_date,
                max: max_filter_date
            },
            step:{
                days: 1
            }
        });

        $(".date-filter").bind("valuesChanged", function(e, data){
            //console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
            //console.log(data.values.min.getTime() / 10000);
            min_filter_date = data.values.min;//.getTime() / 1000;
            max_filter_date = data.values.max;//.getTime() / 1000;

            console.log(min_filter_date);
            console.log(max_filter_date);

            $(window).trigger("draw_markers");
        });
    }
//dateRangeSlider("bounds", new Date(2012, 0, 1), new Date(2012, 0, 31));
});