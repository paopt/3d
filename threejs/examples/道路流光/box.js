import * as THREE from '../../build/three.module.js';

// 查看包围盒大小
function getBox(group) {
  const box3 = new THREE.Box3();
  box3.expandByObject(group);

  const scaleV3 = new THREE.Vector3();
  box3.getSize(scaleV3);
  console.log("查看包围盒尺寸", scaleV3);

  const center = new THREE.Vector3();
  box3.getCenter(center);
  console.log("查看几何中心", center);
}

export {
  getBox
}