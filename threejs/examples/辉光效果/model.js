import * as THREE from '../../build/three.module.js';

const geometry = new THREE.BoxGeometry( 25, 25, 25 );
const material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(-50, 0, 0);

const cube2 = cube.clone();
cube2.position.set(50, 0, 0);

const cube3 = cube.clone();
cube3.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
cube3.position.set(0, 0, 50)

export {
  cube, cube2, cube3
};


