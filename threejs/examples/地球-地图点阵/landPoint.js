import * as THREE from '../../build/three.module.js';
import { pointInPolygon } from './pointInPolygon.js'; //判断点是否在多边形中
import { lon2xyz } from './util.js';
import config  from './config.js';

/**
 * 创建包围轮廓的等间距点
 * @param {*} data world数据
 * @returns 
 */
function createGridPoints(data) {
  const sep = 2;
  const rows = Math.ceil(180 / sep) + 1;
  const cols = Math.ceil(360 / sep) + 1;
  const points = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const point = [-180 + j * sep, -90 + i * sep];
      points.push(point);
    }
  }

  const landPoints = [];
  data.features.forEach(feature => {
    const {geometry} = feature;
    let {type, coordinates} = geometry;
    if (type === 'Polygon') {
      coordinates = [coordinates];
    }
    coordinates.forEach(polygon => {
      points.forEach(point => {
        if (pointInPolygon(point, polygon[0])) {
          landPoints.push(point);
        }
      });
    })
  });
  return landPoints;
}

function createLandPoints(data) {
  const pointsArr = createGridPoints(data);
  var spherePointsArr = []; //经纬度pointsArr数据转球面坐标spherePointsArr
  pointsArr.forEach((point) => {
    var pos = lon2xyz(config.R + 2, point[0], point[1]);
    spherePointsArr.push(pos.x, pos.y, pos.z);
  });
  var geometry = new THREE.BufferGeometry();
  geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(spherePointsArr), 3);    
  var material = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 2,
  });
  var points = new THREE.Points(geometry, material);
  return points;
}

export {
  createLandPoints
};