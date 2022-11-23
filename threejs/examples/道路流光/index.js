import * as THREE from '../../build/three.module.js';
import { scene, camera, renderer  } from './scene.js';
import {getBox} from './box.js';
import { createSubwayLine } from './line.js';

// 添加地铁轨迹线
const lines = createSubwayLine();
scene.add(lines);

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();
