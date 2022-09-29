import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let isDebug = true;

if (import.meta.env.PROD) {
  isDebug = false;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff1cc);

if (isDebug) {
  const axesHelper = new THREE.AxesHelper();
  axesHelper.position.set(0, 7, 0);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper();
  gridHelper.position.set(0, -3, 0);
  scene.add(gridHelper);
}

const light = new THREE.AmbientLight(0xf2f5d3);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 7);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

let model: GLTF;
const loader = new GLTFLoader();
const loadingbar: HTMLProgressElement = document.querySelector('progress#loading')!;
loader.load(
  'henrik.glb',
  function (_model) {
    model = _model;
    model.scene.position.set(0, -3, 0);
    scene.add(model.scene);
    loadingbar.style.display = 'none';
  },
  (xhr) => {
    const percent = (xhr.loaded / xhr.total) * 100;
    loadingbar.value = percent;
    loadingbar.innerText = percent + '%';
  }
);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let rotationDirection = -1;
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    if (Math.abs(model.scene.rotation.y) > 0.5) {
      rotationDirection = -rotationDirection;
    }

    model.scene.rotation.y += rotationDirection * 0.005;
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
