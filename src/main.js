import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {Sandbox} from '/sandbox.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


// scene init 
const scene = new THREE.Scene();

// camera init
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 7;
camera.position.x = 4;
camera.position.y = 25;

// help with axes helper "The X axis is red. The Y axis is green. The Z axis is blue."
// const axesHelper = new THREE.AxesHelper( 20 );
// scene.add( axesHelper );

// renderer initialization 
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// orbit controls 
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// make a light 
function makeLight({color, intensity, x_pos, y_pos, z_pos}){
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x_pos, y_pos, z_pos); 
  return light; 
}

// add the light to our scene 
scene.add(makeLight({color: '#FFFFFF', intensity: 6, x_pos: -1, y_pos: 2, z_pos: 4}));

// create our Sandbox
const sandbox = new Sandbox(10,15,10, scene); 

addEventListener("keypress", (event) => {
  if (event.key == " "){
    sandbox.update();
  }
 })

// rotate the global cube 
function render(time) {
  time *= 0.001; 

  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);

}
// tell the browser we want to animate something 
requestAnimationFrame(render);