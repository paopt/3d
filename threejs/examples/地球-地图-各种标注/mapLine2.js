import * as THREE from '../../build/three.module.js';
import config from './config.js';
import { lon2xyz } from './util.js';

// 合并所有边界线为一个， 数据量增加一倍，但是相关的计算减少了
function getMapLine() {
  const lineGroup = new THREE.Group();
  fetch('./world.json')
    .then(res => res.json())
    .then(data => {
      const allPoints = [];
      data.features.forEach(feature => {
        const {geometry} = feature;
        let {type, coordinates} = geometry;
        if (type === 'Polygon') {
          coordinates = [coordinates];
        }
        coordinates.forEach(polygon => {
          const points = [];
          polygon[0].forEach(point => {
            const cood = lon2xyz(config.R + 0.01, point[0], point[1]);
            points.push(cood.x, cood.y, cood.z);
          });
          allPoints.push(points[0], points[1], points[2]);
          for (let i = 3; i < points.length; i += 3) {
            allPoints.push(
              points[i], points[i + 1], points[i + 2],
              points[i], points[i + 1], points[i + 2]
            );
          }
          allPoints.push(points[0], points[1], points[2]);
        });
      });
      const line = drawAreaLine(allPoints);
      lineGroup.add(line);
    });

  return lineGroup;
}

function drawAreaLine(points) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(points);
  const attribute = new THREE.BufferAttribute(vertices, 3);
  geometry.attributes.position = attribute;
  const material = new THREE.LineBasicMaterial({
    color: config.mapLineColor,
  });
  const line = new THREE.LineSegments( geometry, material );
  return line;
}

export {
  getMapLine
}