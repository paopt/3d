import * as THREE from '../../build/three.module.js';

const geometry = new THREE.PlaneGeometry( 1, 1 );
const texture = new THREE.TextureLoader().load( './point.png' );
const material = new THREE.MeshBasicMaterial({
  color: 0x22ffcc,
  map: texture,
  transparent: true
});

function createPointMark() {
  const plane = new THREE.Mesh( geometry, material );
  plane.scale.set(5, 5, 5);
  return plane;
}

export {
  createPointMark
};