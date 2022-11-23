import { scene, camera, renderer  } from './scene.js';
import { createEarth } from './earth.js';

// 添加地球
const earth = createEarth();
scene.add(earth);

function animate() {
  // 地球旋转动画
  earth.rotateY(0.001);
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();
