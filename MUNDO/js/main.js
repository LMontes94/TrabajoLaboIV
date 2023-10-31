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
  // let temp = new THREE.TextureLoader().load("./img/space_stars_bg.jpg");
  // let temp1 = new THREE.MeshBasicMaterial({ map: temp, side: THREE.BackSide });
  let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

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

function loadTexture(texture) {
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load(texture);
  const material = new THREE.MeshBasicMaterial({ map: earthTexture });

  sphere = new THREE.Mesh(geometry, material);
}

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




const updateButton = document.getElementById("update-button");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");


function updateClock(latitude, longitude) {
  const clockElement = document.getElementById("clock");

  try {
      const url = `https://worldtimeapi.org/api/timezone?lat=${latitude}&lng=${longitude}`;
      fetch(url)
          .then(response => response.json())
          .then(data => {
              if (data.utc_offset) {
                  const utcOffset = data.utc_offset;
                  const localTime = new Date(new Date().getTime() + utcOffset * 1000);
                  const hours = localTime.getUTCHours().toString().padStart(2, '0');
                  const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
                  const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');
                  const timeString = `${hours}:${minutes}:${seconds}`;
                  clockElement.textContent = timeString;
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





updateButton.addEventListener("click", async () => {
  const latitude = parseFloat(latitudeInput.value);
  const longitude = parseFloat(longitudeInput.value);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      moveGlobeToCoordinates(latitude, longitude);
      updateClock(latitude, longitude);
      updateCountry(latitude, longitude);
  } else {
      alert("Por favor, ingresa coordenadas válidas.");
  }
});







async function getCoordinatesFromTimezone(timezone) {
  try {
      const baseURL = "https://nominatim.openstreetmap.org/search";
      const format = "json";
      const query = `timezone:${encodeURIComponent(timezone)}`;
      const limit = 1; // Limita a una única coincidencia
      const url = `${baseURL}?format=${format}&q=${query}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.length > 0) {
          const latitude = parseFloat(data[0].lat);
          const longitude = parseFloat(data[0].lon);
          return { latitude, longitude };
      } else {
          throw new Error("No se encontraron coordenadas para la zona horaria especificada.");
      }
  } catch (error) {
      console.error("Error al obtener coordenadas:", error);
      return null;
  }
}

function updateCountry(latitud, longitud) {
  const countryElement = document.getElementById("country");
  const API_KEY = "usrxdlax"
  const url = `http://api.geonames.org/countryCodeJSON?lat=${latitud}&lng=${longitud}&username=${API_KEY}`;
  let receivedData;

  //console.log(url);

  // Realizar solicitud HTTP
  fetch(url)
    .then(response => response.json())
    .then(data => {
      receivedData = data;
        if (data.countryCode) {
            countryElement.innerHTML = data.countryName;
          } else {
            console.error('No se pudo obtener la información del país.');
        }
    })
    .catch(error => console.error('Error en la solicitud:', error));
}


timezoneSelector.addEventListener("change", async () => {
  const selectedTimezone = timezoneSelector.value;
  const coordinates = await getCoordinatesFromTimezone(selectedTimezone);

  if (coordinates) {
      moveGlobeToCoordinates(coordinates.latitude, coordinates.longitude);
      const currentTime = getCurrentTimeInTimezone(selectedTimezone);
      updateClock(clock, currentTime);
  }
});


function moveGlobeToCoordinates(latitude, longitude) {
  sphereRotationSetter = () => { return; }
  
  // Convierte las coordenadas geográficas en coordenadas 3D en la esfera del globo terráqueo
  const radius = 5; // Radio del globo
  const phi = (90 - latitude) * (Math.PI / 180); // Convierte la latitud a radianes
  const theta = (longitude + 180) * (Math.PI / 180); // Convierte la longitud a radianes

  // Calcula la nueva posición del globo
  sphere.position.x = -radius * Math.sin(phi) * Math.cos(theta);
  sphere.position.y = radius * Math.cos(phi);
  sphere.position.z = radius * Math.sin(phi) * Math.sin(theta);

  // Asegúrate de que la esfera esté orientada hacia las nuevas coordenadas
  sphere.lookAt(new THREE.Vector3(0, 0, 0));
}



