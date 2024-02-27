// Define movement speed and rotation speed
const movementSpeed = 0.1;
const rotationSpeed = 0.02;

let keysPressed = {}; // Object to keep track of pressed keys

export function CamHandleKeyDown(event, camera) {
    keysPressed[event.key] = true;
}

export function CamHandleKeyUp(event, camera) {
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

    if (keysPressed['s']) {
        // Go forward
        camera.position.z += movementSpeed;
    }
    if (keysPressed['z']) {
        // Go backward
        camera.position.z -= movementSpeed;
    }
    if (keysPressed['d']) {
        // Go left
        camera.position.x += movementSpeed;
    }
    if (keysPressed['q']) {
        // Go right
        camera.position.x -= movementSpeed;
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