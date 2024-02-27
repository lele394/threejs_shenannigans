import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

import  {chunk_settings} from "./settings.js";
console.log(chunk_settings);

import { arrayEqual } from './src/tools.js';


import Stats from './node_modules/stats.js/src/Stats.js';

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)







const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( .1, .1, .1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00fff0 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );








// ======= CAMERA STUFF ========
import { CamHandleKeyDown, CamHandleKeyUp, updateCamera } from './src/camera.js';
// Add event listener for keydown events for camera movements
document.addEventListener('keydown', (event) => CamHandleKeyDown(event, camera), false);
document.addEventListener('keyup', CamHandleKeyUp, false);



// ===== Chunk stuff =====
/*

So! 2 systems of coordinates. normal coordinates, and chunk coordinates.
Basically normal ones are used for the camera, and the chunk coordinates
only corresponds to a compressed version of the original where one unit
cell is a chunk. Allows for a simple modulo.
Dilation is given by the 1/chunk_size

*/


class Chunk {
    constructor(offset) {
        this.offset = offset;

        this.cubes = this.createChunk(offset);
    }

    // Method definition
    createChunk(offset) {

        let cubes = []

        console.log(`creating chunk at ${offset}`);

        const Size = chunk_settings.chunk_size;
    

        
        const mergedGeometry = new THREE.Geometry();

        let geometryOffset = 0;
    
        for (let i = 0; i < Size; i++) {
            for (let j = 0; j < Size; j++) {
                for (let k = 0; k < Size; k++) {
                    const tetraGeometry = new THREE.TetrahedronGeometry(0.05, 0);
                    const cubePosition = new THREE.Vector3(i + offset[0] * Size, j + offset[1] * Size, k + offset[2] * Size);
    
                    // Move the tetrahedron geometry to the desired position
                    tetraGeometry.translate(cubePosition.x, cubePosition.y, cubePosition.z);
    
                    // Merge the tetrahedron geometry into the merged geometry
                    mergedGeometry.merge(tetraGeometry);
    
                    geometryOffset++;
                }
            }
        }

        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // Create a wireframe material
        const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });

        // const mergedMesh = new THREE.Mesh(mergedGeometry, material);
        const mergedMesh = new THREE.Mesh(mergedGeometry, wireframeMaterial);
        scene.add(mergedMesh);
    
        return mergedMesh;
    }
    


    remove() {
        console.log(`removing ${this.offset}`);

        scene.remove(this.cubes);
        return

    }
}









function GetSphereOfChunks(pos, radius) {

    let x = pos[0];
    let y = pos[1];
    let z = pos[2];


    let cells = [];

    // Iterate through all integer coordinates within a bounding box
    for (let i = x - radius; i <= x + radius; i++) {
        for (let j = y - radius; j <= y + radius; j++) {
            for (let k = z - radius; k <= z + radius; k++) {
                // Check if the current coordinate is within the sphere's radius
                if (Math.pow(i - x, 2) + Math.pow(j - y, 2) + Math.pow(k - z, 2) <= Math.pow(radius, 2)) {
                    cells.push([i, j, k]); // Add the coordinate to the cells array
                }
            }
        }
    }

    return cells
    
}











let prev_cam_pos = [camera.position.x+20, camera.position.y, camera.position.z];
//                            ^ to trigger chunk load

let active_chunks = [

]

function PositionChunkCreation(camera){
    /* checks for the position of the camera. 
    If has moved from its previous chunk, creates new ones. */

    const Size = chunk_settings.chunk_size;

    let curent_cam_pos = [
        Math.floor(camera.position.x/Size),
        Math.floor(camera.position.y/Size),
        Math.floor(camera.position.z/Size),
    ]

    // console.log(curent_cam_pos);
    // console.log(prev_cam_pos);
    // console.log(arrayEqual(curent_cam_pos, prev_cam_pos));


    // compare the positions
    if (!arrayEqual(curent_cam_pos, prev_cam_pos)) {

        console.log("different chunk detected");

        /* Here the radius of creation is 1. Updating the list of all
        chunks that should be active should do it. */




        // new active chunk list
        let new_active_chunks = []

        // lit of all chunks that should be active.
        let should_be_active = GetSphereOfChunks(curent_cam_pos, chunk_settings.loading_radius);


        console.log(should_be_active);


        // loops through all the chunks that should be active
        should_be_active.forEach(active_pos => {
            // check if the chunk is already active
            /* checks if there is one chunk in active chunk that has the position active_pos
            If there is one, push it to new_active_chunk, else create it*/
            let IsIn = false;
            active_chunks.forEach(chunk => {
                if (arrayEqual(chunk.offset, active_pos)) {
                    new_active_chunks.push(chunk);
                    IsIn = true;
                }
            });

            if (!IsIn) {
                new_active_chunks.push(new Chunk(active_pos));
            }


    
            
        });


        // loop through the chunk list
        active_chunks.forEach(element => {
            // check if chunk is in the new active chunk list
            if (!new_active_chunks.includes(element)) {
                // if not, remove chunk
                element.remove();
            }
            
        });


        // swap variables for next check
        active_chunks = new_active_chunks;
        prev_cam_pos = curent_cam_pos;

        
    }

    



}







function animate() {
    stats.begin();
	requestAnimationFrame( animate );

    PositionChunkCreation(camera);


	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

    updateCamera(camera);

	renderer.render( scene, camera );
    stats.end();
}
//document.addEventListener('keydown', (event) => animate(), false);
animate();