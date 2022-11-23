import * as THREE from '../../build/three.module.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { lon2xyz } from './util.js';
import config from './config.js';
import data from './flyData.js';
import { createPointMark } from './pointMark.js';

function createFlyLines() {
  const group = new THREE.Group();
  const start = data.start;
  const endArr = data.endArr;
  const pos = lon2xyz(config.R + 3, start.E, start.N);
  const v0 = new THREE.Vector3(pos.x, pos.y, pos.z);
  for (let i = 0; i < endArr.length; i++) {
    const point = lon2xyz(config.R + 3, endArr[i].E, endArr[i].N);
    const v3 = new THREE.Vector3(point.x, point.y, point.z);
    const line = addCurveLine(v0, v3);
    addFlyLine(line);
    line.add(createPointMark(v0));
    line.add(createPointMark(v3));
    group.add(line);
  }
  return group;
}

function addCurveLine(v0, v3) {
  const {v1, v2} = getBezierPoint(v0, v3);
  const curve = new THREE.CubicBezierCurve3(v0, v1 ,v2, v3);
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color: 0x00ffff } );
  const line = new THREE.Line( geometry, material );
  line.points = points;
  return line;
}

function getCenter(v0, v1) {
  const v = v0.add(v1);
  return v.divideScalar(2);
}

function getLenVcetor(v1, v2, len) {
  let v1v2Len = v1.distanceTo(v2);
  return v1.lerp(v2, len / v1v2Len);
}

// 获取贝塞尔控制点    
function getBezierPoint(v0, v3) {          
  let angle = (v0.angleTo(v3) * 180) / Math.PI; // 0 ~ Math.PI       // 计算向量夹角 
  let aLen = angle,        
      hLen = angle * angle * 50;   
  // let angle = ( v0.angleTo( v3 ) * 1.8 ) / Math.PI / 0.1; // 0 ~ Math.PI
  // let aLen = angle * 0.4,
  //     hLen = angle * angle * 12;
  // let R = config.R;
  // let angle = (v0.angleTo(v3) * 180) / Math.PI;
  // let aLen = angle * 0.5 * (1 - angle / (Math.PI * R * parseInt(R / 10)));
  // let hLen = angle * angle * 1.5 * (1 - angle / (Math.PI * R * parseInt(R / 10)));
  let vcenter = getCenter(v0.clone(), v3.clone()).normalize();      // 法线向量
  let vtop = vcenter.multiplyScalar(hLen);          
  // 控制点坐标      
  let v1 = getLenVcetor(v0.clone(), vtop, aLen);      
  let v2 = getLenVcetor(v3.clone(), vtop, aLen);     
  return {        
   v1: v1,        
   v2: v2      
  };    
}

/**
 * 添加飞线
 * @param {*} group 
 */
function addFlyLine(line, index = 0) {
  var color1 = new THREE.Color(0x006666); //飞线轨迹相近的颜色
  var color2 = new THREE.Color(0xffff00);
  const points = line.points.slice(index, config.num + 1);
  const curve = new THREE.CatmullRomCurve3(points);
  const arr = curve.getPoints(100);
  const positions = [];
  const colors = [];
  arr.forEach((v, i) => {
    positions.push(v.x, v.y, v.z);
    const color = color1.clone().lerp(color2.clone(), i / 100);
    colors.push(color.r, color.g, color.b);
  });
  const geometry = new LineGeometry();
  geometry.setPositions(positions);
  geometry.setColors( colors );
  const matLine = new LineMaterial({
    linewidth: 3,
    vertexColors: true,
  });
  matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the inset viewport
  const flyLine = new Line2( geometry, matLine );
  flyLine.computeLineDistances();
  line.track = flyLine;
  line.add(flyLine);
}

function updateFlyLines(flyGroup, index) {
  flyGroup.children.forEach(fly => {
    const points = fly.points.slice(index, config.num + index + 1);
    const curve = new THREE.CatmullRomCurve3(points);
    const arr = curve.getPoints(100);
    const positions = [];
    arr.forEach((v) => {
      if (v) {
        positions.push(v.x, v.y, v.z);
      }
    });
    fly.track.geometry.setPositions(positions);
    fly.track.geometry.verticesNeedUpdate = true;
  });
}

export {
  createFlyLines,
  updateFlyLines
};

