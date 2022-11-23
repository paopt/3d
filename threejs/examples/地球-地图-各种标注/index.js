import * as THREE from '../../build/three.module.js';
import { scene, camera, renderer  } from './scene.js';
import { createEarth } from './earth.js';
import { createHalo } from './halo.js';
import { createHotNewsMark, waveArr } from './hotNews.js';
import config from './config.js';
import { createLabel, labelRenderer2 } from './label.js';

// 添加地球
const earth = createEarth();
scene.add(earth.group);

// 添加地球光晕
scene.add(createHalo());

// 添加热点标注
earth.group.add(createHotNewsMark());

let mesh = null;
let label = new createLabel();
earth.group.add(label);
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
    console.log(mesh);
  } else {
    mesh = null;
    label.element.style.visibility = 'hidden';
  }
}
renderer.domElement.addEventListener('click', onClick);

function animate() {
  // 地球旋转动画
  // earth.rotateY(0.001);
  waveArr.forEach(mesh => {
    const size = mesh.size * mesh._s;
    mesh.scale.set(size, size, size);
    mesh.material.opacity = 2 - mesh._s;
    mesh._s += 0.005;
    if (mesh._s > 2) {
      mesh._s = 1;
    }
  });

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  labelRenderer2.render( scene, camera );
};

animate();
