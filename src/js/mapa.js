(function() {

    const lat = document.querySelector('#lat').value || 9.9382791;
    const lng = document.querySelector('#lng').value || -84.103193;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    //Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend' , function(e){
        marker = e.target
        const position = marker.getLatLng();

        mapa.panTo(new L.LatLng(position.lat, position.lng))

        //Obtener nombre de la calle
        geocodeService.reverse().latlng(position, 16).run(function(error, result){
            console.log(result)
            marker.bindPopup(result.address.Match_addr)

        //Llenar los campos
            document.querySelector('.calle').textContent = result?.address?.Address ?? '';
            document.querySelector('#calle').value = result?.address?.Address ?? '';
            document.querySelector('#lat').value = result?.latlng?.lat ?? '';
            document.querySelector('#lng').value = result?.latlng?.lng ?? '';
        })
    })


})()