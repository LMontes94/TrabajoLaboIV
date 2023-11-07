import { scene, sphere, loadTexture } from "./main.js";


export
    function changeButtonTextQuality(quality) {
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
    };