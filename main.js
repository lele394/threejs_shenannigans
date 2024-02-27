import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

import  {chunk_settings, render_settings} from "./settings.js";
console.log(chunk_settings);
console.log(render_settings);

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
    constructor(offset, Type) {
        this.offset = offset;
        this.cubes = 0; // Initialize cubes property
        
        console.log(`adding chunk ${this.offset}`);
        // Create a Web Worker instance
        const worker = new Worker('chunkWorker.js');

        let Size = chunk_settings.chunk_size;

        // Send a message to the worker with the offset
        worker.postMessage({ offset, Size, Type });

        // Listen for messages from the worker
        worker.onmessage = (e) => {

            if (active_chunks.includes(this) ) {
                const geometryData = e.data;
                console.log(`chunk data for chunk ${this.offset} has been computed`, e.data);
                const geometry = this.convertGeometryDataToBufferGeometry(geometryData); // Convert geometry data to BufferGeometry
    

                let material;
                if (render_settings.wireframe == true) {
                    material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
                } else {
                    material = new THREE.MeshBasicMaterial({ color: render_settings.material_color });
                }


                const mergedMesh = new THREE.Mesh(geometry, material);

                // Add the merged mesh to the scene or perform other actions as needed
                scene.add(mergedMesh);
                // Set the merged mesh as this.cubes
                //console.log(geometryData);
                this.cubes = mergedMesh;
            }
            else {
                console.log(`chunk data for chunk ${this.offset} has been computed but is already destroyed, skipping instanciation`);
            }
            
        };
    }

    // Function to convert geometry data to THREE.BufferGeometry
    convertGeometryDataToBufferGeometry(geometryData) {
        const geometry = new THREE.BufferGeometry();
        // Set attributes from geometryData to BufferGeometry
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geometryData.vertices), 3));
        // Assuming that geometryData.faces contains face indices as a flat array
        geometry.setIndex(geometryData.faces);
        return geometry;
    }
    


    remove() {
        console.log(`removing chunk ${this.offset}`);
        if (this.cubes == 0) {
            console.log(`removing chunk ${this.offset} but it has no mesh, still stuck in worker`);
        }


        scene.remove(this.cubes);

        this.cubes == null;
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
                new_active_chunks.push(new Chunk(active_pos, "MC"));
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


    /* info panel caching  */

const x_div = document.getElementById("x")
const y_div = document.getElementById("y")
const z_div = document.getElementById("z")

//set the info n check settings
document.getElementById("chunks_settings").innerHTML = `<br>Chunk settings<br>size: ${chunk_settings.chunk_size}<br>radius: ${chunk_settings.loading_radius}`




// single exec for marching cubes debug
PositionChunkCreation(camera);


// render loop
function animate() {
    stats.begin();
	requestAnimationFrame( animate );

    // Updates the chunks and load new ones 
    //PositionChunkCreation(camera);



	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

    updateCamera(camera);

	renderer.render( scene, camera );
    stats.end();

    

    /* info panel stuff */
    x_div.textContent = `x: ${Math.floor(camera.position.x*100)/100}`
    y_div.textContent = `y: ${Math.floor(camera.position.y*100)/100}`
    z_div.textContent = `z: ${Math.floor(camera.position.z*100)/100}`

    
    /* debug the number of meshes */
    console.log(
        "number of meshes : ",scene.children.filter(object => object instanceof THREE.Mesh).length,
        "number of chunks : ", active_chunks.length)

    


}
//document.addEventListener('keydown', (event) => animate(), false);

document.addEventListener('keydown', (event) => {if (event.key == 'v') {PositionChunkCreation(camera);}}, false);

animate();