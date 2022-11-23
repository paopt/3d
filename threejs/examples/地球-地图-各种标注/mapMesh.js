import * as THREE from '../../build/three.module.js';
import { createGridPoint } from './gridPoint.js';
import { delaunay } from './delaunay.js';
import { lon2xyz } from './util.js';
import config from './config.js';

function createMapMesh(R, data) {
  const group = new THREE.Group();
  data.forEach(polygon => {
    // 根据多边形创建等间距点
    const points = createGridPoint(polygon[0]);
    // 根据等间距点，进行三角形剖分
    const triangles = delaunay(points, polygon[0]);
    // 球面坐标
    const vertices = [];
    points.forEach(point => {
      const pos = lon2xyz(R, point[0], point[1]);
      vertices.push(pos.x, pos.y, pos.z);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);
    geometry.index = new THREE.BufferAttribute(new Uint16Array(triangles), 1);
    geometry.computeVertexNormals (); //如果使用受光照影响材质，需要计算生成法线
    const material = new THREE.MeshLambertMaterial({
      color: config.mapMeshColor,
      // side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh( geometry, material );
    group.add(mesh);
  });
  return group;
}

export {
  createMapMesh
};