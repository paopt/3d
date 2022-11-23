import * as THREE from '../../build/three.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';

// 场景
const scene = new THREE.Scene();

// 相机设置
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 1000);
const x = 0;
const y = 0;
camera.position.set(0, 200, 200);
camera.lookAt(x, y, 0);
scene.add( camera );

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

// 渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( width, height );
renderer.setClearColor(new THREE.Color(0x000000));
document.body.appendChild( renderer.domElement );

// 控制器，鼠标控制
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(x, y, 0);
controls.update();

// 坐标系
const axesHelper = new THREE.AxesHelper(100);
axesHelper.position.set(x, y, 0)
// scene.add(axesHelper);

export {
  scene,
  renderer,
  camera
};