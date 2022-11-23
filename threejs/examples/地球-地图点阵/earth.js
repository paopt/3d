import * as THREE from '../../build/three.module.js';
import config from './config.js';
import { createLandPoints } from './landPoint.js';

function createSphere(r) {
  const geometry = new THREE.SphereGeometry(r, 32, 32);
  const material = new THREE.MeshLambertMaterial( {
    color: 0x000909,
    transparent: true,
    opacity: 0.5
  } );
  const sphere = new THREE.Mesh( geometry, material );
  return sphere;
}

function createEarth() {
  const group = new THREE.Group();
  const sphere = createSphere(config.R);
  group.add(sphere);
  
  fetch('./world.json')
    .then(res => res.json())
    .then(data => {
      const points = createLandPoints(data);
      group.add(points);
    });
  return group;
}

export {
  createEarth
};