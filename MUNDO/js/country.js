export
    function updateCountry(latitud, longitud) {
        const countryElement = document.getElementById("country");
        const API_KEY = "usrxdlax"
        const url = `http://api.geonames.org/countryCodeJSON?lat=${latitud}&lng=${longitud}&username=${API_KEY}`;
        let receivedData;
        console.log("a")
        //console.log(url);
      
        // Realizar solicitud HTTP
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("b")
                receivedData = data;
                if (data.countryCode) {
                    console.log("c")
                    countryElement.innerHTML = data.countryName;
                } else {
                    console.log("d")
                    console.error('No se pudo obtener la información del país.');
                }
            })
        .catch(error => console.error('Error en la solicitud:', error));
    };