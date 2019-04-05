import {vec2, vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import RoadSystem from './RoadSystem';
import Plane from './geometry/Plane';
import Cube from './geometry/Cube';
import TriangularPrism from './geometry/TriangularPrism';
import Mesh from './geometry/Mesh';
import {readTextFile} from './globals';
import BuildingSystem from './BuildingSystem';
import Building from './Building';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  Height_Map:  1,
  Density_Map: 0,
  Land_Water_Mode: 0,
  Population_Density: 0,
  Road_Density: 20,
  Water_Level: 1
};

let square: Square;
let cube : Cube;
let hexagon : Mesh;
let cylinder : Mesh;
let plane: Plane = new Plane(vec3.fromValues(0,0,0), vec2.fromValues(8,8), 20);
let screenQuad: ScreenQuad = new ScreenQuad();
let time: number = 0.0;
let system: RoadSystem;
let buildsystem: BuildingSystem;
let obj0: string = readTextFile('./src/resources/hexagon.obj');
let obj1: string = readTextFile('./src/resources/cylinder.obj');
let mesh : Mesh;


function loadScene() {
  square = new Square();
  hexagon = new Mesh(obj0,vec3.fromValues(0.0,0.0,0.0));
  hexagon.create();
  cylinder = new Mesh(obj1,vec3.fromValues(0.0,0.0,0.0));
  cylinder.create();
  cube = new Cube(vec3.fromValues(0,0,0));
  cube.create();
  square.create();
  // mesh = new Mesh(obj0, vec3.fromValues(0,0,0));
  // mesh.create();

  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  system.setMaxLength(controls.Road_Density);
  let data = system.runSystem();
  buildsystem = new BuildingSystem(10.0, system, window.innerWidth, window.innerHeight);

  buildsystem.placeBuildings();

  let buildings : Building[] = buildsystem.buildings;

  let offsetsArray = [];
  let colorsArray = [];
  let r1Array = [];
  let r2Array = [];
  let r3Array = [];
  let scaleArray = [];

  let offsetsArrayB = [];
  let colorsArrayB = [];
  let r1ArrayB = [];
  let r2ArrayB = [];
  let r3ArrayB = [];
  let scaleArrayB = [];
  
   let n: number = data[0].length;

  let numInstancesH: number = 0;

  //console.log("n2: " + n2);

  for(let i = 0; i < buildings.length; i++) {
    for (let j = 0; j < buildings[i].positions.length; j++) {
      if (buildings[i].positions[j][3] == 1.0) {
        offsetsArrayB.push(1.0 * ((buildings[i].positions[j][0] * 2.0 / buildsystem.gridWidth) - 1.0));
        offsetsArrayB.push(0.02 * buildings[i].positions[j][1]);
        offsetsArrayB.push(1.0 * ((buildings[i].positions[j][2] * 2.0 / buildsystem.gridHeight) - 1.0));

        numInstancesH +=1;

        //console.log(1.0 * ((buildings[i].positions[j][1] * 2.0 / buildsystem.gridHeight)));
        //console.log("Pos: " + ((poses[i][0] * 2.0 / buildsystem.gridWidth) - 1.0) + ", " + ((poses[i][1] * 2.0 / buildsystem.gridWidth) - 1.0));

        r1ArrayB.push(1.0);
        r1ArrayB.push(0.0);
        r1ArrayB.push(0.0);

        r2ArrayB.push(0.0);
        r2ArrayB.push(1.0);
        r2ArrayB.push(0.0);

        r3ArrayB.push(0.0);
        r3ArrayB.push(0.0);
        r3ArrayB.push(1.0);

        scaleArrayB.push(0.01);
        scaleArrayB.push(0.01);
        scaleArrayB.push(0.01);

        colorsArrayB.push(1.0);
        colorsArrayB.push(1.0);
        colorsArrayB.push(0.0);
        colorsArrayB.push(1.0);
      }
      
    }
      
    }

  let offsetsB: Float32Array = new Float32Array(offsetsArrayB);
  let colorsB: Float32Array = new Float32Array(colorsArrayB);
  let r1sB: Float32Array = new Float32Array(r1ArrayB);
  let r2sB: Float32Array = new Float32Array(r2ArrayB);
  let r3sB: Float32Array = new Float32Array(r3ArrayB);
  let scalesB: Float32Array = new Float32Array(scaleArrayB);
  hexagon.setInstanceVBOs(offsetsB, colorsB, r1sB, r2sB, r3sB, scalesB);
  hexagon.setNumInstances(numInstancesH); // grid of "particles"

  let numInstancesC: number = 0;

  //console.log("n2: " + n2);

  offsetsArrayB = [];
  colorsArrayB = [];
  r1ArrayB = [];
  r2ArrayB = [];
  r3ArrayB = [];
  scaleArrayB = [];

  for(let i = 0; i < buildings.length; i++) {
    for (let j = 0; j < buildings[i].positions.length; j++) {
      if (buildings[i].positions[j][3] == 2.0) {
        offsetsArrayB.push(1.0 * ((buildings[i].positions[j][0] * 2.0 / buildsystem.gridWidth) - 1.0));
        offsetsArrayB.push(0.02 * buildings[i].positions[j][1]);
        offsetsArrayB.push(1.0 * ((buildings[i].positions[j][2] * 2.0 / buildsystem.gridHeight) - 1.0));

        numInstancesC +=1;

        //console.log(1.0 * ((buildings[i].positions[j][1] * 2.0 / buildsystem.gridHeight)));
        //console.log("Pos: " + ((poses[i][0] * 2.0 / buildsystem.gridWidth) - 1.0) + ", " + ((poses[i][1] * 2.0 / buildsystem.gridWidth) - 1.0));

        r1ArrayB.push(1.0);
        r1ArrayB.push(0.0);
        r1ArrayB.push(0.0);

        r2ArrayB.push(0.0);
        r2ArrayB.push(1.0);
        r2ArrayB.push(0.0);

        r3ArrayB.push(0.0);
        r3ArrayB.push(0.0);
        r3ArrayB.push(1.0);

        scaleArrayB.push(0.01);
        scaleArrayB.push(0.01);
        scaleArrayB.push(0.01);

        colorsArrayB.push(1.0);
        colorsArrayB.push(1.0);
        colorsArrayB.push(0.0);
        colorsArrayB.push(1.0);
      }
      
    }
      
    }

  offsetsB = new Float32Array(offsetsArrayB);
  colorsB = new Float32Array(colorsArrayB);
  r1sB = new Float32Array(r1ArrayB);
  r2sB = new Float32Array(r2ArrayB);
  r3sB = new Float32Array(r3ArrayB);
  scalesB = new Float32Array(scaleArrayB);
  cylinder.setInstanceVBOs(offsetsB, colorsB, r1sB, r2sB, r3sB, scalesB);
  cylinder.setNumInstances(numInstancesC); // grid of "particles"

  let numInstancesCu: number = 0;

  //console.log("n2: " + n2);

  offsetsArrayB = [];
  colorsArrayB = [];
  r1ArrayB = [];
  r2ArrayB = [];
  r3ArrayB = [];
  scaleArrayB = [];

  for(let i = 0; i < buildings.length; i++) {
    for (let j = 0; j < buildings[i].positions.length; j++) {
      if (buildings[i].positions[j][3] == 0.0) {
        offsetsArrayB.push(1.0 * ((buildings[i].positions[j][0] * 2.0 / buildsystem.gridWidth) - 1.0));
        offsetsArrayB.push(0.02 * buildings[i].positions[j][1]);
        offsetsArrayB.push(1.0 * ((buildings[i].positions[j][2] * 2.0 / buildsystem.gridHeight) - 1.0));

        numInstancesCu +=1;

        //console.log(1.0 * ((buildings[i].positions[j][1] * 2.0 / buildsystem.gridHeight)));
        //console.log("Pos: " + ((poses[i][0] * 2.0 / buildsystem.gridWidth) - 1.0) + ", " + ((poses[i][1] * 2.0 / buildsystem.gridWidth) - 1.0));

        r1ArrayB.push(1.0);
        r1ArrayB.push(0.0);
        r1ArrayB.push(0.0);

        r2ArrayB.push(0.0);
        r2ArrayB.push(1.0);
        r2ArrayB.push(0.0);

        r3ArrayB.push(0.0);
        r3ArrayB.push(0.0);
        r3ArrayB.push(1.0);

        scaleArrayB.push(0.01);
        scaleArrayB.push(0.01);
        scaleArrayB.push(0.01);

        colorsArrayB.push(1.0);
        colorsArrayB.push(1.0);
        colorsArrayB.push(0.0);
        colorsArrayB.push(1.0);
      }
      
    }
      
    }

  offsetsB = new Float32Array(offsetsArrayB);
  colorsB = new Float32Array(colorsArrayB);
  r1sB = new Float32Array(r1ArrayB);
  r2sB = new Float32Array(r2ArrayB);
  r3sB = new Float32Array(r3ArrayB);
  scalesB = new Float32Array(scaleArrayB);
  cube.setInstanceVBOs(offsetsB, colorsB, r1sB, r2sB, r3sB, scalesB);
  cube.setNumInstances(numInstancesCu); // grid of "particles"
  
  for(let i = 0; i < n; i++) {
    var pos = vec3.create();
    for(let j = 0; j < n; j++) {
      let position : vec3 = data[0][i];
      let r1 : vec3 = data[1][i];
      let r2 : vec3 = data[2][i];
      let r3 : vec3 = data[3][i];
      let scale : vec3 = data[4][i];

      pos = position;
      
      offsetsArray.push(position[0]);
      offsetsArray.push(position[1]);
      offsetsArray.push(1.0);

      r1Array.push(r1[0]);
      r1Array.push(r1[1]);
      r1Array.push(r1[2]);

      r2Array.push(r2[0]);
      r2Array.push(r2[1]);
      r2Array.push(r2[2]);

      r3Array.push(r3[0]);
      r3Array.push(r3[1]);
      r3Array.push(r3[2]);

      scaleArray.push(scale[0]);
      scaleArray.push(scale[1]);
      scaleArray.push(1.0);

      if (i == 0) {
        colorsArray.push(1.0);
        colorsArray.push(1.0);
        colorsArray.push(1.0);
        colorsArray.push(1.0); // Alpha channel
      } else {
        colorsArray.push((n - i + 1) / n);
        colorsArray.push((n - i + 1) / n);
        colorsArray.push((n - i + 1) / n);
        colorsArray.push(1.0); // Alpha channel
      }

    }
  }
  let offsets: Float32Array = new Float32Array(offsetsArray);
  let colors: Float32Array = new Float32Array(colorsArray);
  let r1s: Float32Array = new Float32Array(r1Array);
  let r2s: Float32Array = new Float32Array(r2Array);
  let r3s: Float32Array = new Float32Array(r3Array);
  let scales: Float32Array = new Float32Array(scaleArray);
  square.setInstanceVBOs(offsets, colors, r1s, r2s, r3s, scales);
  square.setNumInstances(n * n); // grid of "particles"
}

