import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

export function setupGround(scene) {
    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL(0, 0, 0.35);
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    return ground;
}