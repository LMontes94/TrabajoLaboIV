import * as THREE from "https://cdn.skypack.dev/three@0.129.0";


const EARTH_RADIUS = 6.371000;


function setSphereRotationDefault(sphere) {
    let increaseValue = 0.0003 * EARTH_RADIUS;
    if (sphere.rotation.y + increaseValue > EARTH_RADIUS) {
        sphere.rotation.y = 0;
    }
    sphere.rotation.y += increaseValue;
}

function setSphereRotationNone (sphere) {
    return;
}


export
    let

    sphereRotationSetter = setSphereRotationDefault,
    
    moveGlobeToCoordinates = (sphere, latitude, longitude) => {
        sphereRotationSetter = setSphereRotationNone;
        
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
    };