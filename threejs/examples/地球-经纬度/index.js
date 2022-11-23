import { scene, camera, renderer  } from './scene.js';
import config from './config.js';
import { createEarth } from './earth.js';

const earth = createEarth(config.R);
scene.add(earth);

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();
