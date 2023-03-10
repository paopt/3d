import * as THREE from '../../build/three.module.js';
import config from './config.js';
import { createMapLine } from './mapLine.js';
import { createMapMesh } from './mapMesh.js';

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
  const meshArr = [];
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
        const mesh = createMapMesh(config.R + 2.5, coordinates);
        mesh.name = properties.name;
        mesh.center = 
        group.add(line);
        group.add(mesh);
        meshArr.push(mesh);
      });
    });
  return {
    group, meshArr
  };
}

export {
  createEarth
};