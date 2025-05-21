let map;

// Must be global for Google Maps callback
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 23.673944, lng: 86.952393 },
    zoom: 8
  });
};
