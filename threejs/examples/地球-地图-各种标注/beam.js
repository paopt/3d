import * as THREE from '../../build/three.module.js';

const geometry = new THREE.PlaneGeometry( 1, 1 );
const texture = new THREE.TextureLoader().load( './beam.png' );
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  map: texture,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide
});

function createBeam() {
  const plane = new THREE.Mesh( geometry, material );
  plane.scale.set(5, 30, 1);
  plane.rotateX(Math.PI / 2);
  plane.translateY(15);

  const plane2 = plane.clone();
  plane2.rotateY(Math.PI / 2);
  return {plane, plane2};
}

export {
  createBeam
};