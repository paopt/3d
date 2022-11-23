import * as THREE from '../../build/three.module.js';
import config from './config.js';
import { lon2xyz } from './util.js';

function createMapLine(R, data) {
  const lineGroup = new THREE.Group();
  data.forEach(polygon => {
    const points = [];
    polygon[0].forEach(point => {
      const cood = lon2xyz(R, point[0], point[1]);
      points.push(cood.x, cood.y, cood.z);
    });
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points);
    const attribute = new THREE.BufferAttribute(vertices, 3);
    geometry.attributes.position = attribute;
    const material = new THREE.LineBasicMaterial({
      color: config.mapLineColor,
    });
    const line = new THREE.Line( geometry, material );
    lineGroup.add(line);
  });
  return lineGroup;
}

export {
  createMapLine
}