var	dataLocations = [
   	                 {
   	                	 position: {lat: 40.438169, lng: -3.687462},
   	                	 title: 'Restaurant Trujillo',
   	                	 tags: ['restaurant']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436630, lng: -3.690134},
   	                	 title: 'Hotel InterContinetal ',
   	                	 tags: ['hotel']
   	                 },
   	                 {
   	                	 position:  {lat:    40.436401, lng:  -3.685724},
   	                	 title: 'Hotel Suites Barrio de Salamanca ',
   	                	 tags: ['hotel']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436467, lng: -3.683814},
   	                	 title: 'Restaurant 29 Fanegas ',
   	                	 tags: ['restaurant']
   	                 },
   	                 {
   	                	 position:  {lat: 40.436254, lng: -3.685756},
   	                	 title: 'Cinco Jotas Serrano ',
   	                	 tags: ['restaurant']
   	                 },
   	                 ];


var map;
var newWindow;
/* function that load the map 
 * 
 */
function initialize() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 40.437214, lng: -3.685638},
		zoom: 16
	});
	ko.applyBindings(new NeighborhoodModel());


}

/* Function called to intialized the name of location
 * 
 */
function buildLocation(nameLocation,lat,lng){
	var self = this;

	self.nameLocation = nameLocation;
	self.lat = lat;
	self.lng = lng;
	self.clicked = 0;
}
/* function that load the locations list that the user searches
 * 
 */	 
function  NeighborhoodModel() {
	var self = this;
	self.isFocused = ko.observable();
	self.listLocatons = ko.observableArray([]);
	self.searchLocation = ko.observable("");
	self.locations = ko.observableArray([]);
	self.nameLocation = ko.observable(" ");

	self.openInfoWindow = function(i103) {

		google.maps.event.addListener(self.markers()[i103], "click", function () {
			for (var i106 = 0; i106 < self.markers().length; i106++) {
				self.markers()[i106].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
			}
			self.markers()[i103].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
			var latitude = this.position.lat();
			var longitude = this.position.lng();
			var title = this.title;
			self.AdditionalInformation(title,self.fecha,latitude,longitude,self.markers()[i103]);
		}); //end addListener
	};





	/* Function that fill location list
	 * 
	 */
	self.loadList = function() {
		self.locations.removeAll();
		for (var i=0; i<dataLocations.length; i++) {
			self.locations.push(new buildLocation(dataLocations[i].title,dataLocations[i].position.lat, dataLocations[i].position.lng));
		}
	};
	/*function than load of FourSquare additional information
	 * 
	 */
	self.AdditionalInformation = function(location,fecha,coordenatelat,coordenatelong,marker){
		var errorTimeout = window.setTimeout(function() {
			alert('Oops!  There was a problem retrieving fourSquare data.  Please try again later.');
		}, 5000);


		var client_id = 'HKOUXWROVI3L5ZYXQS0ZJQKFZMJMRAJ1NRNZDPZJMJJDGUS5';
		var client_secret = 'FMMYWKWK43Y1ZSAFIS25JU21UZ5WE2Y4CRNY1HTZDXLO4DIM';
		var url_foursquare =  'https://api.foursquare.com/v2/venues/search?client_id=';
		var url_foursquare_1 = url_foursquare + client_id + '&client_secret='+client_secret+'&v='+fecha+'&ll='+coordenatelat+","+coordenatelong+'&query='+location;
		var settings =  {
				url: url_foursquare_1,
				cache: true,
				dataType: 'jsonp',
				async: true,
				success: function(data) {

					var venues1 = data.response.venues;
					var j = 0;
					self.html = '<table border="0">';

					if (venues1.length !== 0){
						window.clearTimeout(errorTimeout);

						while (j < 1 && j < venues1.length) {
							j++;
							self.html += '<tr>';
							self.html += '<td>'+venues1[0].name + '</td>';
							self.html += '</tr>';
							self.html += '<tr>';
							var address = venues1[0].location.address;
							console.log(" address "+address);
							if (typeof(address) == "undefined") {
								var addressName = "not found";
							}
							else {
								 addressName = address;
							}
							self.html += '<td>'+addressName + '</td>';
							self.html += '</tr>';
						}
						self.html += '</table>';
						// Is the infowindow currently defined?
						if (self.infowindow !== undefined) {
							self.infowindow.close(); // close the infowindow
						}
						self.infowindow = new google.maps.InfoWindow({
							content: self.html	
						});	

						self.infowindow.open(map, marker);
					}


				},
				error: function() {
					console.log("error");
				}
		};

		$.ajax(settings);
	};

	/*When the user click in the search bar, I load the list with all the locations
	 * and I initialize the markers
	 */
	self.reLoadList = function(){
		if (typeof map !== 'undefined') {
			self.loadList();
			self.searcherLocations();
			self.initializeMarks();

		}
	};
	self.openMark = function(nameLocation) {

		nameLocation.clicked = 1;

		for (var i = 0; i < self.markersEnabled().length; i++) {
			self.markersEnabled()[i].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
		}


		for (var i = 0; i < self.markersEnabled().length; i++){


			if (nameLocation.nameLocation === self.markersEnabled()[i].title) {
				self.markersEnabled()[i].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
				var latitude = self.markersEnabled()[i].position.lat();
				var longitude = self.markersEnabled()[i].position.lng();
				var title = self.markersEnabled()[i].title;
				self.fecha = '20151001';
				self.AdditionalInformation(title,self.fecha,latitude,longitude,self.markersEnabled()[i]);

			}
		}

	}; 

	self.loadList();


	/* This function initialized the markers. Whe it searches a text in the search bar. Markers
	 * are updated
	 */
	self.initializeMarks = function () {
		for (var i = 0; i < self.markersEnabled().length;i++){
			self.markersEnabled()[i].setVisible(false);
		}
		for ( var i = 0; i < self.markersEnabled().length; i++){
			for (var i203 = 0; i203 < self.locations().length; i203++){
				titleMarker =  self.locations()[i203].nameLocation;
				if (self.markersEnabled()[i].title === titleMarker ){
					self.markersEnabled()[i].setVisible(true);
				}
			}

		}
	};

	/*Function that only selected the locations that matches with the user search
	 * 
	 */

	self.searcherLocations = function() {
		self.locations.removeAll();
		var existe;
		for (var i = 0; i < dataLocations.length; i++) {
			existe = dataLocations[i].title.toLowerCase().indexOf(self.searchLocation().toLowerCase());
			if (existe > -1) {
				self.locations.push(new buildLocation(dataLocations[i].title));
			}
		}
	};

	/*This function loads the markers in the map. I have a json with the location.
	 * The marker are created with the json location information
	 * Also it creates the event on click 
	 */
	self.loadMarkers = function() {
		if (typeof map !== 'undefined') {
			self.markers = ko.observableArray([]);
			self.markersEnabled  = ko.observableArray([]);
			for (var i=0; i<self.locations().length; i++) {
				self.lat = self.locations()[i].lat;
				self.lng = self.locations()[i].lng;
				self.title = self.locations()[i].nameLocation;
				self.fecha = '20151001';
				marker = new google.maps.Marker(
						{
							position: new google.maps.LatLng(self.lat, self.lng),
							title: self.title,
							map: map,
							icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
						});
				self.markers.push(marker);
				self.markersEnabled.push(marker);
				self.markers()[i].setMap(map);
			}

			for (var i = 0 ; i<self.markers().length; i++){
			
				self.openInfoWindow (i);
			}
			self.loadList();
		}
	};
	self.loadMarkers();
}


