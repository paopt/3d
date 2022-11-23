import * as THREE from '../../build/three.module.js';
import { render } from './bloom2.js';


function animate() {
  requestAnimationFrame( animate );
  render();
};

animate();
