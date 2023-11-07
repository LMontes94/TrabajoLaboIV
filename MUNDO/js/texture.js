function loadTexture(texture) {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load(texture);
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });
  
    sphere = new THREE.Mesh(geometry, material);
}