// chunkWorker.js



// ========= TABLES NOT MINE, CAN BE FOUND HERE : https://www.youtube.com/watch?v=KvwVYJY_IZ4




const EdgeVertexIndices = [
	[0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
];






const TriangleTable = [ 
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  1,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  8,  3,  9,  8,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  10,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  3,  1,  2,  10,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  2,  10, 0,  2,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 2,  8,  3,  2,  10, 8,  10, 9,  8, -1, -1, -1, -1, -1, -1 ],
    [ 3,  11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  11, 2,  8,  11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  9,  0,  2,  3,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  11, 2,  1,  9,  11, 9,  8,  11,-1, -1, -1, -1, -1, -1 ],
    [ 3,  10, 1,  11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  10, 1,  0,  8,  10, 8,  11, 10,-1, -1, -1, -1, -1, -1 ],
    [ 3,  9,  0,  3,  11, 9,  11, 10, 9, -1, -1, -1, -1, -1, -1 ],
    [ 9,  8,  10, 10, 8,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  7,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  3,  0,  7,  3,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  1,  9,  8,  4,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  1,  9,  4,  7,  1,  7,  3,  1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  10, 8,  4,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 3,  4,  7,  3,  0,  4,  1,  2,  10,-1, -1, -1, -1, -1, -1 ],
    [ 9,  2,  10, 9,  0,  2,  8,  4,  7, -1, -1, -1, -1, -1, -1 ],
    [ 2,  10, 9,  2,  9,  7,  2,  7,  3,  7,  9,  4, -1, -1, -1 ],
    [ 8,  4,  7,  3,  11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 11, 4,  7,  11, 2,  4,  2,  0,  4, -1, -1, -1, -1, -1, -1 ],
    [ 9,  0,  1,  8,  4,  7,  2,  3,  11,-1, -1, -1, -1, -1, -1 ],
    [ 4,  7,  11, 9,  4,  11, 9,  11, 2,  9,  2,  1, -1, -1, -1 ],
    [ 3,  10, 1,  3,  11, 10, 7,  8,  4, -1, -1, -1, -1, -1, -1 ],
    [ 1,  11, 10, 1,  4,  11, 1,  0,  4,  7,  11, 4, -1, -1, -1 ],
    [ 4,  7,  8,  9,  0,  11, 9,  11, 10, 11, 0,  3, -1, -1, -1 ],
    [ 4,  7,  11, 4,  11, 9,  9,  11, 10,-1, -1, -1, -1, -1, -1 ],
    [ 9,  5,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  5,  4,  0,  8,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  5,  4,  1,  5,  0, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 8,  5,  4,  8,  3,  5,  3,  1,  5, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  10, 9,  5,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 3,  0,  8,  1,  2,  10, 4,  9,  5, -1, -1, -1, -1, -1, -1 ],
    [ 5,  2,  10, 5,  4,  2,  4,  0,  2, -1, -1, -1, -1, -1, -1 ],
    [ 2,  10, 5,  3,  2,  5,  3,  5,  4,  3,  4,  8, -1, -1, -1 ],
    [ 9,  5,  4,  2,  3,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  11, 2,  0,  8,  11, 4,  9,  5, -1, -1, -1, -1, -1, -1 ],
    [ 0,  5,  4,  0,  1,  5,  2,  3,  11,-1, -1, -1, -1, -1, -1 ],
    [ 2,  1,  5,  2,  5,  8,  2,  8,  11, 4,  8,  5, -1, -1, -1 ],
    [ 10, 3,  11, 10, 1,  3,  9,  5,  4, -1, -1, -1, -1, -1, -1 ],
    [ 4,  9,  5,  0,  8,  1,  8,  10, 1,  8,  11, 10,-1, -1, -1 ],
    [ 5,  4,  0,  5,  0,  11, 5,  11, 10, 11, 0,  3, -1, -1, -1 ],
    [ 5,  4,  8,  5,  8,  10, 10, 8,  11,-1, -1, -1, -1, -1, -1 ],
    [ 9,  7,  8,  5,  7,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  3,  0,  9,  5,  3,  5,  7,  3, -1, -1, -1, -1, -1, -1 ],
    [ 0,  7,  8,  0,  1,  7,  1,  5,  7, -1, -1, -1, -1, -1, -1 ],
    [ 1,  5,  3,  3,  5,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  7,  8,  9,  5,  7,  10, 1,  2, -1, -1, -1, -1, -1, -1 ],
    [ 10, 1,  2,  9,  5,  0,  5,  3,  0,  5,  7,  3, -1, -1, -1 ],
    [ 8,  0,  2,  8,  2,  5,  8,  5,  7,  10, 5,  2, -1, -1, -1 ],
    [ 2,  10, 5,  2,  5,  3,  3,  5,  7, -1, -1, -1, -1, -1, -1 ],
    [ 7,  9,  5,  7,  8,  9,  3,  11, 2, -1, -1, -1, -1, -1, -1 ],
    [ 9,  5,  7,  9,  7,  2,  9,  2,  0,  2,  7,  11,-1, -1, -1 ],
    [ 2,  3,  11, 0,  1,  8,  1,  7,  8,  1,  5,  7, -1, -1, -1 ],
    [ 11, 2,  1,  11, 1,  7,  7,  1,  5, -1, -1, -1, -1, -1, -1 ],
    [ 9,  5,  8,  8,  5,  7,  10, 1,  3,  10, 3,  11,-1, -1, -1 ],
    [ 5,  7,  0,  5,  0,  9,  7,  11, 0,  1,  0,  10, 11, 10, 0 ],
    [ 11, 10, 0,  11, 0,  3,  10, 5,  0,  8,  0,  7,  5,  7,  0 ],
    [ 11, 10, 5,  7,  11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 10, 6,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  3,  5,  10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  0,  1,  5,  10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  8,  3,  1,  9,  8,  5,  10, 6, -1, -1, -1, -1, -1, -1 ],
    [ 1,  6,  5,  2,  6,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  6,  5,  1,  2,  6,  3,  0,  8, -1, -1, -1, -1, -1, -1 ],
    [ 9,  6,  5,  9,  0,  6,  0,  2,  6, -1, -1, -1, -1, -1, -1 ],
    [ 5,  9,  8,  5,  8,  2,  5,  2,  6,  3,  2,  8, -1, -1, -1 ],
    [ 2,  3,  11, 10, 6,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 11, 0,  8,  11, 2,  0,  10, 6,  5, -1, -1, -1, -1, -1, -1 ],
    [ 0,  1,  9,  2,  3,  11, 5,  10, 6, -1, -1, -1, -1, -1, -1 ],
    [ 5,  10, 6,  1,  9,  2,  9,  11, 2,  9,  8,  11,-1, -1, -1 ],
    [ 6,  3,  11, 6,  5,  3,  5,  1,  3, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  11, 0,  11, 5,  0,  5,  1,  5,  11, 6, -1, -1, -1 ],
    [ 3,  11, 6,  0,  3,  6,  0,  6,  5,  0,  5,  9, -1, -1, -1 ],
    [ 6,  5,  9,  6,  9,  11, 11, 9,  8, -1, -1, -1, -1, -1, -1 ],
    [ 5,  10, 6,  4,  7,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  3,  0,  4,  7,  3,  6,  5,  10,-1, -1, -1, -1, -1, -1 ],
    [ 1,  9,  0,  5,  10, 6,  8,  4,  7, -1, -1, -1, -1, -1, -1 ],
    [ 10, 6,  5,  1,  9,  7,  1,  7,  3,  7,  9,  4, -1, -1, -1 ],
    [ 6,  1,  2,  6,  5,  1,  4,  7,  8, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  5,  5,  2,  6,  3,  0,  4,  3,  4,  7, -1, -1, -1 ],
    [ 8,  4,  7,  9,  0,  5,  0,  6,  5,  0,  2,  6, -1, -1, -1 ],
    [ 7,  3,  9,  7,  9,  4,  3,  2,  9,  5,  9,  6,  2,  6,  9 ],
    [ 3,  11, 2,  7,  8,  4,  10, 6,  5, -1, -1, -1, -1, -1, -1 ],
    [ 5,  10, 6,  4,  7,  2,  4,  2,  0,  2,  7,  11,-1, -1, -1 ],
    [ 0,  1,  9,  4,  7,  8,  2,  3,  11, 5,  10, 6, -1, -1, -1 ],
    [ 9,  2,  1,  9,  11, 2,  9,  4,  11, 7,  11, 4,  5,  10, 6 ],
    [ 8,  4,  7,  3,  11, 5,  3,  5,  1,  5,  11, 6, -1, -1, -1 ],
    [ 5,  1,  11, 5,  11, 6,  1,  0,  11, 7,  11, 4,  0,  4,  11],
    [ 0,  5,  9,  0,  6,  5,  0,  3,  6,  11, 6,  3,  8,  4,  7 ],
    [ 6,  5,  9,  6,  9,  11, 4,  7,  9,  7,  11, 9, -1, -1, -1 ],
    [ 10, 4,  9,  6,  4,  10,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  10, 6,  4,  9,  10, 0,  8,  3, -1, -1, -1, -1, -1, -1 ],
    [ 10, 0,  1,  10, 6,  0,  6,  4,  0, -1, -1, -1, -1, -1, -1 ],
    [ 8,  3,  1,  8,  1,  6,  8,  6,  4,  6,  1,  10,-1, -1, -1 ],
    [ 1,  4,  9,  1,  2,  4,  2,  6,  4, -1, -1, -1, -1, -1, -1 ],
    [ 3,  0,  8,  1,  2,  9,  2,  4,  9,  2,  6,  4, -1, -1, -1 ],
    [ 0,  2,  4,  4,  2,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 8,  3,  2,  8,  2,  4,  4,  2,  6, -1, -1, -1, -1, -1, -1 ],
    [ 10, 4,  9,  10, 6,  4,  11, 2,  3, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  2,  2,  8,  11, 4,  9,  10, 4,  10, 6, -1, -1, -1 ],
    [ 3,  11, 2,  0,  1,  6,  0,  6,  4,  6,  1,  10,-1, -1, -1 ],
    [ 6,  4,  1,  6,  1,  10, 4,  8,  1,  2,  1,  11, 8,  11, 1 ],
    [ 9,  6,  4,  9,  3,  6,  9,  1,  3,  11, 6,  3, -1, -1, -1 ],
    [ 8,  11, 1,  8,  1,  0,  11, 6,  1,  9,  1,  4,  6,  4,  1 ],
    [ 3,  11, 6,  3,  6,  0,  0,  6,  4, -1, -1, -1, -1, -1, -1 ],
    [ 6,  4,  8,  11, 6,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 7,  10, 6,  7,  8,  10, 8,  9,  10,-1, -1, -1, -1, -1, -1 ],
    [ 0,  7,  3,  0,  10, 7,  0,  9,  10, 6,  7,  10,-1, -1, -1 ],
    [ 10, 6,  7,  1,  10, 7,  1,  7,  8,  1,  8,  0, -1, -1, -1 ],
    [ 10, 6,  7,  10, 7,  1,  1,  7,  3, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  6,  1,  6,  8,  1,  8,  9,  8,  6,  7, -1, -1, -1 ],
    [ 2,  6,  9,  2,  9,  1,  6,  7,  9,  0,  9,  3,  7,  3,  9 ],
    [ 7,  8,  0,  7,  0,  6,  6,  0,  2, -1, -1, -1, -1, -1, -1 ],
    [ 7,  3,  2,  6,  7,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 2,  3,  11, 10, 6,  8,  10, 8,  9,  8,  6,  7, -1, -1, -1 ],
    [ 2,  0,  7,  2,  7,  11, 0,  9,  7,  6,  7,  10, 9,  10, 7 ],
    [ 1,  8,  0,  1,  7,  8,  1,  10, 7,  6,  7,  10, 2,  3,  11],
    [ 11, 2,  1,  11, 1,  7,  10, 6,  1,  6,  7,  1, -1, -1, -1 ],
    [ 8,  9,  6,  8,  6,  7,  9,  1,  6,  11, 6,  3,  1,  3,  6 ],
    [ 0,  9,  1,  11, 6,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 7,  8,  0,  7,  0,  6,  3,  11, 0,  11, 6,  0, -1, -1, -1 ],
    [ 7,  11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 7,  6,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 3,  0,  8,  11, 7,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  1,  9,  11, 7,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 8,  1,  9,  8,  3,  1,  11, 7,  6, -1, -1, -1, -1, -1, -1 ],
    [ 10, 1,  2,  6,  11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  10, 3,  0,  8,  6,  11, 7, -1, -1, -1, -1, -1, -1 ],
    [ 2,  9,  0,  2,  10, 9,  6,  11, 7, -1, -1, -1, -1, -1, -1 ],
    [ 6,  11, 7,  2,  10, 3,  10, 8,  3,  10, 9,  8, -1, -1, -1 ],
    [ 7,  2,  3,  6,  2,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 7,  0,  8,  7,  6,  0,  6,  2,  0, -1, -1, -1, -1, -1, -1 ],
    [ 2,  7,  6,  2,  3,  7,  0,  1,  9, -1, -1, -1, -1, -1, -1 ],
    [ 1,  6,  2,  1,  8,  6,  1,  9,  8,  8,  7,  6, -1, -1, -1 ],
    [ 10, 7,  6,  10, 1,  7,  1,  3,  7, -1, -1, -1, -1, -1, -1 ],
    [ 10, 7,  6,  1,  7,  10, 1,  8,  7,  1,  0,  8, -1, -1, -1 ],
    [ 0,  3,  7,  0,  7,  10, 0,  10, 9,  6,  10, 7, -1, -1, -1 ],
    [ 7,  6,  10, 7,  10, 8,  8,  10, 9, -1, -1, -1, -1, -1, -1 ],
    [ 6,  8,  4,  11, 8,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 3,  6,  11, 3,  0,  6,  0,  4,  6, -1, -1, -1, -1, -1, -1 ],
    [ 8,  6,  11, 8,  4,  6,  9,  0,  1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  4,  6,  9,  6,  3,  9,  3,  1,  11, 3,  6, -1, -1, -1 ],
    [ 6,  8,  4,  6,  11, 8,  2,  10, 1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  10, 3,  0,  11, 0,  6,  11, 0,  4,  6, -1, -1, -1 ],
    [ 4,  11, 8,  4,  6,  11, 0,  2,  9,  2,  10, 9, -1, -1, -1 ],
    [ 10, 9,  3,  10, 3,  2,  9,  4,  3,  11, 3,  6,  4,  6,  3 ],
    [ 8,  2,  3,  8,  4,  2,  4,  6,  2, -1, -1, -1, -1, -1, -1 ],
    [ 0,  4,  2,  4,  6,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  9,  0,  2,  3,  4,  2,  4,  6,  4,  3,  8, -1, -1, -1 ],
    [ 1,  9,  4,  1,  4,  2,  2,  4,  6, -1, -1, -1, -1, -1, -1 ],
    [ 8,  1,  3,  8,  6,  1,  8,  4,  6,  6,  10, 1, -1, -1, -1 ],
    [ 10, 1,  0,  10, 0,  6,  6,  0,  4, -1, -1, -1, -1, -1, -1 ],
    [ 4,  6,  3,  4,  3,  8,  6,  10, 3,  0,  3,  9,  10, 9,  3 ],
    [ 10, 9,  4,  6,  10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  9,  5,  7,  6,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  3,  4,  9,  5,  11, 7,  6, -1, -1, -1, -1, -1, -1 ],
    [ 5,  0,  1,  5,  4,  0,  7,  6,  11,-1, -1, -1, -1, -1, -1 ],
    [ 11, 7,  6,  8,  3,  4,  3,  5,  4,  3,  1,  5, -1, -1, -1 ],
    [ 9,  5,  4,  10, 1,  2,  7,  6,  11,-1, -1, -1, -1, -1, -1 ],
    [ 6,  11, 7,  1,  2,  10, 0,  8,  3,  4,  9,  5, -1, -1, -1 ],
    [ 7,  6,  11, 5,  4,  10, 4,  2,  10, 4,  0,  2, -1, -1, -1 ],
    [ 3,  4,  8,  3,  5,  4,  3,  2,  5,  10, 5,  2,  11, 7,  6 ],
    [ 7,  2,  3,  7,  6,  2,  5,  4,  9, -1, -1, -1, -1, -1, -1 ],
    [ 9,  5,  4,  0,  8,  6,  0,  6,  2,  6,  8,  7, -1, -1, -1 ],
    [ 3,  6,  2,  3,  7,  6,  1,  5,  0,  5,  4,  0, -1, -1, -1 ],
    [ 6,  2,  8,  6,  8,  7,  2,  1,  8,  4,  8,  5,  1,  5,  8 ],
    [ 9,  5,  4,  10, 1,  6,  1,  7,  6,  1,  3,  7, -1, -1, -1 ],
    [ 1,  6,  10, 1,  7,  6,  1,  0,  7,  8,  7,  0,  9,  5,  4 ],
    [ 4,  0,  10, 4,  10, 5,  0,  3,  10, 6,  10, 7,  3,  7,  10],
    [ 7,  6,  10, 7,  10, 8,  5,  4,  10, 4,  8,  10,-1, -1, -1 ],
    [ 6,  9,  5,  6,  11, 9,  11, 8,  9, -1, -1, -1, -1, -1, -1 ],
    [ 3,  6,  11, 0,  6,  3,  0,  5,  6,  0,  9,  5, -1, -1, -1 ],
    [ 0,  11, 8,  0,  5,  11, 0,  1,  5,  5,  6,  11,-1, -1, -1 ],
    [ 6,  11, 3,  6,  3,  5,  5,  3,  1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  10, 9,  5,  11, 9,  11, 8,  11, 5,  6, -1, -1, -1 ],
    [ 0,  11, 3,  0,  6,  11, 0,  9,  6,  5,  6,  9,  1,  2,  10],
    [ 11, 8,  5,  11, 5,  6,  8,  0,  5,  10, 5,  2,  0,  2,  5 ],
    [ 6,  11, 3,  6,  3,  5,  2,  10, 3,  10, 5,  3, -1, -1, -1 ],
    [ 5,  8,  9,  5,  2,  8,  5,  6,  2,  3,  8,  2, -1, -1, -1 ],
    [ 9,  5,  6,  9,  6,  0,  0,  6,  2, -1, -1, -1, -1, -1, -1 ],
    [ 1,  5,  8,  1,  8,  0,  5,  6,  8,  3,  8,  2,  6,  2,  8 ],
    [ 1,  5,  6,  2,  1,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  3,  6,  1,  6,  10, 3,  8,  6,  5,  6,  9,  8,  9,  6 ],
    [ 10, 1,  0,  10, 0,  6,  9,  5,  0,  5,  6,  0, -1, -1, -1 ],
    [ 0,  3,  8,  5,  6,  10,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 10, 5,  6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 11, 5,  10, 7,  5,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 11, 5,  10, 11, 7,  5,  8,  3,  0, -1, -1, -1, -1, -1, -1 ],
    [ 5,  11, 7,  5,  10, 11, 1,  9,  0, -1, -1, -1, -1, -1, -1 ],
    [ 10, 7,  5,  10, 11, 7,  9,  8,  1,  8,  3,  1, -1, -1, -1 ],
    [ 11, 1,  2,  11, 7,  1,  7,  5,  1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  3,  1,  2,  7,  1,  7,  5,  7,  2,  11,-1, -1, -1 ],
    [ 9,  7,  5,  9,  2,  7,  9,  0,  2,  2,  11, 7, -1, -1, -1 ],
    [ 7,  5,  2,  7,  2,  11, 5,  9,  2,  3,  2,  8,  9,  8,  2 ],
    [ 2,  5,  10, 2,  3,  5,  3,  7,  5, -1, -1, -1, -1, -1, -1 ],
    [ 8,  2,  0,  8,  5,  2,  8,  7,  5,  10, 2,  5, -1, -1, -1 ],
    [ 9,  0,  1,  5,  10, 3,  5,  3,  7,  3,  10, 2, -1, -1, -1 ],
    [ 9,  8,  2,  9,  2,  1,  8,  7,  2,  10, 2,  5,  7,  5,  2 ],
    [ 1,  3,  5,  3,  7,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  7,  0,  7,  1,  1,  7,  5, -1, -1, -1, -1, -1, -1 ],
    [ 9,  0,  3,  9,  3,  5,  5,  3,  7, -1, -1, -1, -1, -1, -1 ],
    [ 9,  8,  7,  5,  9,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 5,  8,  4,  5,  10, 8,  10, 11, 8, -1, -1, -1, -1, -1, -1 ],
    [ 5,  0,  4,  5,  11, 0,  5,  10, 11, 11, 3,  0, -1, -1, -1 ],
    [ 0,  1,  9,  8,  4,  10, 8,  10, 11, 10, 4,  5, -1, -1, -1 ],
    [ 10, 11, 4,  10, 4,  5,  11, 3,  4,  9,  4,  1,  3,  1,  4 ],
    [ 2,  5,  1,  2,  8,  5,  2,  11, 8,  4,  5,  8, -1, -1, -1 ],
    [ 0,  4,  11, 0,  11, 3,  4,  5,  11, 2,  11, 1,  5,  1,  11],
    [ 0,  2,  5,  0,  5,  9,  2,  11, 5,  4,  5,  8,  11, 8,  5 ],
    [ 9,  4,  5,  2,  11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 2,  5,  10, 3,  5,  2,  3,  4,  5,  3,  8,  4, -1, -1, -1 ],
    [ 5,  10, 2,  5,  2,  4,  4,  2,  0, -1, -1, -1, -1, -1, -1 ],
    [ 3,  10, 2,  3,  5,  10, 3,  8,  5,  4,  5,  8,  0,  1,  9 ],
    [ 5,  10, 2,  5,  2,  4,  1,  9,  2,  9,  4,  2, -1, -1, -1 ],
    [ 8,  4,  5,  8,  5,  3,  3,  5,  1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  4,  5,  1,  0,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 8,  4,  5,  8,  5,  3,  9,  0,  5,  0,  3,  5, -1, -1, -1 ],
    [ 9,  4,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  11, 7,  4,  9,  11, 9,  10, 11,-1, -1, -1, -1, -1, -1 ],
    [ 0,  8,  3,  4,  9,  7,  9,  11, 7,  9,  10, 11,-1, -1, -1 ],
    [ 1,  10, 11, 1,  11, 4,  1,  4,  0,  7,  4,  11,-1, -1, -1 ],
    [ 3,  1,  4,  3,  4,  8,  1,  10, 4,  7,  4,  11, 10, 11, 4 ],
    [ 4,  11, 7,  9,  11, 4,  9,  2,  11, 9,  1,  2, -1, -1, -1 ],
    [ 9,  7,  4,  9,  11, 7,  9,  1,  11, 2,  11, 1,  0,  8,  3 ],
    [ 11, 7,  4,  11, 4,  2,  2,  4,  0, -1, -1, -1, -1, -1, -1 ],
    [ 11, 7,  4,  11, 4,  2,  8,  3,  4,  3,  2,  4, -1, -1, -1 ],
    [ 2,  9,  10, 2,  7,  9,  2,  3,  7,  7,  4,  9, -1, -1, -1 ],
    [ 9,  10, 7,  9,  7,  4,  10, 2,  7,  8,  7,  0,  2,  0,  7 ],
    [ 3,  7,  10, 3,  10, 2,  7,  4,  10, 1,  10, 0,  4,  0,  10],
    [ 1,  10, 2,  8,  7,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  9,  1,  4,  1,  7,  7,  1,  3, -1, -1, -1, -1, -1, -1 ],
    [ 4,  9,  1,  4,  1,  7,  0,  8,  1,  8,  7,  1, -1, -1, -1 ],
    [ 4,  0,  3,  7,  4,  3, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 4,  8,  7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 9,  10, 8,  10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 3,  0,  9,  3,  9,  11, 11, 9,  10,-1, -1, -1, -1, -1, -1 ],
    [ 0,  1,  10, 0,  10, 8,  8,  10, 11,-1, -1, -1, -1, -1, -1 ],
    [ 3,  1,  10, 11, 3,  10,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  2,  11, 1,  11, 9,  9,  11, 8, -1, -1, -1, -1, -1, -1 ],
    [ 3,  0,  9,  3,  9,  11, 1,  2,  9,  2,  11, 9, -1, -1, -1 ],
    [ 0,  2,  11, 8,  0,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 3,  2,  11,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 2,  3,  8,  2,  8,  10, 10, 8,  9, -1, -1, -1, -1, -1, -1 ],
    [ 9,  10, 2,  0,  9,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 2,  3,  8,  2,  8,  10, 0,  1,  8,  1,  10, 8, -1, -1, -1 ],
    [ 1,  10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 1,  3,  8,  9,  1,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  9,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [ 0,  3,  8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
];


/*




 ======================== Web workers stuff here =============================



 */





self.onmessage = function(e) {
    /* Type is MC for marching cube or Points for grid point */
    const { offset, Size, Type } = e.data;
    let cubes;
    
    
    if (Type == "MC") {
        cubes = createChunkTest(offset, Size);
    }

    if (Type == "Points") {
        cubes = createChunkAsAGrid(offset, Size);
    }



    self.postMessage(cubes);
};






function Volume(x, y, z) {

    
    // This is for a sphere of radius r

    /*
    const r = 2;   
    const distanceToOrigin = Math.sqrt(x * x + y * y + z * z);
    return distanceToOrigin <= r;
    */
    
    
    //fancy little balls floating
    /*
    const threshold = 0.5;
    const dilation = .3;
    return Math.cos(x*dilation)*Math.cos(y*dilation)*Math.cos(z*dilation) > threshold
    */
    


   const dilation = .02;
   const threshold = 0;
   return mandelbulb(x*dilation,y*dilation,z*dilation)> threshold;
   /*
*/


}



function mandelbulb(x, y, z) {
    let cx = x, cy = y, cz = z;
    let dr = 1.5;
    let r = 0, theta = 0, phi = 0;
    const maxIterations = 16;
    for (let i = 0; i < maxIterations && r < dr; i++) {
        let rSquared = cx * cx + cy * cy + cz * cz;
        theta = Math.acos(cz / Math.sqrt(rSquared));
        phi = Math.atan2(cy, cx);
        r = Math.pow(rSquared, 0.5);
        let newR = Math.pow(r, 8);
        theta *= 8;
        phi *= 8;
        cx = newR * Math.sin(theta) * Math.cos(phi) + x;
        cy = newR * Math.sin(theta) * Math.sin(phi) + y;
        cz = newR * Math.cos(theta) + z;
    }
    return r - dr;
}







function createChunkTest(offset, Size) {
    /* 
    Webworker that generates a 3D grid of points in space. Useful for debug.
    */




    let geometryData = { vertices: [], faces: [] };

    // Initialize an empty 3D array
    const points = [];

    // 3D grid point
    let off = 1 // add 1 point to the array to take into account the border.
    for (let x = 0; x < Size+off; x++) {
        const yArray = [];
        for (let y = 0; y < Size+off; y++) {
            const zArray = [];
            for (let z = 0; z < Size+off; z++) {
                /* Volume has to return a boolean value (in or out)*/
                zArray.push(Volume(x+(offset[0]*Size),
                                   y+(offset[1]*Size), 
                                   z+(offset[2]*Size)));
            }
            yArray.push(zArray);
        }
        points.push(yArray);
    }


    


    // loop for the marching cube algo
    //off just for quickfix control on the loop

    geometry_offset = 0;
    for (let x = 0; x < Size; x++) {
        for (let y = 0; y < Size; y++) {
            for (let z = 0; z < Size; z++) {
                
                /* Marching cube here, yes yes */

                //points of the cube
                let cube_points = [
                    [x, y, z],
                    [x, y, z+1],
                    [x+1, y, z+1],
                    [x+1, y, z],
                    [x, y+1, z],
                    [x, y+1, z+1],
                    [x+1, y+1, z+1],

                    [x+1, y+1, z],
                ]

                /*
                let cube_points = [
                    [x, y, z],
                    [x+1, y, z],
                    [x, y+1, z],
                    [x+1, y+1, z],
                    [x, y, z+1],
                    [x+1, y, z+1],
                    [x, y+1, z+1],
                    [x+1, y+1, z+1],
                ]*/





                // states of each point
                let points_state = []
                cube_points.forEach(point => {
                    points_state.push(points[point[0]][point[1]][point[2]])
                });




                /** computes the configuration index. */
                // Convert the array of true or false values into a binary string
                const binaryString = points_state.map(val => val ? '1' : '0').join('');
                
                // Convert the binary string to an integer
                /*
                Turns out we need to flip the binary array as the map is reversed for the binary number

                 */
                const configIndex = parseInt(binaryString.split('').reverse().join(''), 2);


                // get the right configuration
                const TrianglesVertices = TriangleTable[configIndex];
                
                

                TrianglesVertices.forEach(edge_index => {
                    
                    // check edge is above or equal to 0, escape condition of the table
                    if (edge_index != -1) {
                        let edge = EdgeVertexIndices[edge_index];
                        
                        // get position in the chunk basis space
    
                        // points of the edge
                        let p1 = cube_points[edge[0]];
                        let p2 = cube_points[edge[1]];



                        let interpolated_point = [
                            (p1[0]+p2[0])/2,
                            (p1[1]+p2[1])/2,
                            (p1[2]+p2[2])/2,
                        ];


                        geometryData.vertices.push(
                            interpolated_point[0]+(offset[0]*Size),
                            interpolated_point[1]+(offset[1]*Size),
                            interpolated_point[2]+(offset[2]*Size),
                            );
                    
                    }
                    


                });





            












            }
        }
    }



    /*  careful to put that loop *outside* of the vertex creation*/
    /* turns out generating the faces is useless since it's redone in main.js
        Impact on performance, but oh well.*/
    
    for (let i = 0; i < geometryData.vertices.length/3; i++) {
        geometryData.faces.push(i*3+2);
        geometryData.faces.push(i*3+1);
        geometryData.faces.push(i*3);
    }   

    return geometryData;
}















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
                    [.05, 0, 0],
                    [0, .05, 0],
                    [0, 0, .05]
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







