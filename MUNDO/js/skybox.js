import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { scene } from "./main.js"


let skybox;


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

export
    function setSkyBox() {
        const materialArray = createMaterialArray("space");
        // let temp = new THREE.TextureLoader().load("./img/space_stars_bg.jpg");
        // let temp1 = new THREE.MeshBasicMaterial({ map: temp, side: THREE.BackSide });
        let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
        skybox = new THREE.Mesh(skyboxGeo, materialArray);
        scene.add(skybox);
    };