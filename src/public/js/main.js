//funciones js para funcionamiento y no three js


//texto hidden hora/dia/pais arreglo
document.querySelector('.quality-select3').style.display = 'none';

function mostrarElemento() {

    document.querySelector('.quality-select3').style.display = 'block';

}

//obtener pais
function obtenerPais() {
    const countryInput = document.getElementById("country");
    return countryInput.value;
}


//datos del pais en la api
function obtenerDatosPais(countryName) {
    return fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(response => {
            response = response[0]
            const countryInfo = {
                name: countryName,
                continent: response.continents[0],
                capital: response.capital[0],
                latitude: response.capitalInfo.latlng[0],
                longitude: response.capitalInfo.latlng[1]
            }
            for (let key in countryInfo) {
                if (countryInfo[key] == undefined) {
                    throw new Error("Error obteniendo datos del país: no se encuentran los campos necesarios");
                }
            }
            return countryInfo;
        })
}

//obtener latitud del pais 
function calcularCoordenadas(latitud, longitud, radio) {
    const phi = (90 - latitud) * (Math.PI / 180);
    const theta = (longitud + 180) * (Math.PI / 180);

    const x = -radio * Math.sin(phi) * Math.cos(theta);
    const y = radio * Math.cos(phi);
    const z = radio * Math.sin(phi) * Math.sin(theta);

    return { x, y, z };
}

