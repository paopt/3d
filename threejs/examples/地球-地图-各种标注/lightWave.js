import * as THREE from '../../build/three.module.js';

const geometry = new THREE.PlaneGeometry( 1, 1 );

function createLightWave() {
  const texture = new THREE.TextureLoader().load( './wave.png' );
  const material = new THREE.MeshBasicMaterial({
    color: 0x22ffcc,
    map: texture,
    transparent: true,
    opacity: 1.0,
    depthWrite: false
  });
  const plane = new THREE.Mesh( geometry, material );
  plane.size = 12;
  plane._s = Math.random() + 1;
  return plane;
}

export {
  createLightWave
};