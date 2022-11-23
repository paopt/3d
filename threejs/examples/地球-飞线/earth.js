import * as THREE from '../../build/three.module.js';
import config from './config.js';
import { createMapLine } from './mapLine.js';

function createSphere(r) {
  const geometry = new THREE.SphereGeometry(r, 32, 32);
  const texture = new THREE.TextureLoader().load( './earth.png' );
  const material = new THREE.MeshLambertMaterial( {
    map: texture,
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
      data.features.forEach(feature => {
        const {geometry, properties} = feature;
        let {type, coordinates} = geometry;
        if (type === 'Polygon') {
          coordinates = [coordinates];
        }
        const line = createMapLine(config.R + 3, coordinates);
        group.add(line);
      });
    });
  return group;
}

export {
  createEarth
};