import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);

import Perlin from './lib/perlin.js';

let size = 120;



var camera, controls, scene, renderer, mesh, meshX,meshY,groupX,groupY;

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

  groupX = new THREE.Group();
  groupY = new THREE.Group();

  scene.add(groupX);
  scene.add(groupY);

  controls = new OrbitControls(camera, renderer.domElement);


  // do something

  let material = new THREE.LineBasicMaterial( {color: 0xffffff});

  

  for (var j = 0; j < size; j++) {
  	  let geometryX = new THREE.Geometry();
  	  let geometryY = new THREE.Geometry();
	  for (var i = 0; i < size; i++) {
	  	geometryX.vertices.push(
	  		new THREE.Vector3( i*10, j*10, 0 )
	  	);
	  	geometryY.vertices.push(
	  		new THREE.Vector3( j*10, i*10, 0 )
	  	);
	  }
	  meshX = new THREE.Line(geometryX,material);
	  meshY = new THREE.Line(geometryY,material);
	  groupX.add(meshX);
	  groupY.add(meshY);
  }




  

  



  // end of everything

  animate();
}


function UpdateGrid(time) {
  for (var i = 0; i < size; i++) {
    let lineX = groupX.children[i];
    let lineY = groupY.children[i];
    for (var j = 0; j < size; j++) {
      let vecX = lineX.geometry.vertices[j];
      let vecY = lineY.geometry.vertices[j];
      vecX.z = 100*Perlin(vecX.x/100,vecX.y/100,time/100);
      vecY.z = 100*Perlin(vecY.x/100,vecY.y/100,time/100);
    }
    lineX.geometry.verticesNeedUpdate = true;
    lineY.geometry.verticesNeedUpdate = true;
  }
}


let time = 0;
function animate() {
  time++;
  UpdateGrid(time);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
