import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';

export function setupLights(scene) {
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1.0, 0.85);
  dirLight.position.set(-0.4, 0.4, 0.4);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight2.color.setHSL(0.7, 1.0, 0.85);
  dirLight2.position.set(0.4, 0.4, -0.4);
  dirLight2.castShadow = true;
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0xdc8874, .2);
  scene.add(ambientLight);

}
