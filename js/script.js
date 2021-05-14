var myMap, preview;
var clicks = 0; 
var btnzoek = document.getElementById('btn-zoek');

document.getElementsByTagName('body').onload = getAPIdata();

function getClicks() {
    clicks += 1;
    console.log(clicks);
    return clicks;
}
function getLat() {
    var latitude = 0;
    var slocation = document.getElementById('slocation');
    var coords = document.getElementById('coords');
    var btnreload = document.getElementById('btn-reload');
    var plaats = document.getElementById('plaats')
    
    btnreload.style.visibility = "hidden";
    
    if (clicks == 0) {
        latitude = 52.058095;
        slocation.innerHTML = 'Landing space 1: Moerkapelle';
        coords.innerHTML = '52.058095 ; 4.571625';
    }
    else if (clicks == 1) {
        latitude = 51.381260;
        slocation.innerHTML = 'Landing space 2: Sehlis ';
        coords.innerHTML = '51.381260 ; 12.557404';
    }
    else if (clicks == 2) {
        latitude = 51.090863;
        slocation.innerHTML = 'Landing space 3: Opatowice';
        coords.innerHTML = '51.090863 ; 17.134035';  
    }
    else if (clicks => 3) {
        latitude = 0;
        slocation.innerHTML = 'Error! Refresh for new locations.';
        btnreload.style.visibility = "visible";
    }
    return latitude;
}
function getLng() {
    var longitude = 0;

    if (clicks == 0){
        longitude = 4.571625;
    }
    else if (clicks == 1) {
        longitude = 12.557404;
    }
    else if (clicks == 2) {
        longitude = 17.134035;
    }
    else if (clicks == 3) {
        longitude = 0;
    }
    
    return longitude;
}
function initMap() {
	var myStyles =[
		 {
		 	featureType: "poi",
		 	elementType: "labels",
		 	stylers: [{ visibility: "off" }]
		 },
		 {
		 	featureType: 'transit',
		 	elementType: 'labels',
		 	stylers: [{visibility: 'off'}]
		 }
	]; 
	var mapOptions = {
		center: {
			lat: getLat(), 
			lng: getLng()
		},
		zoom: 15,
		clickableIcons: false,
		styles: myStyles,
        zoomControl: true,
		mapTypeControl: false,
		streetViewControl: false,
		scaleControl: false,
	};
    var mapOptions2 = {
		center: {
			lat: getLat(), 
			lng: getLng()
		},
		zoom: 15,
		clickableIcons: false,
		styles: myStyles,
        draggable: false,
        scrollwheel: false,
        disableDefaultUI: true,
        mapTypeId: 'satellite'
	};
	myMap = new google.maps.Map(document.getElementById('maps'), mapOptions);
    

    
    var locatieMarker = new google.maps.Marker({
		position: {
			lat: getLat(), 
			lng: getLng(),
		},
		map: myMap,
		title: 'Landingsplek'
	});
	
}

function getAPIdata() {
	var url = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
    var lat = getLat();
    var lon = getLng();
	var apiKey ='1f37afaf7e36cf6e4973b9510e380e57';
    
	var request = url + lat + '&lon=' + lon + '&appid=' + apiKey;
	fetch(request)
	.then(function(response) {
		if(!response.ok) throw Error(response.statusText);
		return response.json();
	})
	.then(function(response) {
		console.log(response);
		onAPISucces(response);
	})
	.catch(function (error) {
		console.error('Request failed', error);
	});
}
function clearData() {
   document.getElementById('weather').innerHTML = '';
'';
}
function onAPISucces(response) {
	var weatherList = response.daily;
	var weatherBox = document.getElementById('weather');
    var temp = Math.floor(weatherList[1].temp.day - 273.15);
    var clouds = weatherList[1].clouds;
    var weathercomment = document.getElementById('weathercomment');
    var weathercomment2 = document.getElementById('weathercomment2');
    var comment = document.getElementById('comment');
    
    
    if (temp > 4) {
        if (clouds < 50){
            comment.innerHTML = 'Fit for landing.';
        }
        else {
            comment.innerHTML = 'Fit for landing.';
            comment.style.color = "#008000";
        }
    }
    else {
        if (clouds < 50) {
            comment.innerHTML = 'Fit for landing.';
            comment.style.color = "#008000";
        }
        else {
            comment.innerHTML = 'Given the circumstances, it is not safe to land here.';
            comment.style.color = "#ff0000";
        }
    }
        
	for(var i=0; i< weatherList.length; i++){
		var dateTime = new Date(weatherList[i].dt*1000);
		var date = formDate(dateTime);
        var cloud = weatherList[i].clouds;
		var temp = Math.floor(weatherList[i].temp.day - 273.15);
		var iconUrl = 'http://openweathermap.org/img/w/'+weatherList[i].weather[0].icon+'.png';

		forecastMessage =  '<div class="forecastMoment">';
		forecastMessage +=   '<div class="date"> '+date+' </div>';
        forecastMessage +=	 '<div class="cloud"> '+cloud+'&#37; wolken </div>';
		forecastMessage +=	 '<div class="temp"> '+temp+'&#176;C </div>';

		weatherBox.innerHTML += forecastMessage;
	}
}
function updateUIError() {
	var weatherBox = document.getElementById('weather');
	weatherBox.className = 'hidden'; 
}
function formDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1;
	return day +'/'+ month;
}