// chunkWorker.js

self.onmessage = function(e) {
    const { offset, Size } = e.data;
    const cubes = createChunkAsAGrid(offset, Size);
    self.postMessage(cubes);
};

























function createChunkAsAGrid(offset, Size) {
    /* 
    Webworker that generates a 3D grid of points in space. Useful for debug.
    */
    let geometryData = { vertices: [], faces: [] };

    let geometryOffset = 0;

    for (let i = 0; i < Size; i++) {
        for (let j = 0; j < Size; j++) {
            for (let k = 0; k < Size; k++) {
                // Define vertices of tetrahedron
                let vertices = [
                    [0, 0, 0],
                    [.1, 0, 0],
                    [0, .1, 0],
                    [0, 0, .1]
                ];

                // Define faces of tetrahedron
                let faces = [
                    [0, 1, 2],
                    [0, 1, 3],
                    [0, 2, 3],
                    [1, 2, 3]
                ];

                // Translate vertices based on offset and size
                for (let vertex of vertices) {
                    vertex[0] += (i + offset[0] * Size);
                    vertex[1] += (j + offset[1] * Size);
                    vertex[2] += (k + offset[2] * Size);
                    geometryData.vertices.push(...vertex);
                }

                // Add faces to geometry data, offsetting indices
                for (let face of faces) {
                    geometryData.faces = geometryData.faces.concat(face.map(idx => idx + geometryOffset));
                }

                geometryOffset += vertices.length;
            }
        }
    }
    
    //console.log("Geometry data", geometryData);

    return geometryData;
}

