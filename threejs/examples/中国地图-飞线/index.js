const scene = new THREE.Scene();

const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 20;//根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(104, -35, 200); //沿着z轴观察
camera.lookAt(104, 35, 0); //指向中国地图的几何中心

// 平行光1
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
// 平行光2
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);
//环境光
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(104, 35, 0);
controls.update();

const meshGroup = new THREE.Group();
const lineGroup = new THREE.Group();
const circleGroup = new THREE.Group();
const flyGroup = new THREE.Group();
const flyTrackGroup = new THREE.Group();

const mapHeight = 2;
let geoData;
let rate = 1; // 放大倍数
let index = 0; // 飞线动画位置
let num = 10; // 飞线动画长度

animate();
main();

function main() {
  fetch('./china.json')
  .then(res => res.json())
  .then(data => {
      drawMap(data);
    });

  drawFlyPoint();
}

function drawMap(data) {
  geoData = data;
  lineGroup.position.z = -0.1;
  scene.add(meshGroup);
  scene.add(lineGroup);
  data.features.forEach(feature => {
    const {properties, geometry} = feature;
    let {type, coordinates} = geometry;
    if (type === 'Polygon') {
      coordinates = [coordinates];
    }
    drawMesh(coordinates);
    drawLine(coordinates);

    const lineGroup2 = lineGroup.clone();
    lineGroup2.position.z = mapHeight + 0.1;
    scene.add(lineGroup2);
  });

  // getBox();
}

function getBox() {
  // 创建中国地图包围盒
  const box3 = new THREE.Box3();
  box3.expandByObject(meshGroup);

  const scaleV3 = new THREE.Vector3();
  box3.getSize(scaleV3)
  // 查看控制台包围盒大小，辅助设置相机参数
  console.log('查看包围盒尺寸', scaleV3);

  const center = new THREE.Vector3();
  box3.getCenter(center);
  // 查看控制台包围盒集合中心，作为lookAt()参数
  console.log('查看几何中心', center);
}

// 行政区域绘制，包含一个或多个轮廓
function drawMesh(data) {
  const shapeArr = [];
  data.forEach(polygon => {
    const pointArr = [];
    polygon[0].forEach(point => {
      pointArr.push(new THREE.Vector2(point[0], point[1]));
    });
    const shape = new THREE.Shape(pointArr);
    shapeArr.push(shape);
  });
  const material = new THREE.MeshLambertMaterial({
    color: 0x004444,
    side: THREE.DoubleSide
  });
  const geometry = new THREE.ExtrudeGeometry(shapeArr, {
    depth: mapHeight,
    bevelEnabled: false
  });
  const mesh = new THREE.Mesh( geometry, material ) ;
  meshGroup.add(mesh);
}

