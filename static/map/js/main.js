$(document).ready(function() {
    if($(".map").length > 0) {
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
       
});
