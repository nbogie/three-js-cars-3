import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.122.0/examples/jsm/loaders/GLTFLoader.js';
import { dumpObjectToConsoleAsString } from "./debug.js";
import { createCar } from "./cars.js";

export async function loadCarsAsyncFromSingleFile(scene) {
    console.log("loading ALL cars from one file!")
    const url = "./models/cars_big_set.glb"

    const gltfLoader = new GLTFLoader();
    function namedLikeCar(obj) {
        return obj.name && obj.name.toLowerCase().startsWith("car")
    }

    const promise = new Promise((resolve, reject) => {

        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene;
            // dumpObjectToConsoleAsString(root);
            const allCars = root.children.filter(namedLikeCar);

            scene.add(...allCars);

            const phaseStep = Math.PI * 2 / allCars.length;
            const allCarsObjs = allCars.map((mesh, ix) => createCar({ mesh, phase: phaseStep * ix }));
            resolve(allCarsObjs);
        });

    })//new promise
    return promise;
}


export async function loadPropsAsyncFromSingleFile(scene) {
    console.log("loading ALL scenery props from one file!")
    const url = "./models/crates_set.glb"

    const gltfLoader = new GLTFLoader();

    const promise = new Promise((resolve, reject) => {
        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene;
            dumpObjectToConsoleAsString(root);
            root.children.forEach(item => item.scale.set(0.5, 0.5, 0.5));
            // scene.add(...root.children);
            resolve(root.children);
        });
    })//new promise
    return promise;
}

export async function loadRaceTrackAsync(scene) {
    console.log("loading race track model!")
    const url = "./models/race_course.glb"

    const gltfLoader = new GLTFLoader();

    const promise = new Promise((resolve, reject) => {

        gltfLoader.load(url, (gltf) => {
            const root = gltf.scene;
            dumpObjectToConsoleAsString(root);
            // root.position.set(30, 0, 0);
            scene.add(root);

            resolve(root);
        });

    })//new promise
    return promise;
}