function loadTexture(camera : Camera, textureBuffer : ShaderProgram, renderer : OpenGLRenderer,
  gl : WebGL2RenderingContext, m_renderedTexture : WebGLTexture, m_depthRenderBuffer : WebGLRenderbuffer,
  m_frameBuffer : WebGLRenderbuffer) {
  screenQuad.create();

  gl.bindFramebuffer(gl.FRAMEBUFFER, m_frameBuffer);
    // Bind our texture so that all functions that deal with textures will interact with this one
  gl.bindTexture(gl.TEXTURE_2D, m_renderedTexture);
    //Give an empty image to OpenGL ( the last "0" )
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth, window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  // Set the render settings for the texture we've just created.
    // Essentially zero filtering on the "texture" so it appears exactly as rendered
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // Clamp the colors at the edge of our texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Initialize our depth buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, m_depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, window.innerWidth, window.innerHeight);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, m_depthRenderBuffer);

    // Set m_renderedTexture as the color output of our frame buffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, m_renderedTexture, 0);

    // Sets the color output of the fragment shader to be stored in GL_COLOR_ATTACHMENT0, 
    //which we previously set to m_renderedTextures[i]
    //gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

    //error checking
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
    {
        console.log("Frame buffer did not initialize correctly...");
    }

    // Render the 3D scene to our frame buffer

    // Render to our framebuffer rather than the viewport
    gl.bindFramebuffer(gl.FRAMEBUFFER, m_frameBuffer);
    // Render on the whole framebuffer, complete from the lower left corner to the upper right
    gl.viewport(0,0,window.innerWidth, window.innerHeight);
    // Clear the screen so that we only see newly drawn images
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the model
    //but first set our req unif variables~
    let state = vec4.fromValues(controls.Population_Density, controls.Water_Level, 0, 0);
    textureBuffer.setState(state);
    //mp_progSurfaceCurrent->draw(*mp_modelCurrent, 0);
    renderer.render(camera, textureBuffer, [screenQuad]);

    //save the texture for the lsystem!

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
      var pixels = new Uint8Array(window.innerWidth * window.innerHeight * 4);
      gl.readPixels(0, 0, window.innerWidth, window.innerHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      //now pass colorArray to turtle!
      system = new RoadSystem(pixels,5.0, window.innerHeight, window.innerWidth);
    }
}

