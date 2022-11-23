const scene = new THREE.Scene();

const width = window.innerWidth;
const height = window.innerHeight;
const k = width / height;
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
camera.position.set(0, -81, 139);
camera.lookAt(0, 0, 0);

// 平行光1
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
// 平行光2
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);
//环境光
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// 性能面板
const stats = new Stats();
document.body.appendChild(stats.dom);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

let geoData;
const meshGroup = new THREE.Group();
const lineGroup = new THREE.Group();
const mapHeight = 2;

function main() {
  fetch("./world.json")
    .then((res) => res.json())
    .then((res) => {
      drawMap(res);
    });

  fetch("./people.json")
    .then((res) => res.json())
    .then((data) => {
      drawZhu(data);
    });
}

function drawZhu(data) {
  const arr = [];
  const color1 = new THREE.Color(0x229977);
  const color2 = new THREE.Color(0x29ee77);

  data.population.forEach((item) => {
    const height = item[2] / 100;
    const geometry = new THREE.BoxGeometry(0.3, 0.3, height);
    geometry.translate(item[0], item[1], height / 2);
    const color = color1.clone().lerp(color2.clone(), item[2] / 500);
    const count = geometry.attributes.position.count;
    const colorArr = [];
    for (let i = 0; i < count; i++) {
      colorArr.push(color.r, color.g, color.b);
    }
    const colorAttribute = new THREE.BufferAttribute(
      new Float32Array(colorArr),
      3
    );
    geometry.attributes.color = colorAttribute;
    arr.push(geometry);
  });

  // 合并集合体，提高性能
  const geometries = THREE.BufferGeometryUtils.mergeBufferGeometries(arr);
  const position = geometries.attributes.position;
  const color = geometries.attributes.color;
  for (let i = 0; i < position.count; i++) {
    if (position.getZ(i) < 0.0001) {
      //柱子底部点
      color.setX(i, color.getX(i) * 0.0);
      color.setY(i, color.getY(i) * 0.1);
      color.setZ(i, color.getZ(i) * 0.1);
    } else {
      //柱子顶部点
      color.setX(i, color.getX(i) * 0.0);
      color.setY(i, color.getY(i) * 1.0);
      color.setZ(i, color.getZ(i) * 1.0);
    }
  }
  const material = new THREE.MeshLambertMaterial({
    vertexColors: true,
  });
  const mesh = new THREE.Mesh(geometries, material);
  mesh.position.z = mapHeight + 0.1;
  scene.add(mesh);
}

function drawMap(data) {
  geoData = data;
  lineGroup.position.z = -0.1;
  scene.add(meshGroup);
  scene.add(lineGroup);
  data.features.forEach((feature) => {
    const { properties, geometry } = feature;
    let { type, coordinates } = geometry;
    if (type === "Polygon") {
      coordinates = [coordinates];
    }
    drawMesh(coordinates);
    drawLine(coordinates);

    const lineGroup2 = lineGroup.clone();
    lineGroup2.position.z = mapHeight + 0.1;
    scene.add(lineGroup2);
  });

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
  const material = new THREE.MeshLambertMaterial({
    color: 0x004444,
    side: THREE.DoubleSide,
  });
  const geometry = new THREE.ExtrudeGeometry(shapeArr, {
    depth: mapHeight,
    bevelEnabled: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  meshGroup.add(mesh);
  scene.scale.set(0.65,0.65,0.65)

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
      color: 0x00cccc, //边界Line颜色
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
  stats.update();
}

animate();
main();
