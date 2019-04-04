import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class TriangularPrism extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;
  colors: Float32Array;
  offsets: Float32Array; // Data for bufTranslate
  r1s: Float32Array;
  r2s: Float32Array;
  r3s: Float32Array;
  scales: Float32Array;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  create() {

    //front face
  this.indices = new Uint32Array([0, 1, 2,
                                  0, 2, 3,

                                  4, 5, 6,
                                  4, 6, 7,

                                  8, 9, 10,
                                  8, 10, 11,

                                  12, 13, 14,
                                  12, 14, 15,

                                  16, 17, 18,
                                  16, 18, 19,

                                  20, 21, 22,
                                  20, 22, 23
        ]);
  
  this.normals = new Float32Array([0, 0, 1, 0,
                                   0, 0, 1, 0,
                                   0, 0, 1, 0,
                                    0, 0, 1, 0,
                                /*right face*/
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                 /*back face*/
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                 /*left face*/
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                 /*top face*/
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                 /*bottom face*/
                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0
                                ]);
  this.positions = new Float32Array([this.center[0] - 1, this.center[1] - 1, this.center[2] + 1, 1,
    this.center[0] + 1, this.center[1] - 1, this.center[2] + 1, 1,
    this.center[0] + 1, this.center[1] + 1, this.center[2] + 1, 1,
    this.center[0] - 1, this.center[1] + 1, this.center[2] + 1, 1,
                                    /*right face*/
    this.center[0] + 1, this.center[1] - 1, this.center[2] + 1, 1,
    this.center[0] + 1, this.center[1] - 1, this.center[2] - 1, 1,
    this.center[0] + 1, this.center[1] + 1, this.center[2] - 1, 1,
    this.center[0] + 1, this.center[1] + 1, this.center[2] + 1, 1,
                                    /*back face*/
    this.center[0] - 1, this.center[1] - 1, this.center[2] - 1, 1,
    this.center[0] + 1, this.center[1] - 1, this.center[2] - 1, 1,
    this.center[0] + 1, this.center[1] + 1, this.center[2] - 1, 1,
    this.center[0] - 1, this.center[1] + 1, this.center[2] - 1, 1,
                                    /*left face*/
    this.center[0] - 1, this.center[1] - 1, this.center[2] + 1, 1,
    this.center[0] - 1, this.center[1] - 1, this.center[2] - 1, 1,
    this.center[0] - 1, this.center[1] + 1, this.center[2] - 1, 1,
    this.center[0] - 1, this.center[1] + 1, this.center[2] + 1, 1,
                                     /*top face*/
    this.center[0] + 1, this.center[1] + 1, this.center[2] + 1, 1,
    this.center[0] + 1, this.center[1] + 1, this.center[2] - 1, 1,
    this.center[0] - 1, this.center[1] + 1, this.center[2] - 1, 1,
    this.center[0] - 1, this.center[1] + 1, this.center[2] + 1, 1,
                                     /*bottom face*/
    this.center[0] + 1, this.center[1] - 1, this.center[2] + 1, 1,
    this.center[0] - 1, this.center[1] - 1, this.center[2] + 1, 1,
    this.center[0] - 1, this.center[1] - 1, this.center[2] - 1, 1,
    this.center[0] + 1, this.center[1] - 1, this.center[2] - 1, 1
                                    ]);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateCol();
    this.generateTranslate();
    this.generateR1();
    this.generateR2();
    this.generateR3();
    this.generateScale();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created cube`);
  }
  
  setInstanceVBOs(offsets: Float32Array, colors: Float32Array, r1s: Float32Array,
    r2s: Float32Array, r3s: Float32Array, scales: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;
    this.r1s = r1s;
    this.r2s = r2s;
    this.r3s = r3s;
    this.scales = scales;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufR1);
    gl.bufferData(gl.ARRAY_BUFFER, this.r1s, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufR2);
    gl.bufferData(gl.ARRAY_BUFFER, this.r2s, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufR3);
    gl.bufferData(gl.ARRAY_BUFFER, this.r3s, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufScale);
    gl.bufferData(gl.ARRAY_BUFFER, this.scales, gl.STATIC_DRAW);
  }
};

export default TriangularPrism;