function load(camera : Camera, textureBuffer : ShaderProgram, renderer : OpenGLRenderer,
  gl : WebGL2RenderingContext, m_renderedTexture : WebGLTexture, m_depthRenderBuffer : WebGLRenderbuffer,
  m_frameBuffer : WebGLRenderbuffer, postProcessPass :WebGLRenderbuffer) {
  loadTexture(camera, textureBuffer, renderer, gl, m_renderedTexture, m_depthRenderBuffer, m_frameBuffer);
  loadScene();
      // Tell OpenGL to render to the viewport's frame buffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      // Render on the whole framebuffer, complete from the lower left corner to the upper right
      gl.viewport(0,0,window.innerWidth, window.innerHeight);
      // Clear the screen
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // Bind our texture in Texture Unit 0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, m_renderedTexture);
      plane.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'Height_Map', 0, 1).step(1);
  gui.add(controls, 'Density_Map', 0, 1).step(1);
  gui.add(controls, 'Land_Water_Mode', 0, 1).step(1);
  gui.add(controls, 'Population_Density', 0, 1).step(0.5);
  gui.add(controls, 'Road_Density', 0, 100).step(1.0);
  gui.add(controls, 'Water_Level', 0, 2).step(1.0);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);


  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const buildingsShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/buildings-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/buildings-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const textureBuffer = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/texture-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/texture-frag.glsl')),
  ]);

  const skyShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/background-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/background-frag.glsl')),
  ]);

  var m_renderedTexture = gl.createTexture();
  var m_depthRenderBuffer = gl.createRenderbuffer();
  var m_frameBuffer = gl.createFramebuffer();
  var postProcessPass = gl.createFramebuffer();

  load(camera, textureBuffer, renderer, gl, m_renderedTexture, m_depthRenderBuffer, m_frameBuffer, postProcessPass);

  // This function will be called every frame
  let prevPop = controls.Population_Density;
  let prevRoad = controls.Road_Density;
  let prevWater = controls.Water_Level;
  function tick() {
    let popChanged : boolean = false;
    if (controls.Population_Density - prevPop != 0.0) {
      prevPop = controls.Population_Density;
      let state = vec4.fromValues(controls.Population_Density, controls.Water_Level, 0, 0);
      textureBuffer.setState(state);
      load(camera, textureBuffer, renderer, gl, m_renderedTexture, m_depthRenderBuffer, m_frameBuffer, postProcessPass);
    }
    if (controls.Road_Density - prevRoad != 0.0) {
      prevRoad = controls.Road_Density;
      load(camera, textureBuffer, renderer, gl, m_renderedTexture, m_depthRenderBuffer, m_frameBuffer, postProcessPass);
    }
    if (controls.Water_Level - prevWater != 0.0) {
      prevWater = controls.Water_Level;
      let state = vec4.fromValues(controls.Population_Density, controls.Water_Level, 0, 0);
      textureBuffer.setState(state);
      load(camera, textureBuffer, renderer, gl, m_renderedTexture, m_depthRenderBuffer, m_frameBuffer, postProcessPass);
    }
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    buildingsShader.setTime(time);
    skyShader.setTime(time);
    flat.setTime(time++);
    flat.setState(vec4.fromValues(controls.Height_Map,controls.Density_Map,(controls.Height_Map + controls.Density_Map) - 1.0, controls.Land_Water_Mode));
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.render(camera, flat, [plane]);
    renderer.render(camera, skyShader, [screenQuad]);
    renderer.render(camera, instancedShader, [
      square,
    ]);
    renderer.render(camera, buildingsShader, [
      cube, hexagon, cylinder,
    ]);



    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }



  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
