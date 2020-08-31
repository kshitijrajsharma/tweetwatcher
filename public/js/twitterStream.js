function initialize() {
  //Setup Google Map
  
  
  //Setup heat map and link to Twitter array we will append data to
  var map = L.map('map').setView([28.2096, 83.9856], 4);
        osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      });
                  
      var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
      });
      googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
      });
      googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
      });
      googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
          
      });
      mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/skshitiz1/ckeiqhzrm12ou19mhla4920nw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2tzaGl0aXoxIiwiYSI6ImNqcmJ2czBjODBhMTgzeWxwM2t1djJuaXUifQ.wlFktg-soH3B_pqVyJj2Ig').addTo(map);
      var baseLayers = {
                      "OpenStreetMap": osm,
                      "Google Streets": googleStreets,
                      "Google Hybrid": googleHybrid,
                      "Google Satellite": googleSat,
                      "Google Terrain": googleTerrain,
                      "Mapbox Tiles": mapboxTiles
                  };
                  
      layerswitcher = L.control.layers(baseLayers, {}, {collapsed: true}).addTo(map);
   
      var liveTweets = new Array();
      var HeatmapLayer = L.heatLayer(liveTweets,{radius:25,minOpacity:0.4}).addTo(map);

  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    // This listens on the "twitter-steam" channel and data is 
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {
      console.log("i am from inside the data")
      console.log(data)

      //Add tweet to the heat map array.
    

      var tweetLocation = new Array(data.lng,data.lat);
      liveTweets.push(tweetLocation);

      //Flash a dot onto the map quickly
      var image = "css/small-dot-icon.png";
      var iconnew = L.icon({
        iconUrl: image,
       
    });
      var layer = L.circleMarker(tweetLocation,{icon: iconnew}).addTo(map);
      layer.addTo(map);
      var popup = L.popup()
      .setLatLng(tweetLocation)
      .setContent(data.text)
      .openOn(map);

      setTimeout(function() {
          layer.remove();
          popup.remove();
      }, 2000);

    });

    // Listens for a success response from the server to 
    // say the connection was successful.
    socket.on("connected", function(r) {

      //Now that we are connected to the server let's tell 
      //the server we are ready to start receiving tweets.
      socket.emit("start tweets");
    });
  }
}