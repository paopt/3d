import * as THREE from '../../build/three.module.js';

const geometry = new THREE.PlaneGeometry( 1, 1 );
const texture = new THREE.TextureLoader().load( './point.png' );
const material = new THREE.MeshBasicMaterial({
  color: 0x22ffcc,
  map: texture,
  transparent: true
});

function createPointMark(v) {
  const plane = new THREE.Mesh( geometry, material );
  plane.scale.set(8, 8, 8);
  plane.position.copy(v);
  // 调整group方向
  const v1 = new THREE.Vector3(0, 0, 1);
  const v2 =new THREE.Vector3(v.x, v.y, v.z).normalize();
  plane.quaternion.setFromUnitVectors(v1, v2);
  return plane;
}

export {
  createPointMark
};