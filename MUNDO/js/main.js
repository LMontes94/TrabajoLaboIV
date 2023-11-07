import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { sphereRotationSetter, moveGlobeToCoordinates } from "./earthRotation.js"
import { updateCountry } from "./country.js";
import { updateClock } from "./clock.js";
import { setSkyBox } from "./skybox.js";
import { changeButtonTextQuality } from "./button.js";


export let scene, camera, renderer, sphere, controls,

loadTexture = (texture) => {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load(texture);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });
  
    sphere = new THREE.Mesh(geometry, material);
};


function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);

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

function animate() {
    requestAnimationFrame(animate);
    sphereRotationSetter(sphere);
    controls.update();
    renderer.render(scene, camera);
}

document.querySelector(".sd").onclick = () => changeButtonTextQuality("low");
document.querySelector(".hd").onclick = () => changeButtonTextQuality("high");
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
document.getElementById("update-button").addEventListener("click", async () => {
    const latitude = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);
    if (!isNaN(latitude) && !isNaN(longitude)) {
        moveGlobeToCoordinates(sphere, latitude, longitude);
        updateClock(latitude, longitude);
        updateCountry(latitude, longitude);
    } else {
        alert("Por favor, ingresa coordenadas válidas.");
    }
});


init();
animate();