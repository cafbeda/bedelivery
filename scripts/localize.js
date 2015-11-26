	var map;
	var marker;
	var infowindow;
	var watchID;
	
	v_w = screen.width;
	$(".sinal").css("margin-left", ((v_w-192)/2).toString()+"px");

    $("#localize").on("pageshow", function() 
	{
		document.addEventListener("deviceready", onDeviceReady, false);
		//for testing in Chrome browser uncomment
		onDeviceReady();
	});

	//PhoneGap is ready function
	function onDeviceReady() 
	{
		google.load("maps", "3.8", 
		{
			"callback" : map,
			other_params : "sensor=true&language=en"
		});
	}

	function map() 
	{
    	$.mobile.loading('show');

		var latlng = new google.maps.LatLng(-24.9555, -53.4552);
		var myOptions = 
		{
			zoom : 6,
			center : latlng,
			streetViewControl : true,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			zoomControl : true
		};

		//navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });
		watchID = navigator.geolocation.watchPosition(geo_success, geo_error, { maximumAge : 5000,	timeout : 15000,	enableHighAccuracy : false });
		
    	$.mobile.loading('hide');
	}

	function geo_error(error) 
	{
		//comment
		popup_ok('Seu localizador GPS não está ativo');
	}

	function geo_success(position) 
	{
		var info = ('Latitude: ' + position.coords.latitude + '<br>'
				+ 'Longitude: ' + position.coords.longitude + '<br>'
				+ 'Altitude: ' + position.coords.altitude + '<br>'
				+ 'Accuracy: ' + position.coords.accuracy + '<br>'
				+ 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br>'
				+ 'Heading: ' + position.coords.heading + '<br>'
				+ 'Speed: ' + position.coords.speed + '<br>' 
				+ 'Timestamp: ' + new Date(position.timestamp))+'<br/>';
		
    	$.ajax(
		{
			type: "GET",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			async: "true",
		    url:  sessionStorage.server+"/wolke/wolke.php?JOB=enderecos&MTD=latlng4end",
		    data: 'lat='+position.coords.latitude+'&lng='+position.coords.longitude,
		    success: function(msg) 
		    {
		    	jsonArray = $.makeArray(msg);
		    },
		    complete: function()
		    {
			    sessionStorage.gps = JSON.stringify(jsonArray);
			    $(window.document.location).attr('href','endereco.html');
		    },
		    error: function(msg) 
		    { popup_ok("PRODUTOS: Erro na pesquisa de dados"); }
		});
	}

$("#localize").on("click", "#bt_acesso", function()
{	
	$(window.document.location).attr('href','acesso.html');
}); 
	
