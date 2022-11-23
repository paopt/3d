import * as THREE from '../../build/three.module.js';
import { lon2xy } from './util.js';
import output_fragment from './output_fragment.glsl.js'

function createSubwayLine() {
  const group = new THREE.Group();
  fetch('./subway.json')
    .then(res => res.json())
    .then(data => {
      data.geometries.forEach(item => {
        const points = [];
        const flyPoints = [];
        item.coordinates.forEach(pos => {
          const {x, y} = lon2xy(pos[0] - 0.0128, pos[1] - 0.0075);
          points.push(x, y, 0);
          flyPoints.push(new THREE.Vector3(x, y, 0));
        });
        const line = createLine(points);
        const flyLine = createFlyLine(flyPoints);
        group.add(line);
        group.add(flyLine);
      })
    });
  return group;
}

function createLine(points) {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(points);
  const attribute = new THREE.BufferAttribute(vertices, 3);
  geometry.attributes.position = attribute;
  const material = new THREE.LineBasicMaterial({
    color: 0x006666,
  });
  const line = new THREE.Line( geometry, material );
  return line;
}

function createFlyLine(points) {
  const curve = new THREE.CatmullRomCurve3(points);
  const trackPoints = curve.getSpacedPoints(100);
  let index = 0;
  const num = 15;
  let subTrackPoints = trackPoints.slice(index, index + num);
  let flyCurve =  new THREE.CatmullRomCurve3(subTrackPoints);
  let flyPoints = flyCurve.getSpacedPoints(100);
  let len = flyPoints.length;
  const color1 = new THREE.Color(0x006666); //轨迹线颜色 青色
  const color2 = new THREE.Color(0x00ffff); //更亮青色
  let percents = [];
  let colors = [];
  // 一头大，一头小
  flyPoints.forEach((point, index) => {
    const percent = index / len;
    percents.push(percent);
    const color = color1.lerp(color2, percent);
    colors.push(color.r, color.g, color.b);
  });
  // // 两头小，中间大
  // const half = Math.floor(len / 2);
  // flyPoints.forEach((point, index) => {
  //   let percent;
  //   if (index < half) {
  //     percent = index / half;
  //   } else {
  //     percent = 1- (index - half) / half;
  //   }
  //   percents.push(percent);
  //   const color = color1.lerp(color2, percent);
  //   colors.push(color.r, color.g, color.b);
  // });
  const geometry = new THREE.BufferGeometry();
  geometry.attributes.percent = new THREE.BufferAttribute(new Float32Array(percents), 1);
  geometry.attributes.color = new THREE.BufferAttribute(new Float32Array(colors), 3);
  const material = new THREE.PointsMaterial({
    size: 1000, //点大小 考虑相机渲染范围设置
    vertexColors: true, //使用顶点颜色渲染
    transparent:true,//开启透明计算
    depthTest:false,
  });
  material.onBeforeCompile = shader => {
    // 顶点着色器中声明一个attribute变量:百分比
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      [
          'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
          'void main() {',
      ].join('\n') // .join()把数组元素合成字符串
    );
    // 调整点渲染大小计算方式
    shader.vertexShader = shader.vertexShader.replace(
        'gl_PointSize = size;',
        [
            'gl_PointSize = percent * size;',
        ].join('\n') // .join()把数组元素合成字符串
    );

    shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', output_fragment);
  };
  const pointsMesh = new THREE.Points(geometry, material);
  const maxIndex = trackPoints.length - num;
  const animateFly = () => {
    if (index > maxIndex) {
      index = 0;
    }
    index++;
    subTrackPoints = trackPoints.slice(index, index + num);
    flyCurve =  new THREE.CatmullRomCurve3(subTrackPoints);
    flyPoints = flyCurve.getSpacedPoints(100);
    geometry.setFromPoints(flyPoints);
    requestAnimationFrame(animateFly);
  }

  animateFly();
  return pointsMesh;
}

export {
  createLine,
  createSubwayLine
}