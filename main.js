import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';

import  {chunk_settings, render_settings, keyboard_settings} from "./settings.js";
console.log(chunk_settings);
console.log(render_settings);

// set keyboard to AZERTY
let keyboard = keyboard_settings.AZERTY;

import { arrayEqual } from './src/tools.js';

import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js'


const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)







const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



let RunningChunkWorkers = 0;







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

let MeshMade = 0;

class Chunk {
    constructor(offset, Type) {
        this.offset = offset;
        this.cubes = 0; // Initialize cubes property
        
        console.log(`adding chunk ${this.offset}`);
        // Create a Web Worker instance
        this.worker = new Worker('chunkWorker.js');
        RunningChunkWorkers ++; // increment number of running workers

        let Size = chunk_settings.chunk_size;

        // Send a message to the worker with the offset
        this.worker.postMessage({ offset, Size, Type });

        // Listen for messages from the worker
        this.worker.onmessage = (e) => {
            RunningChunkWorkers --;

            if (active_chunks.includes(this) ) {
                const geometryData = e.data;
                console.log(`chunk data for chunk ${this.offset} has been computed`, e.data);

                
                if (arrayEqual(geometryData.vertices, [])) {

                    console.log(`chunk ${this.offset} is empty`);
                    this.cubes = 1;
                    return
                }
                const geometry = this.convertGeometryDataToBufferGeometry(geometryData); // Convert geometry data to BufferGeometry
    

                console.log(geometry)




                const material = new THREE.MeshNormalMaterial( {wireframe: render_settings.wireframe} );
                //const material = new THREE.MeshDepthMaterial( {wireframe: render_settings.wireframe} );










                const mergedMesh = new THREE.Mesh(geometry, material);
                MeshMade ++;

                // Add the merged mesh to the scene or perform other actions as needed
                scene.add(mergedMesh);
                // Set the merged mesh as this.cubes
                this.cubes = mergedMesh;
            }
            else {
                console.log(`chunk data for chunk ${this.offset} has been computed but is already destroyed, skipping instanciation`);
            }
            
            this.worker.terminate()
        };
    }

