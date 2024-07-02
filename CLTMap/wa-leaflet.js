$(document).ready(function () {
    // This needs to be adapted to how the webpage is assigning the map
    let floor = window.location.hash.substr(1); // #UG, #EG, #OG, #DG
    if (!floor) {
        floor = 'EG';
    }

    const TUXIcon = L.icon({
        iconUrl: `${static_root}/img/leaflet/tux-marker.png`,
        iconRetinaUrl: `${static_root}/img/leaflet/tux-marker-x2.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -37],
        shadowUrl: `${static_root}/img/leaflet/marker-shadow.png`,
        shadowSize: [41, 41],
    });

    const path = `${static_root}/wa-leaflet/${floor}/`;

    // Reload page if URL has changed
    window.onhashchange = function() {
        window.location.reload(true);
    }

    // Needed for popups
    const popup = L.popup();

    // Load map object
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 1
    });

    // Show popup with coordinates on click
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent(e.latlng.lat + " | " + e.latlng.lng)
            .openOn(map);
    }

    fetch(`${path}data.json`)
        .then(response => response.json())
        .then(data => {

            // Do some map settings
            const bounds = [[0,0], [data.height,data.width]];
            const image = L.imageOverlay(`${path}map.png`, bounds).addTo(map);
            map.fitBounds(bounds);
            map.setView([(data.height/10)*4, data.width/2], -2);

            // Add markers
            for (const [key, value] of Object.entries(data.markers)) {
                L.marker(data.markers[key].pos, {icon: TUXIcon}).addTo(map)
                    .bindPopup(data.markers[key].txt);
            }

            // Add Click-Listener
            //map.on('click', onMapClick);
        });
});