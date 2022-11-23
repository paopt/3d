const scene = new THREE.Scene();

const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 1; //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(116.469, 40.252, 200); //沿着z轴观察
camera.lookAt(116.469, 40.252, 0); //指向中国地图的几何中心

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
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(116.469, 40.252, 0);
controls.update();

const meshGroup = new THREE.Group();
const lineGroup = new THREE.Group();
function main() {
  fetch("./beijing.json")
    .then((res) => res.json())
    .then((data) => {
      drawMap(data);
    });

  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      drawLines(data);
    });
}

function drawLines(data) {
  const coordinates = data.coordinates;
  const group = new THREE.Group();
  coordinates.forEach((arr) => {
    const points = [];
    for (let i = 0; i < arr.length; i = i + 2) {
      points.push(new THREE.Vector3(arr[i], arr[i + 1], 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
    });
    const line = new THREE.Line(geometry, material);
    line.position.z = 0.01;
    group.add(line);
  });
  scene.add(group);
}

function drawMap(data) {
  lineGroup.position.z = 0.01;
  scene.add(meshGroup);
  scene.add(lineGroup);
  data.features.forEach((feature) => {
    const { properties, geometry } = feature;
    let { type, coordinates } = geometry;
    if (type === "Polygon") {
      coordinates = [coordinates];
    }
    const mesh = drawMesh(coordinates);
    mesh.name = properties.name;
    mesh.center = properties.center;
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

// 行政区域绘制，包含一个或多个轮廓
function drawMesh(data) {
  const shapeArr = [];
  data.forEach((polygon) => {
    const pointArr = [];
    polygon[0].forEach((point) => {
      pointArr.push(new THREE.Vector2(point[0], point[1]));
    });
    const shape = new THREE.Shape(pointArr);
    shapeArr.push(shape);
  });
  const material = new THREE.MeshBasicMaterial({
    color: 0x004444,
    side: THREE.DoubleSide,
  });
  const geometry = new THREE.ShapeGeometry(shapeArr);
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

// 行政区域边界线绘制
function drawLine(data) {
  data.forEach((polygon) => {
    const points = [];
    polygon[0].forEach((point) => {
      points.push(new THREE.Vector3(point[0], point[1], 0));
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x000000, //边界Line颜色
    });
    const line = new THREE.Line(geometry, material);
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