    // Function to convert geometry data to THREE.BufferGeometry
    convertGeometryDataToBufferGeometry(geometryData) {
        const geometry = new THREE.BufferGeometry();
        // Set attributes from geometryData to BufferGeometry
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geometryData.vertices), 3));
        // Assuming that geometryData.faces contains face indices as a flat array



        geometry.computeVertexNormals();

        console.log(geometryData.faces)
        geometry.setIndex(geometryData.faces); // Was causing an issue
        /* See if i can't offload that to the worker one day. 
        Turns out it's not that great, renders triangles flipped*/
        
        
        
        
         return geometry;
    }
    


    remove() {
        console.log(`removing chunk ${this.offset}`);
        if (this.cubes == 0) {
            console.log(`removing chunk ${this.offset} but it has no mesh, still stuck in worker`);
            this.worker.terminate();
            RunningChunkWorkers --; // since it's cancelled, decrease

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

function PositionChunkCreation(camera, Force=false){
    /* checks for the position of the camera. 
    If has moved from its previous chunk, creates new ones. */

    const Size = chunk_settings.chunk_size;

    let curent_cam_pos = [
        Math.floor(camera.position.x/Size),
        Math.floor(camera.position.y/Size),
        Math.floor(camera.position.z/Size),
    ]


    // compare the positions
    if (!arrayEqual(curent_cam_pos, prev_cam_pos) || Force) {

        console.log("different chunk detected");

        // new active chunk list
        let new_active_chunks = []

        // lit of all chunks that should be active.
        let should_be_active = GetSphereOfChunks(curent_cam_pos, chunk_settings.loading_radius);



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
const workers = document.getElementById("workers")

//set the info n check settings
document.getElementById("chunks_settings").innerHTML = `<br>Chunk settings<br>size: ${chunk_settings.chunk_size}<br>radius: ${chunk_settings.loading_radius}`











//scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));

console.log(new THREE.BoxGeometry(1, 1, 1));


// single exec for marching cubes debug
// PositionChunkCreation(camera);


// render loop
function animate() {
    stats.begin();
	requestAnimationFrame( animate );

    // Updates the chunks and load new ones 
    if (chunk_settings.auto_update) {
        PositionChunkCreation(camera);
    }


    updateCamera(camera, keyboard);

	renderer.render( scene, camera );
    stats.end();



    /* info panel stuff */
    x_div.textContent = `x: ${Math.floor(camera.position.x*100)/100}`
    y_div.textContent = `y: ${Math.floor(camera.position.y*100)/100}`
    z_div.textContent = `z: ${Math.floor(camera.position.z*100)/100}`

    workers.textContent = `Active loaders : ${RunningChunkWorkers}`
    if (RunningChunkWorkers == 0) {
        workers.style.color = "green"
    } else {
        workers.style.color = "red"
    }

    
    /* debug the number of meshes */
    /*
    console.log(
        "n° of meshes : ",scene.children.filter(object => object instanceof THREE.Mesh).length,
        "n° of chunks : ", active_chunks.length,
        "n° of triangles : ", renderer.info.render.triangles,
        "n° of lines : ", renderer.info.render.lines,
        "MeshMade : ", MeshMade,
        renderer.info)*/

    

}
//document.addEventListener('keydown', (event) => animate(), false);


// manual chunk check reset
document.addEventListener('keydown', (event) => {if (event.key == 'v') {active_chunks.forEach(chunk => {
                                                                            chunk.remove()
                                                                        });
                                                                        active_chunks = [];
                                                                        PositionChunkCreation(camera, true);}}, false);


// manual soft check
document.addEventListener('keydown', (event) => {if (event.key == 'c') {PositionChunkCreation(camera, true);}}, false);

// wireframe toogle
document.addEventListener('keydown', (event) => {if (event.key == 'x') { render_settings.wireframe = ! render_settings.wireframe;
                                                                         active_chunks.forEach(chunk => {
                                                                            chunk.remove()
                                                                         });
                                                                         active_chunks = [];
                                                                         PositionChunkCreation(camera, true)}}, false);




// Open/close the parameter menu
document.addEventListener('keydown', (event) => {if (event.code == "Space") {let panel = document.getElementById("parameters-panel").style; 
                                                                             if (panel.display == "none") {
                                                                                panel.display = "";
                                                                             } else {
                                                                                panel.display = "none";
                                                                             } 
                                                                            }}, false);




                                                                        
// Chunk size value update
const html_chunk_size = document.getElementById("chunk-size");
html_chunk_size.addEventListener("input", function() {

    chunk_settings.chunk_size = Math.floor(html_chunk_size.value); // avoid non integers
    
    console.log("Update chunk size:", chunk_settings.chunk_size);
    document.getElementById("chunks_settings").innerHTML = `<br>Chunk settings<br>size: ${chunk_settings.chunk_size}<br>radius: ${chunk_settings.loading_radius}`
});

// Chunk radius value update
const html_chunk_radius = document.getElementById("chunk-radius");
html_chunk_radius.addEventListener("input", function() {

    chunk_settings.loading_radius = Math.floor(html_chunk_radius.value); // avoid non integers

    console.log("Update chunk size:", chunk_settings.loading_radius);
    document.getElementById("chunks_settings").innerHTML = `<br>Chunk settings<br>size: ${chunk_settings.chunk_size}<br>radius: ${chunk_settings.loading_radius}`
});





// start the generation button
const button = document.getElementById("start_generation");
button.addEventListener("click", function() {
    console.log("Starting generation");

    button.disabled = true; // disables button so people don't start the rendering a thousand times

    animate();
});



// Keyboard switch
const html_keyboard_text = document.getElementById("keyboard");
const keyboard_switch = document.getElementById("Keyboard-switch");
keyboard_switch.addEventListener("click", function() {

    if (keyboard === keyboard_settings.AZERTY) {
        keyboard = keyboard_settings.QWERTY
        html_keyboard_text.innerHTML = "QWERTY"

    } else {
        keyboard = keyboard_settings.AZERTY
        html_keyboard_text.innerHTML = "AZERTY"
    }


    console.log(`Switching keyboard to `, keyboard);
});




// enables/disables automatic chunk check

const html_auto_update = document.getElementById('chunk-check');
html_auto_update.addEventListener('change', function() {
    chunk_settings.auto_update = html_auto_update.checked;
    console.log(`Setting auto chunk update to ${chunk_settings.auto_update}`)
});
