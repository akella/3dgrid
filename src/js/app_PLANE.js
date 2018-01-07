import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);

import Perlin from './lib/perlin.js';

let size = 120;



var camera, controls, scene, renderer, mesh, meshX,meshY,groupX,groupY,geometry;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer();



  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.z = 200;
  scene.position.x = -100;
  scene.position.y = -100;


  controls = new OrbitControls(camera, renderer.domElement);


  // do something

  

  var material = new THREE.ShaderMaterial({
    	// wireframe: true,
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable',
    },
    uniforms: {
      	time: {type: 'f', value: 0.0},
    },
    vertexShader: document.getElementById('vertShader').textContent,
    fragmentShader: document.getElementById('fragShader').textContent,
    side: THREE.DoubleSide,
    transparent: true
  });
  
  geometry = new THREE.PlaneGeometry( 600,600, size,size);

  mesh = new THREE.Mesh(geometry,material);


  scene.add(mesh);
  



  // end of everything

  animate();
}


function UpdatePlane(time) {
  for (var i = 0; i < geometry.vertices.length; i++) {
    let vec = geometry.vertices[i];
    vec.z = 100 * Perlin(vec.x/100,vec.y/100,time/1000);
  }
  geometry.verticesNeedUpdate = true;
}


let time = 0;
function animate() {
  time++;
  UpdatePlane(time);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
