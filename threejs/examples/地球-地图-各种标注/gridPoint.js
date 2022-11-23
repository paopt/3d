import { pointInPolygon } from './pointInPolygon.js'; //判断点是否在多边形中

// 创建包围轮廓的等间距点
function createGridPoint(data) {
  const lonArr = [];
  const latArr = [];
  data.forEach(item => {
    lonArr.push(item[0]);
    latArr.push(item[1]);
  });
  const {lonMin, lonMax} = getMinMax(lonArr);
  const {latMin, latMax} = getMinMax(latArr);
  const sep = 3;
  const rows = Math.ceil((latMax - latMin) / sep) + 1;
  const cols = Math.ceil((lonMax - lonMin) / sep) + 1;
  const points = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const point = [lonMin + j * sep, latMin + i * sep];
      if (pointInPolygon(point, data)) {
        points.push(point);
      }
    }
  }
  return [...points, ...data];
}

function getMinMax(data) {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  data.forEach(v => {
    if (v < min) {
      min = v;
    }
    if (v > max) {
      max = v;
    }
  });
  return {
    min, max
  };
}

export {
  createGridPoint
};