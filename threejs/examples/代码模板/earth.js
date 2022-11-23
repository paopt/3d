import * as THREE from '../../build/three.module.js';

function createEarth(r) {
  const geometry = new THREE.SphereGeometry(r, 32, 32);
  const texture = new THREE.TextureLoader().load( './earth2.jpg' );
  const material = new THREE.MeshLambertMaterial( { map: texture } );
  const sphere = new THREE.Mesh( geometry, material );
  return sphere;
}

export {
  createEarth
};