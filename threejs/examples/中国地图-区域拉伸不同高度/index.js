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
const gdpMap = {};
let geoData;
let maxGdp = 0;
const mapHeight = 2;

function main() {
  Promise.all([
    fetch('./china.json'),
    fetch('./gdp.json')
  ])
  .then(arr => {
    return Promise.all([arr[0].json(), arr[1].json()])
  })
  .then(arr => {
    geoData = arr[0];
    initGdp(arr[1]);
    drawMap(geoData);
  });
}

function initGdp(data) {
  data.arr.forEach(v => {
    gdpMap[v.name] = v.value;
    if (v.value > maxGdp) {
      maxGdp = v.value;
    }
  });
}

function drawMap(data) {
  lineGroup.position.z = -0.1;
  scene.add(meshGroup);
  scene.add(lineGroup);
  data.features.forEach(feature => {
    const {properties, geometry} = feature;
    let {type, coordinates} = geometry;
    if (type === 'Polygon') {
      coordinates = [coordinates];
    }
    const gdp = gdpMap[properties.name];
    
    const height = gdp ? gdp / 10000 + mapHeight : mapHeight;

    console.log(height);
    const mesh = drawMesh(coordinates, height);
    mesh.name = properties.name;
    mesh.center = properties.center;
    mesh.gdp = gdp;
    const color = getColor(gdp);
    mesh.material.color.copy(color);
    meshGroup.add(mesh);
    drawLine(coordinates);
  });

  // getBox();
}

// 查看包围盒大小
function getBox() {
  // 创建中国地图包围盒
  const box3 = new THREE.Box3();
  box3.expandByObject(meshGroup);

  const scaleV3 = new THREE.Vector3();
  box3.getSize(scaleV3);
  // 查看控制台包围盒大小，辅助设置相机参数
  console.log("查看包围盒尺寸", scaleV3);

  const center = new THREE.Vector3();
  box3.getCenter(center);
  // 查看控制台包围盒集合中心，作为lookAt()参数
  console.log("查看几何中心", center);
}

function getColor(value) {
  const color1 = new THREE.Color(0xff0000);
  const color2 = new THREE.Color(0xffffff);
  const color = color2.lerp(color1, value / maxGdp);
  return color;
}

// 行政区域绘制，包含一个或多个轮廓
function drawMesh(data, height) {
  drawLine(data, height + 0.2);
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
    side: THREE.DoubleSide,
  });
  const geometry = new THREE.ExtrudeGeometry(shapeArr, {
    depth: height,
    bevelEnabled: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

// 行政区域边界线绘制
function drawLine(data, height = -0.1) {
  data.forEach(polygon => {
    const points = [];
    polygon[0].forEach(point => {
      points.push(new THREE.Vector3(point[0], point[1], 0));
    })
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial({
      color: 0x000000, //边界Line颜色
    });
    const line = new THREE.Line( geometry, material );
    line.position.z = height;
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
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
main();


