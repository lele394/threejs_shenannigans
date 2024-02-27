// Define movement speed and rotation speed
const movementSpeed = 0.1;
const rotationSpeed = 0.02;

let keysPressed = {}; // Object to keep track of pressed keys

export function CamHandleKeyDown(event) {
    keysPressed[event.key] = true;
}

export function CamHandleKeyUp(event) {
    delete keysPressed[event.key];
}

export function updateCamera(camera) {
    if (keysPressed['a']) {
        // Rotate camera left
        camera.rotation.y += rotationSpeed;
    }
    if (keysPressed['e']) {
        // Rotate camera right
        camera.rotation.y -= rotationSpeed;
    }

    if (keysPressed['z']) {
        // Go forward
        camera.position.x -= Math.sin(camera.rotation.y) * movementSpeed;
        camera.position.z -= Math.cos(camera.rotation.y) * movementSpeed;
    }
    if (keysPressed['s']) {
        // Go backward
        camera.position.x += Math.sin(camera.rotation.y) * movementSpeed;
        camera.position.z += Math.cos(camera.rotation.y) * movementSpeed;
    }
    if (keysPressed['q']) {
        // Go right
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * movementSpeed;
        camera.position.z += Math.cos(camera.rotation.y - Math.PI / 2) * movementSpeed;
    }
    if (keysPressed['d']) {
        // Go left
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * movementSpeed;
        camera.position.z += Math.cos(camera.rotation.y + Math.PI / 2) * movementSpeed;
    }
    

    if (keysPressed['r']) {
        // Go up
        camera.position.y += movementSpeed;
    }
    if (keysPressed['f']) {
        // Go down
        camera.position.y -= movementSpeed;
    }



}