import * as THREE from '../../build/three.module.js';
import { createLabel } from './label.js';
import config from './config.js';
import { camera } from './scene.js';

let mesh = null;
let label = new createLabel();
function onClick(event) {
  if (mesh) {
    mesh.material.color.set(config.mapMeshColor);
    label.element.style.visibility = 'hidden';
  }
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera( pointer, camera );
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(earth.meshArr);
  if (intersects.length) {
    mesh = intersects[0].object;
    mesh.material.color.set(0x006666);
    label.position.copy(intersects[0].point);
    label.element.innerHTML = mesh.parent.name;
    label.element.style.visibility = 'visible';
  } else {
    mesh = null;
    label.element.style.visibility = 'hidden';
  }
}
renderer.domElement.addEventListener('click', onClick);

export {
  label
};