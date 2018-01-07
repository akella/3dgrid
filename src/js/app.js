import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);

import Perlin from './lib/perlin.js';

let size = 300;



var camera, controls, scene, renderer, mesh, meshX,meshY,groupX,groupY,geometry,material;

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
  camera.position.set(0, -144, 30);
  scene.position.x = -100;
  scene.position.y = -50;


  controls = new OrbitControls(camera, renderer.domElement);


  // do something

  

  material = new THREE.ShaderMaterial({
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




let time = 0;
function animate() {
  time++;
  material.uniforms.time.value = time;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
