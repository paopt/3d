import * as THREE from '../../build/three.module.js';
import { scene, camera, renderer  } from './scene.js';
import { createEarth } from './earth.js';
import { createHalo } from './halo.js';
import config from './config.js';
import { createFlyLines, updateFlyLines } from './flyLine.js';

// 添加地球
const earth = createEarth();
scene.add(earth);

// 添加地球光晕
scene.add(createHalo());

// 添加飞线
const flyGroup = createFlyLines();
earth.add(flyGroup);

let index = 0;
function animate() {
  // 地球旋转动画
  // earth.rotateY(0.001);
  updateFlyLines(flyGroup, index);
  index++;
  if (index >= 101 - config.num) {
    index = 0;
  }
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();
