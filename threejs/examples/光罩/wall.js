import * as THREE from "../../build/three.module.js";
import output_fragment from "./output_fragment.glsl.js";

/**
 * 创建一个颜色渐变的围墙
 * @returns 
 */
function createWall() {
  // 自定义几何体
  // 围墙轮廓顶点
  const points = [
    40, 0, //顶点1坐标
    80, 0, //顶点2坐标
    100, 80, //顶点3坐标
    60, 120, //顶点4坐标
    30, 60, //顶点5坐标
    40, 0, //顶点6坐标  和顶点1重合
  ];
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const h = 20; //围墙拉伸高度
  for (let i = 0; i < points.length - 2; i += 2) {
    // 三角形1  三个顶点坐标
    vertices.push(
      points[i], points[i + 1], 0,
      points[i + 2], points[i + 3], 0,
      points[i + 2], points[i + 3], h
    );
    // 三角形2  三个顶点坐标
    vertices.push(
      points[i], points[i + 1], 0,
      points[i + 2], points[i + 3], h,
      points[i], points[i + 1], h
    );
  }
  geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);
  // 重新计算顶点法向量
  geometry.computeVertexNormals();

  // 计算顶点透明度
  const pointAttr = geometry.attributes.position;
  const count = pointAttr.count;
  const opacityArr = []; //每个顶点创建一个透明度数据(随着高度渐变)
  for (let i = 0; i < count; i++) {
    // 线性渐变
    opacityArr.push(1 - pointAttr.getZ(i) / h);
  }
  geometry.attributes.opacity = new THREE.BufferAttribute(new Float32Array(opacityArr), 1);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true
  });
  material.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      ['attribute float opacity;//透明度分量',
        'varying float alpha;',
        'void main() {',
        'alpha = opacity;', // 顶点透明度进行插值计算
      ].join('\n')
    );
    // 插入代码：片元着色器主函数前面插入`varying float vAlpha;`
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      ['varying float alpha;',
        'void main() {',
      ].join('\n')
    );
    shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotateX(-Math.PI / 2);
  return mesh;
}

export {
  createWall
};