import * as THREE from "../../build/three.module.js";
import { addScanLightBar } from './lightBar.js';

/**
 * 模拟地面，并附加扫描光带效果
 * @returns
 */
function createPlane() {
  const group = new THREE.Group();
  const gridHelper = new THREE.GridHelper(300, 15, 0x003333, 0x003333);
  group.add(gridHelper);
  const geometry = new THREE.PlaneGeometry(310, 310);
  const material = new THREE.MeshLambertMaterial({
    color: 0x000000,
    // transparent: true,
    side: THREE.DoubleSide,
  });
  addScanLightBar(material);
  const mesh = new THREE.Mesh(geometry, material);
  // mesh.position.y = -1;
  mesh.rotateX(-Math.PI / 2);
  group.add(mesh);
  group.add(createCube());
  return group;
}

function createCube() {
  const geometry = new THREE.BoxGeometry( 30, 30, 30 );
  geometry.translate(-40, 15, 100);
  const material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
  addScanLightBar(material);
  const cube = new THREE.Mesh( geometry, material );
  return cube;
}

export { createPlane };