function centrarCamaraACoordenadas(latitud, longitud) {
    guardarRotacionEsfera();
    const coordenadas = calcularCoordenadas(latitud, longitud, EARTH_RADIUS); // El tercer parámetro (5) es el radio de la esfera
    // Establece la posición de la cámara en función de las coordenadas
    camera.position.set(coordenadas.x * 1.5, coordenadas.y * 1.5, coordenadas.z * 1.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Asegura que la cámara mire hacia el centro de la esfera

    // Actualiza la matriz de proyección de la cámara
    camera.updateProjectionMatrix();
    setTimeout(() => {
        restaurarRotacionEsfera();
    }, 5000);
}

let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;

function guardarRotacionEsfera() {
    rotationX = sphere.rotation.x;
    rotationY = sphere.rotation.y;
    rotationZ = sphere.rotation.z;
}

function restaurarRotacionEsfera() {
    sphere.rotation.x = rotationX;
    sphere.rotation.y = rotationY;
    sphere.rotation.z = rotationZ;
}

function obtenerLatitud(countryInfo) {
    if (countryInfo) {
        const latitud = (parseFloat(countryInfo.south) + parseFloat(countryInfo.north)) / 2;
        console.log(latitud);
        return latitud;
    } else {
        console.error("No se proporcionaron datos de país.");
    }
}

//obtener longitud del pais
function obtenerLongitud(countryInfo) {
    if (countryInfo) {
        const longitud = (parseFloat(countryInfo.west) + parseFloat(countryInfo.east)) / 2;
        console.log("Longitud:", longitud);
        return longitud;
    } else {
        console.error("No se proporcionaron datos de país.");
    }
}




//union de america del norte y sur
function obtenerContinenteAmericano() {
    return "America";
}

//sacar espacios
function reemplazarEspaciosEnCapital(countryInfo) {
    if (countryInfo.capital) {
        countryInfo.capital = countryInfo.capital.replace(/\s/g, "_");
    }
    return countryInfo;
}

function quitarTildes(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function limpiarInput() {
    document.getElementById("country").value = "";
}


//limpiar el intervalo del reloj
function limpiarClock(intervalo) {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
    document.getElementById("clock").value = ""
}


//obtener hora segun el timezone del pais
function obtenerHora(timezone) {
    const dia = new Date();
    const hora = dia.toLocaleTimeString("default", { timeZone: timezone });
    return hora;
}

function obtenerFecha(timezone) {
    const dia = new Date();
    const fecha = dia.toLocaleDateString("default", { timeZone: timezone });
    return fecha;
}

let intervalo;
function updateClock(continentName, countryName, capital) {
    const day = document.getElementById("day");
    const clockElement = document.getElementById("clock");

    limpiarClock(intervalo);
    try {
        let url;
        if (countryName == "Argentina") {
            url = `https://worldtimeapi.org/api/timezone/${continentName}/${countryName}/${capital}`;
        } else {
            url = `https://worldtimeapi.org/api/timezone/${continentName}/${capital}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.datetime) {
                    //const hora = dateTimeString.match(/T(\d{2}:\d{2}:\d{2})/)[1];/*la expresión regular /T(\d{2}:\d{2}:\d{2})/ busca el patrón "T" 
                    //                                                                     seguido de "HH:MM:SS" en la cadena dateTimeString y el [1] extrae la parte de la hora. */
                    const fechaCompleta = obtenerFecha(data.timezone);
                    console.log(fechaCompleta);

                    day.textContent = fechaCompleta;

                    intervalo = setInterval(() => {
                        clockElement.textContent = obtenerHora(data.timezone);
                        console.log(obtenerHora(data.timezone))
                    }, 1000);
                } else {
                    throw new Error("Error al obtener la hora local.");
                }
            })
            .catch(error => {
                console.error("Error al obtener la hora local:", error);
            });
    } catch (error) {
        console.error("Error al obtener la hora local:", error);
        // Puedes mostrar un mensaje de error en el reloj o realizar alguna otra acción en caso de error
    }
}



//boton update para mostrar todo lo hecho anteriormente
const updateButton = document.getElementById("update-button");
updateButton.addEventListener("click", async () => {
    const countryName = obtenerPais();
    if (countryName == "") {
        alert("Por favor, ingresa un país válido.");
        return;
    }
    obtenerDatosPais(countryName)
    .then(countryInfo => {
        console.log("countryInfo:");
        console.log(countryInfo);
        const latitud = countryInfo.latitude;
        const longuitud = countryInfo.longitude;
        let continentName;
        if (countryInfo.continent.includes("America")) {
            continentName = obtenerContinenteAmericano(countryInfo)
        } else {
            continentName = countryInfo.continent;
        }
        reemplazarEspaciosEnCapital(countryInfo);
        const capital = quitarTildes(countryInfo.capital);
        const name = document.getElementById("nombre");
        name.textContent = countryInfo.name;
        limpiarInput();
        mostrarElemento();
        centrarCamaraACoordenadas(latitud, longuitud);
        updateClock(continentName, countryName, capital);
        marcarPaisEnEsfera(latitud, longuitud);
    })
    .catch(error => {
        alert(error);
    });
});





//MODAL FINAL

const modal = document.getElementById("myModal");
const acceptButton = document.getElementById("acceptButton");

// Muestra el modal al cargar la página
window.addEventListener("load", () => {
    modal.style.display = "block";
});

// Oculta el modal al hacer clic en el botón de aceptar
acceptButton.addEventListener("click", () => {
    modal.style.display = "none";
});



let marcador //marcador pais
function marcarPaisEnEsfera(latitud, longitud) {
    if (marcador) {
        scene.remove(marcador);
    }
    // Crea una geometría y un material para el marcador
    const geometry = new THREE.SphereGeometry(0.1, 32, 32); // Geometría de una pequeña esfera
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Material rojo

    // Crea una malla para el marcador
    marcador = new THREE.Mesh(geometry, material);

    // Calcula las coordenadas 3D para el país
    const coordenadas = calcularCoordenadas(latitud, longitud, EARTH_RADIUS);

    // Establece la posición del marcador en las coordenadas 3D
    marcador.position.set(coordenadas.x, coordenadas.y, coordenadas.z);

    // Agrega el marcador a la escena
    scene.add(marcador);

    // Centra la cámara en las coordenadas del país
    centrarCamaraACoordenadas(latitud, longitud);
}