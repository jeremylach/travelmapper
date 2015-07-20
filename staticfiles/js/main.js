$(document).ready(function() {
    if($("#map").length > 0) {
        setTimeout(function(){ mapper(); },200);
    }
    $('.close_modal').bind('click', function(event){
    	event.preventDefault();
    	$('#wrap-sign').css('display','none');
    });
    $('.open_modal a').bind('click', function(event){
    	event.preventDefault();
    	$('#wrap-sign').css('display','block');
    });
	 
	 $(".share-moments").click(function() {
		  var share_url = window.location.href;
		  var query_string = window.location.search;
		  if(window.location.href.indexOf("moments") == -1) {
				var username = $("#username").html();
				share_url = "http://www.momentmapper.com/moments/"+username+query_string;
		  }
		  $(".share-url").html(share_url);
		  $('.share-popup').modal()
	 });
});

function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

