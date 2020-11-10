import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import {pick} from "./random.js";

export function createCar({mesh, phase}){
  console.log("creating car with mesh ", mesh.name)
  const vel = new THREE.Vector3(0, 0, 0);
  const pos = new THREE.Vector3(0, 0, 0);
  const lastSteeringAmount = 0;
  const heading = 0;  
  return {mesh, pos, vel, heading, phase, lastSteeringAmount};
}
export function resetCar(car){
  car.pos.set(0,0,0);
  car.vel.set(0,0,0);
}

export function accelerate(car, mag){
  const adjustedAngle = -car.heading + Math.PI/2;
  const x = Math.cos(adjustedAngle);
  const z = Math.sin(adjustedAngle);
  car.vel.add(new THREE.Vector3(x, 0, z).multiplyScalar(mag));
}

export function brake(car){
  car.vel.multiplyScalar(0.9);
}

export function steerCar(car, steerAmt){
    car.heading = car.heading + steerAmt;
    //Currently, Just for front wheel angling.
    car.lastSteeringAmount = steerAmt * 20;
}

export function randomiseCarMesh(car, allCarDatas){  
  car.mesh = pick(allCarDatas).mesh;
}

export function updateCar(car, timeS){
  car.pos = car.pos.add(car.vel);
  car.vel = car.vel.multiplyScalar(0.99);
  car.mesh.position.copy(car.pos);
  
  updateWheels(car.mesh, car.lastSteeringAmount  * 0.1 * Math.PI, timeS);
  car.mesh.rotation.y = car.heading;
  //car.lastSteeringAmount*= 0.99999;
}


export function updateCarsInCircle(cars, timeS, radius) {
    cars.forEach(carObj => {
        if (!carObj.mesh) {
            return;
        }
        const carMesh = carObj.mesh;
        updateWheels(carMesh, -Math.PI * 0.1, timeS);

        const angle = carObj.phase + (timeS / 10) * 2 * Math.PI;
        carMesh.position.x = radius * Math.cos(angle);
        carMesh.position.z = radius * Math.sin(angle);
        carMesh.rotation.y = - angle;
    });
}



function updateWheels(wheeledCar, steerAngle, timeS) {
    if (wheeledCar) {
        const wheels = wheeledCar.children.filter(c => c.name && c.name.startsWith("wheel"));
        const wheelsFront = wheeledCar.children.filter(c => c.name && c.name.startsWith("wheel_f"));
        const wheelsBack = wheeledCar.children.filter(c => c.name && c.name.startsWith("wheel_b"));

        for (let wheel of wheelsFront) {
            //we need to rotate the wheels (on steering axis) 
            // AND then preserve their new spinning axis when spinning them (was on x)
            const myEuler = new THREE.Euler(timeS * 0.8 * Math.PI * 2, steerAngle, 0, 'YXZ');
            wheel.setRotationFromEuler(myEuler)
            // wheel.scale.set(2,2,2)
        }
        for (let wheel of wheelsBack) {
            wheel.rotation.x = timeS * 1.4 * Math.PI;
        }
    }
}

function updateBrakeLights(car){
  const brakeLights = wheeledCar.getObjectByName("lights_brakes");
  if (brakeLights) {
    // brakeLights.visible =  timeS % 2 < 1;

    //changing the colour of the material is not suitable if we've loaded a low-poly pixel-colour texture.
    // brakeLights.material.color = new THREE.Color("rgb(0, 255, 0)");
  }
}