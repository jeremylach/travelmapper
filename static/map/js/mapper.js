//var moments = [{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"43.5081323","lng":"16.440193499999964"}},{"location":{"lat":"25.7616798","lng":"-80.19179020000001"}},{"location":{"lat":"14.613333","lng":"-90.535278"}}];
var map = null;
var min_filter_date = null;
var max_filter_date = null;

var real_min_date = null;
var real_max_date = null;

//var filter_states = [];
var filtered_moments = [];

//var tag_filter = "";

if(moments !== undefined && moments.length > 0) {
    real_min_date = new Date(moments[0].fields.created);
    real_min_date = new Date(real_min_date.toDateString());
    real_max_date = new Date(moments[moments.length - 1].fields.created);
    real_max_date = new Date(real_max_date.toDateString());

    min_filter_date = real_min_date;
    max_filter_date = real_max_date;
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
    console.log(date.toLocaleString());
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

function get_id_from_tag_name(tag_name) {
    for (ctr = 0; ctr < tags.length; ctr++) {
        if (tags[ctr].label == tag_name) {
            return tags[ctr].tag_id;
        }
    }
    return "";
}

function reset_date_filters() {
console.log(real_max_date);
    $(".date-filter").dateRangeSlider("values", real_min_date, real_max_date);
}

function get_slideshow_sources() {
    var slide_sources = []
    for(var ctr = 0; ctr < filtered_moments.length; ctr++) {
            var the_moment = filtered_moments[ctr];
            if (the_moment.fields.media_type == "video") {
                slide_sources.push({src: the_moment.fields.thumbnail, video: { src: [the_moment.fields.standard_resolution] }})
            } else {
                slide_sources.push({src: the_moment.fields.standard_resolution})
            }
        }
    return slide_sources;
}


//Adds markers to map from moments
$(window).on('draw_markers',function(event) {
    //$("#slideshow").vegas("destroy");
    filtered_moments = []
    if(tag_filter !== "") {
        //var state_obj = {};
        var new_url = updateURLParameter(window.location.href, "tag", tag_filter_name);
        //window.history.pushState(filter_states, "Travel Moments", new_url);
        History.pushState({"tag_filter": tag_filter, "tag_filter_name": tag_filter_name}, "Travel Moments", new_url);
    } else {
        History.pushState({"tag_filter": "", "tag_filter_name": ""}, "Travel Moments", window.location.protocol + "//" + window.location.host + window.location.pathname)
    }

    if($("#slideshow").hasClass("vegas-container")) {
        $("#slideshow").vegas("destroy");
        $("#slideshow").hide();
        //alert("destroy");
    }

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
                //window.console.log(min_filter_date);
                //window.console.log(this_moment_date >= min_filter_date);
                //window.console.log(min_filter_date);
                //window.console.log(this);
                //make sure the moment's created date is between the current date range in view
                if(this.fields.lat !== null && this_moment_date >= min_filter_date && this_moment_date <= max_filter_date && tag_test(this)) {
                    //var the_icon = map.event_icon;

                    /*if(this.sold_out) {
                        the_icon = map.event_sold_out_icon;
                    }*/
                    filtered_moments.push(this);

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

function slideshow_play_pause() {
    var playing = $("#slideshow").vegas("playing");
    if(playing) { $(".slideshow-play-pause").addClass("glyphicon-pause").removeClass("glyphicon-play"); } else { $(".slideshow-play-pause").addClass("glyphicon-play").removeClass("glyphicon-pause"); }
}

$(document).ready(function() {

    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        //console.log(State);
        tag_filter = State.data.tag_filter;
        tag_filter_name = State.data.tag_filter_name;
        $(".tag-filter").val(tag_filter_name);
        $(window).trigger("draw_markers");
    });

    
/*window.onpopstate = function(e){
console.log(e);
    if(e.state){
        //document.getElementById("content").innerHTML = e.state.html;
        //document.title = e.state.pageTitle;
        tag_filter = e.state.tag_filter;
        tag_filter_name = e.state.tag_filter_name;
        $(window).trigger("draw_markers");
    }
};*/

/////////
    //TODO: Make sure only tags from photos within date range appear...
////////
    $( ".tag-filter" ).autocomplete({
        source: tags,
        select: function( event, ui ) {
            //console.log(ui);
            tag_filter = ui.item.tag_id;
            tag_filter_name = ui.item.label;
            $(".map-form").submit();
        }
    });

    $(".zoom-fit").click(function() {
        zoom_to_fit();
    });

    $(".map-form").submit(function(e) {
        e.preventDefault();
        //tag_filter = $(".tag-filter").val();

        reset_date_filters();
        $(window).trigger("draw_markers");

    });
    $(".tag-filter-clear").click(function() {
        tag_filter = "";
        tag_filter_name = "";
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

        /*
        // Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#myChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
        var myNewChart = new Chart(ctx).Line(data, options);
        */      

        $(".date-filter").bind("userValuesChanged", function(e, data){
            //console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
            //console.log(data.values.min.getTime() / 10000);
            min_filter_date = data.values.min;//.getTime() / 1000;
            max_filter_date = data.values.max;//.getTime() / 1000;
            console.log(data);
            console.log(min_filter_date);
            console.log(max_filter_date);

            $(window).trigger("draw_markers");
        });
    }


    $(".slideshow-start").click(function() {

        var slide_sources = get_slideshow_sources();

        //console.log(slide_sources);
        if(!$("#slideshow").hasClass("vegas-container")) {
            $('#slideshow').vegas({
                slides: slide_sources,
                preload: true,
                cover: false,
                autoplay: false,
                timer: false,
                walk: function (index, slideSettings) {
        
                    var the_moment = filtered_moments[index];
        
                    $(".slide-date").html(dateToYMD(new Date(the_moment.fields.created)));
                    $(".slide-name").html(the_moment.fields.name);
                    $(".slide-caption").html(the_moment.fields.caption);
                },
                play: function() {slideshow_play_pause();},
                pause: function() {slideshow_play_pause();}
            });
        }
        else {
            $("#slideshow").vegas('options', 'slides', slide_sources)
        }

        if (filtered_moments.length > 0) {
            $("#slideshow").show();
            window.setTimeout(function() {$("#slideshow").vegas("play");}, 5000)
        }
        
    });
    
    $(".slideshow-hide").click(function() {
        $("#slideshow").vegas("pause");        
        $("#slideshow").hide();
    });

    $(".slideshow-play-pause").click(function() {
        $("#slideshow").vegas("toggle");
    });

    $('.slideshow-previous').on('click', function () {
        $("#slideshow").vegas('previous');
    });
    
    $('.slideshow-next').on('click', function () {
        $("#slideshow").vegas('next');
    });

//dateRangeSlider("bounds", new Date(2012, 0, 1), new Date(2012, 0, 31));
});