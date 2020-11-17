export function setupPhysics() {

    const world = new CANNON.World();
    world.gravity.set(0, -7, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    const cubeBody = createCubeBody(world);
    const sphereBody = createSphereBody(world);
    createGroundBody(world);

    return { world, sphereBody, cubeBody };
}


export function createSphereBody(world) {
    // Create a sphere
    var radius = 1; // m

    var sphereBody = new CANNON.Body({
        mass: 10, // kg
        position: new CANNON.Vec3(3, 1, 1), // m
        shape: new CANNON.Sphere(radius)
    });

    sphereBody.linearDamping = sphereBody.angularDamping = 0.5;

    world.addBody(sphereBody);
    return sphereBody;
}



export function createGroundBody(world) {
    let groundMaterial = new CANNON.Material();
    groundMaterial.friction = 0.3;

    // Create a plane
    var groundBody = new CANNON.Body({
        material: groundMaterial,
        mass: 0 // mass == 0 makes the body static,
    });

    var groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.set(0, 0, 0);
    world.addBody(groundBody);

}


export function createCubeBody(world) {
    const cubeShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const cubeBody = new CANNON.Body({ mass: 3 });

    cubeBody.position.set(3, 5, 4);


    cubeBody.addShape(cubeShape);
    cubeBody.angularVelocity.set(0, 4, 0);
    cubeBody.angularDamping = 0.5;
    world.addBody(cubeBody);
    return cubeBody;
}


