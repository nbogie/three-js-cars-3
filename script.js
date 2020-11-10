import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.122.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';

import { setupShadows } from "./modules/shadows.js";
import { setupLights } from "./modules/lights.js";
import { setupGround }  from "./modules/ground.js";
import { dumpObjectToConsoleAsString }  from "./modules/debug.js";
import { loadCarsAsyncFromSingleFile, loadRaceTrackAsync, loadPropsAsyncFromSingleFile}  from "./modules/carLoader.js";
import { updateCarsInCircle, steerCar, accelerate, brake, createCar, updateCar, resetCar, randomiseCarMesh }  from "./modules/cars.js";
import { setupConnection} from "./modules/gameClient.js"
import {pick} from "./modules/random.js";
import {InputManager} from "./modules/InputManager.js";

import { setupPostProcessingComposer } from "./modules/postProcessing.js";
import { EffectComposer } from 'https://unpkg.com/three@0.122.0/examples/jsm/postprocessing/EffectComposer.js';


				

let myCarData;



function changeTexture(mesh){
  new THREE.TextureLoader().load(
    "./textures/sweetie-16-1x.png",
  texture => {
    //Update Texture
    mesh.material.map = texture;
    mesh.material.needsUpdate = true;
  });
  //"https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
}

function addRandomObjectAt(position, choices, scene){  
  console.assert(position, "position should not be null");
  console.assert(choices && choices.length > 0, "need some choices");
  const chosen = pick(choices);
  const newObj = chosen.clone();
  newObj.rotation.y = Math.random() * Math.PI * 2;
  newObj.position.copy(position);
  scene.add(newObj);
}
function setupCamera() {
    // The camera
    const camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        10000
    );
    // Make the camera further from the models so we can see them better
    camera.position.z = 15;
    camera.position.y = 5;
    return camera;
}

async function setupAsync() {
  // The three.js scene: the 3D world where you put objects
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("hsl(190, 30%, 75%)");
  let isPaused = false;

  
  const inputManager = new InputManager();


  //Not necessary as I've made the canvas element in the HTML file and passed it to the renderer constructor
  //Previous method had us appending the renderer canvas into <body>
  // document.body.appendChild(renderer.domElement);

  setupGround(scene);

  let carsBigSet = await loadCarsAsyncFromSingleFile(scene);
  let raceTrack = await loadRaceTrackAsync(scene);
  const props = await loadPropsAsyncFromSingleFile(scene);



  const myCarData = pick(carsBigSet);
  // console.log({myCarData})
  myCarData.pos.set(Math.random()*4, 0, Math.random()*4);


  const camera = setupCamera();
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 0, 0);
  // controls.update();
  
  // Follow cam technique from nik lever
  // https://www.youtube.com/watch?v=lOMAu-XPs5I&list=PLFky-gauhF46LALXSriZcXLJjwtZLjehn&index=5&t=3m30s
  const desiredCameraPositionObj = new THREE.Object3D();
  desiredCameraPositionObj.position.set(0, 4, -15);
  desiredCameraPositionObj.parent = myCarData.mesh;




  const canvas = document.querySelector('canvas');
  // The renderer: something that draws 3D objects onto the canvas
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true, 
    // alpha: true,
    // premultipliedAlpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xaaaaaa, 1);


  let {composer, functions:postProcessingControls} = setupPostProcessingComposer(renderer, scene, camera);
  
  setupShadows(scene, renderer);
  setupLights(scene);

  
  //setupConnection(myCarData);
  function togglePause(){
    console.log("toggling pause")
    isPaused = !isPaused;
  }
  function render(timeMs) {
     const timeS = timeMs / 1000;

    inputManager.keys.pause.justPressed && togglePause();
    if (isPaused){
      inputManager.updateAtEndOfFrame();
      requestAnimationFrame(render);
      return;
    }

  //  updateCarsInCircle(carsBigSet, time * 0.001, 10);
      // console.log("in render", {myCarData});
    
      updateCar(myCarData, timeS);
      camera.position.lerp(desiredCameraPositionObj.getWorldPosition(new THREE.Vector3()), 0.05);
      camera.lookAt(myCarData.mesh.position);
      document.getElementById("info").innerText = `Time: ${(timeS).toFixed(1)}`;
      //document.getElementById("info").innerText = JSON.stringify(myCarData, null, 2); //`Time: ${(time / 1000).toFixed(1)}`;
      // throw new Error("stopping");

      const deltaTime = 0.1;
      const moveSpeed = 0.1;    
      const delta = (inputManager.keys.left.down  ?  1 : 0) +
                    (inputManager.keys.right.down ? -1 : 0);
      steerCar(myCarData, delta * 0.07);              
      inputManager.keys.up.down && accelerate(myCarData, 0.01);
      inputManager.keys.down.down && brake(myCarData);
      inputManager.keys.reset.down && resetCar(myCarData);
      debugger
      inputManager.keys.addRandomObject.justPressed && addRandomObjectAt(myCarData.mesh.position, props, scene);
    
      if (inputManager.keys.changeTexture.justPressed){
       console.log("changing texture");
        changeTexture(myCarData.mesh);
      }
      if (inputManager.keys.randomiseCarMesh.down){
        randomiseCarMesh(myCarData, carsBigSet);
        postProcessingControls.turnOn();
        setTimeout(()=>postProcessingControls.turnOff(), 200);
        desiredCameraPositionObj.parent = myCarData.mesh;
      }
      
      //controls.target.copy(myCarData.pos);
      //camera.position.set(myCarData.pos.x+10, myCarData.pos.y + 3, myCarData.pos.z - 10)
      //controls.update();

      // Render the scene and the camera
      if (composer){
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      inputManager.updateAtEndOfFrame();
      // Make it call the render() function about every 1/60 second
      //always call this last so we stop on an error in the above.
      requestAnimationFrame(render);
  }

  render();
}

setupAsync();