// 行政区域边界线绘制
function drawLine(data) {
  data.forEach(polygon => {
    const points = [];
    polygon[0].forEach(point => {
      points.push(new THREE.Vector3(point[0], point[1], 0));
    })
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial({
      color: 0x00cccc, //边界Line颜色
    });
    const line = new THREE.Line( geometry, material );
    lineGroup.add(line);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

function animate() {
  circleGroup.children.forEach(circle => {
    circle.scale.set(rate, rate, rate);
    circle.material.opacity = 1 - (rate - 1) / 1.5;
  });
  rate += 0.01;
  if (rate > 2.5) {
    rate = 1;
  }

  updateFly(index);
  index++;
  if (index >= 101 - num) {
    index = 0;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function drawFlyPoint() {
  const data = [
    {
      name: "河南",
      N: 33.8818,
      E: 113.4668
    },{
      name: "新疆",
      N: 41.748,
      E: 84.9023
    }, {
      name: "西藏",
      N: 31.6846,
      E: 88.7695
    }, {
      name: "内蒙古",
      N: 44.3408,
      E: 117.5977
    }, {
      name: "青海",
      N: 35.4199,
      E: 96.2402
    }, {
      name: "四川",
      N: 30.1904,
      E: 102.9199
    }, {
      name: "黑龙江",
      N: 48.5156,
      E: 128.1445
    }, {
      name: "甘肃",
      N: 40.166,
      E: 95.7129
    }, {
      name: "云南",
      N: 25.1807,
      E: 101.8652
    }, {
      name: "广西",
      N: 23.6426,
      E: 108.2813
    }, {
      name: "湖南",
      N: 27.3779,
      E: 111.5332
    }, {
      name: "陕西",
      N: 35.6396,
      E: 109.5996
    }, {
      name: "广东",
      N: 22.8076,
      E: 113.4668
    }, {
      name: "吉林",
      N: 43.5938,
      E: 126.4746
    }, {
      name: "河北",
      N: 37.9688,
      E: 115.4004
    }, {
      name: "湖北",
      N: 31.1572,
      E: 112.2363
    }, {
      name: "贵州",
      N: 26.9385,
      E: 106.6113
    }, {
      name: "山东",
      N: 36.4307,
      E: 118.7402
    }, {
      name: "江西",
      N: 27.29,
      E: 116.0156
    },  {
      name: "辽宁",
      N: 41.0889,
      E: 122.3438
    }, {
      name: "山西",
      N: 37.6611,
      E: 112.4121
    }, {
      name: "安徽",
      N: 32.0361,
      E: 117.2461
    }, {
      name: "福建",
      N: 25.9277,
      E: 118.3008
    }, {
      name: "浙江",
      N: 29.0918,
      E: 120.498
    }, {
      name: "江苏",
      N: 32.915,
      E: 120.0586
    }, {
      name: "重庆",
      N: 30.1904,
      E: 107.7539
    }, {
      name: "宁夏",
      N: 37.3096,
      E: 105.9961
    }, {
      name: "海南",
      N: 19.2041,
      E: 109.9512
    }, {
      name: "台湾",
      N: 23.5986,
      E: 121.0254
    }, {
      name: "北京",
      N: 40.2539,
      E: 116.4551
    }, {
      name: "天津",
      N: 39.4189,
      E: 117.4219
    }, {
      name: "上海",
      N: 31.2891,
      E: 121.4648
    }, {
      name: "香港",
      N: 22.3242,
      E: 114.2578
    }, {
      name: "澳门",
      N: 22.1484,
      E: 113.5547
    }
  ];
  data.forEach(item => {
    drawCircle([item.E, item.N]);
  });
  scene.add(circleGroup);

  const start = data[0];
  for (let i = 1; i < data.length; i++) {
    drawFly([start.E, start.N], [data[i].E, data[i].N]);
  }
  flyGroup.position.z = mapHeight + mapHeight * 0.01;
  scene.add(flyGroup);

  aniamteFly(5);
  flyTrackGroup.position.z = mapHeight + mapHeight * 0.01;
  scene.add(flyTrackGroup);
}

function drawCircle(pos) {
  const geometry = new THREE.PlaneGeometry( 2, 2 );
  const texture = new THREE.TextureLoader().load( './circle.png' );
  const material = new THREE.MeshBasicMaterial( {
    color: 0x00ffff,
    side: THREE.DoubleSide,
    map: texture,
    transparent: true
  } );
  const plane = new THREE.Mesh( geometry, material );
  plane.position.set(pos[0], pos[1], mapHeight + 0.1);
  circleGroup.add(plane);
}

function drawFly(start, end) {
  const v1 = new THREE.Vector3(start[0], start[1], 0);
  const v2 = new THREE.Vector3(end[0], end[1], 0);
  const v3 = v1.clone().add(v2).divideScalar(2);
  v3.z = v1.distanceTo(v2) / 10;
  
  const curve = new THREE.CatmullRomCurve3( [
    v1, v3, v2
  ] );
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color: 0x00aaaa, linewidth: 10 } );
  const curveObject = new THREE.Line( geometry, material );
  curveObject.points = points; // 用于飞线动画
  flyGroup.add(curveObject);
}

function aniamteFly(index) {
  var color1 = new THREE.Color(0x006666); //飞线轨迹相近的颜色
  var color2 = new THREE.Color(0xffff00);
  flyGroup.children.forEach(fly => {
    const points = fly.points.slice(index, num + 1);
    const curve = new THREE.CatmullRomCurve3(points);
    const arr = curve.getPoints(100);
    const positions = [];
    const colors = [];
    arr.forEach((v, i) => {
      positions.push(v.x, v.y, v.z);
      const color = color1.clone().lerp(color2.clone(), i / 100);
      colors.push(color.r, color.g, color.b);
    });
    const geometry = new THREE.LineGeometry();
    geometry.setPositions(positions);
		geometry.setColors( colors );
    matLine = new THREE.LineMaterial( {
      linewidth: 2,
      vertexColors: true,
    });
    matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the inset viewport
    line = new THREE.Line2( geometry, matLine );
    line.computeLineDistances();
    fly.track = line;
    flyTrackGroup.add(line);
  });
}

function updateFly(index) {
  flyGroup.children.forEach(fly => {
    const points = fly.points.slice(index, num + index + 1);
    console.log(points.length);
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


