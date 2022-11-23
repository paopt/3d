import * as THREE from '../../build/three.module.js';
import { scene, camera, renderer  } from './scene.js';
import { createPlane } from './plane.js';
import { createWall } from './wall.js';
import { createHood } from './hood.js';

// 添加地面
scene.add(createPlane());

// 添加渐变围墙
scene.add(createWall());

// 添加半球光罩
const v = new THREE.Vector3(-60, 0, -50);
scene.add(createHood(v));


function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();
