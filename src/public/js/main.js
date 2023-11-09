"use strict";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

const EARTH_RADIUS = 6.371000;
let scene, camera, renderer, sphere, controls, skybox;


function setSphereRotationDefault() {
    let increaseValue = 0.0003 * EARTH_RADIUS;
    if (sphere.rotation.y + increaseValue > EARTH_RADIUS) {
        sphere.rotation.y = 0;
    }
    sphere.rotation.y += increaseValue;
}

let sphereRotationSetter = setSphereRotationDefault;
sphereRotationSetter = () => { };

let skyboxImage = "space";
const sdBtn = document.querySelector(".sd");
const hdBtn = document.querySelector(".hd");

sdBtn.onclick = () => changeTextQuality("low");
hdBtn.onclick = () => changeTextQuality("high");

function createPathStrings(filename) {
    const basePath = "./img/skybox/";
    const baseFilename = basePath + filename;
    const fileType = ".png";
    const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
    const pathStrings = sides.map((side) => {
        return baseFilename + "_" + side + fileType;
    });
    return pathStrings;
}

function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map((image) => {
        let texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---
    });
    return materialArray;
}

function setSkyBox() {
    const materialArray = createMaterialArray(skyboxImage);
    let temp = new THREE.TextureLoader().load("./img/space_stars_bg.jpg");
    let temp1 = new THREE.MeshBasicMaterial({ map: temp, side: THREE.BackSide });
    let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
    skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}

//iniciar escena threejs

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        85,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    setSkyBox();
    loadTexture("./img/earth_texture.jpg");
    scene.add(sphere);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.id = "c";

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 100;

    camera.position.z = 20;
}

//cargar texturas threejs

function loadTexture(texture) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load(texture);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });

    sphere = new THREE.Mesh(geometry, material);
}

//cambio de texturas threejs

function changeTextQuality(quality) {
    switch (quality) {
        case "high":
            scene.remove(sphere);
            loadTexture("./img/earth_hd.jpg");
            scene.add(sphere);
            break;
        case "low":
            scene.remove(sphere);
            loadTexture("./img/earth_texture.jpg");
            scene.add(sphere);
            break;
        default:
            console.log("error must choose between values: high / low");
    }
}




//animacion y render threejs

function animate() {
    requestAnimationFrame(animate);

    sphereRotationSetter();
    controls.update();
    renderer.render(scene, camera);
}




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
animate();

//funciones js para funcionamiento y no three js


//texto hidden hora/dia/pais
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
    const username = "usrxdlax"; //usuario registrado en la pagina WorldApi

    const geonamesUrl = `http://api.geonames.org/countryInfoJSON?name=${countryName}&username=${username}`;

    return fetch(geonamesUrl)
        .then(response => response.json())
        .then(data => {
            if (data.geonames && data.geonames.length > 0) {
                // Filtra el país correcto por nombre
                const countryInfo = data.geonames.find(country => country.countryName === countryName);

                if (countryInfo) {
                    return countryInfo;
                } else {
                    throw new Error("No se encontraron resultados para el país especificado.");
                }
            } else {
                throw new Error("No se encontraron resultados para el país especificado.");
            }
        })
        .catch(error => {
            throw new Error("Error en la solicitud a la API de Geonames: " + error);
        });
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
    if (countryName) {
        obtenerDatosPais(countryName)
            .then(countryInfo => {
                console.log(countryInfo);
                const latitud = obtenerLatitud(countryInfo);
                const longuitud = obtenerLongitud(countryInfo);
                let continentName;
                if (countryInfo.continentName.includes("America")) {
                    continentName = obtenerContinenteAmericano(countryInfo)
                    console.log(continentName);
                } else {
                    continentName = countryInfo.continentName;
                }
                console.log(countryName)
                reemplazarEspaciosEnCapital(countryInfo);
                const capital = quitarTildes(countryInfo.capital);
                console.log(capital);
                const name = document.getElementById("nombre");
                name.textContent = countryName;
                limpiarInput();
                mostrarElemento();
                centrarCamaraACoordenadas(latitud, longuitud);
                updateClock(continentName, countryName, capital);
                marcarPaisEnEsfera(latitud, longuitud);
            })
            .catch(error => {
                alert(error);
            });
    } else {
        alert("Por favor, ingresa un país válido.");
    }
});

//MODAL

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



let marcador
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