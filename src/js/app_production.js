import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);



var mouse = new THREE.Vector2();
let size = 180;
var raycaster,camera,pos, mat,controls, scene, renderer, geometry,geometry1,mesh,light,plight;


function init() {
  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();
  scene.background = new THREE.Color(0x4360ab);
  scene.fog = new THREE.Fog( 0x4360ab, 10,140 );

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth , window.innerWidth );

  var container = document.getElementById('container');

  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.set(0, -44, 60);

  controls = new OrbitControls(camera, renderer.domElement);



  geometry = new THREE.Geometry();







 




 

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();






  mat = new THREE.ShaderMaterial({
    // wireframe: true,
    derivatives: '#extension GL_OES_standard_derivatives : enable',
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib['lights'],
      {
        lightIntensity: {type: 'f', value: 1.0},
        time: {type: 'f', value: 0.0},
        koeff: {type: 'f', value: 0.0},
        mouse: {type: 'vec2', value: new THREE.Vector2(35,35)},
        fogColor: {
          type: 'c',
          value: 0x000000
        },
        fogFar: {
          type: 'f',
          value: 10
        },
        fogNear: {
          type: 'f',
          value: 0.015
        },
        fogC: {
          type: 'c',
          value: new THREE.Color(0x4360ab)
        },
      }
    ]),
    fog: true,
    vertexShader: `varying vec2 vUv;
varying vec3 vecPos;
varying vec3 v_position;
uniform float time;
uniform vec2 mouse;
uniform float koeff;
${THREE.ShaderChunk[ 'common' ]}
${THREE.ShaderChunk[ 'fog_pars_vertex' ]}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); 
  vec3 Pi1 = Pi0 + vec3(1.0); 
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); 
  vec3 Pf1 = Pf0 - vec3(1.0); 
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}



float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
  vUv = uv;
  v_position = position;
  
  
 
    v_position.z = 20. + 20.0*cnoise(vec3(v_position.x/30.0,v_position.y/100.,time/160.0));


    float dist = distance(mouse,v_position.xy);
    dist = (30. - clamp(dist,0.,30.))/30. ;
    v_position.z = (v_position.z*(1. - koeff) + v_position.z*koeff)*sin(0.5 - dist/2.);
    v_position.z = 40. - v_position.z;

  
  

  vecPos = (modelViewMatrix * vec4(v_position, 1.0)).xyz;

  gl_Position = projectionMatrix * vec4(vecPos, 1.0);
}`,
    fragmentShader: `
varying vec3 v_position;
varying vec2 vUv;
uniform vec3 fogC;
${THREE.ShaderChunk[ 'common' ]}
${THREE.ShaderChunk[ 'fog_pars_fragment' ]}


void main(void) {


	  vec2 coord = v_position.xy;
	  vec2 grid = abs(fract(coord/3.33 - 0.5) - 0.5) / fwidth(coord/2.);
	  float line = min(grid.x, grid.y);
	  float ggg = 1.0 - min(line, 1.0);


      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep( fogNear, fogFar, depth );
      vec2 st = vUv*10.;
      vec3 color = vec3(0.0);
      float kof = clamp((v_position.z - 34.)/5.,0.,1.);
      vec3 white = vec3(0.42,0.5,0.74);

      vec3 target = vec3(0.3,0.79,0.71);
      vec3 newcolor = mix(white, target, kof);
      gl_FragColor = vec4(newcolor,ggg);
      gl_FragColor = mix( gl_FragColor, vec4( fogC, gl_FragColor.w ), fogFactor );
      
}`,
    transparent: true,
    lights: true,
    side: THREE.DoubleSide,
  });
  console.log(THREE.ShaderChunk[ 'fog_fragment' ]);

  geometry = new THREE.PlaneGeometry( 600, 600,size,size );
  var mesh = new THREE.Mesh( geometry, mat );
  mesh.rotation.z = Math.PI/2.5;
  mesh.position.x = -40;
  mesh.position.y = 250;




  scene.add(mesh);
  

  // var pointCloud = new THREE.PointCloud(geometry, material);

  // scene.add(pointCloud);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth , window.innerWidth);
}

var i = 0;
var time = 0;
var prevmouse = {x:0,y:0};
var koeff = 0;


function animate() {
  i++;
  time++;
  if(mat) {
    mat.uniforms.time.value = time;

    if(mouse.x!==prevmouse.x && mouse.x!==prevmouse.x) {
      koeff = koeff + 0.04;
      prevmouse.x = mouse.x;
      prevmouse.y = mouse.y;

    } else{
      koeff = koeff - 0.04;
    }
    koeff = Math.min(Math.max(0, koeff), 1);
    mat.uniforms.koeff.value = koeff;
  }

  

  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();

function onDocumentMouseDown( event ) {
  event.preventDefault();
  
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;



  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  console.log(intersects,'inter');
  var vector = new THREE.Vector3().copy( intersects[ 0 ].point );

  intersects[ 0 ].object.worldToLocal( vector );
  mat.uniforms.mouse.value.x = vector.x;
  mat.uniforms.mouse.value.y = vector.y;
  console.log( 'local point: ', vector );

}

document.addEventListener( 'mousemove', onDocumentMouseDown, false );   
