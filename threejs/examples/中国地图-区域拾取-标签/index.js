const scene = new THREE.Scene();

const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 20; //根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
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
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2d标签渲染器
// labelRenderer2 = new THREE.CSS2DRenderer();
// labelRenderer2.setSize( window.innerWidth, window.innerHeight );
// labelRenderer2.domElement.style.position = 'absolute';
// labelRenderer2.domElement.style.top = '0px';
// labelRenderer2.domElement.style.pointerEvents = 'none';
// document.body.appendChild( labelRenderer2.domElement );

// 3d标签渲染器
labelRenderer3 = new THREE.CSS3DRenderer();
labelRenderer3.setSize(window.innerWidth, window.innerHeight);
labelRenderer3.domElement.style.position = "absolute";
labelRenderer3.domElement.style.top = "0px";
labelRenderer3.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer3.domElement);

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(104, 35, 0);
controls.update();

let geoData;
const meshGroup = new THREE.Group();
const lineGroup = new THREE.Group();
const mapHeight = 2;

function main() {
  fetch("./china.json")
    .then((res) => res.json())
    .then((res) => {
      drawMap(res);
    });
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
    drawLabel3(properties);

    const lineGroup2 = lineGroup.clone();
    lineGroup2.position.z = mapHeight + 0.1;
    scene.add(lineGroup2);
  });

  getBox();
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

// 获取屏幕坐标
function getSceenXY(position) {
  const vector = new THREE.Vector3(position[0], position[1], 0);
  const standardVector = vector.project(camera);
  const a = window.innerWidth / 2;
  const b = window.innerHeight / 2;
  const x = Math.round(standardVector.x * a + a);
  const y = Math.round(-standardVector.y * b + b);
  return { x, y };
}

// 2d标签，自定义, 鼠标操作时需要更新
function drawLabel(properties) {
  const { name, cp } = properties;

  // 创建div元素(作为标签)
  const div = document.createElement("div");
  div.innerHTML = name;
  div.style.padding = "5px 10px";
  div.style.color = "#fff";
  div.style.fontSize = "16px";
  div.style.position = "absolute";
  div.style.backgroundColor = "rgba(25,25,25,0.5)";
  div.style.borderRadius = "5px";
  document.body.appendChild(div);

  const { x, y } = getSceenXY(cp);
  div.style.left = x + "px";
  div.style.top = y + "px";
}

// 2d标签，CSS2DRenderer
function drawLabel2(properties) {
  const { name, cp } = properties;

  // 创建div元素(作为标签)
  const div = document.createElement("div");
  div.innerHTML = name;
  div.style.color = "#fff";
  div.style.fontSize = "16px";
  div.style.position = "absolute";

  const label = new THREE.CSS2DObject(div);
  label.position.set(cp[0], cp[1], mapHeight + 0.1);
  scene.add(label);
}

// 3d标签，CSS3DRenderer
function drawLabel3(properties) {
  const { name, cp } = properties;

  // 创建div元素(作为标签)
  const div = document.createElement("div");
  div.innerHTML = name;
  div.style.color = "#fff";
  div.style.fontSize = "16px";
  div.style.position = "absolute";
  div.style.pointerEvents = "none";

  const label = new THREE.CSS3DObject(div);
  label.position.set(cp[0], cp[1], mapHeight + 0.1);
  label.scale.set(0.05, 0.05, 0.05);
  scene.add(label);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // labelRenderer2.setSize( window.innerWidth, window.innerHeight );
  labelRenderer3.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

let mesh = null;
function onClick(event) {
  if (mesh) {
    mesh.material.color.set(0x004444);
  }
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera( pointer, camera );
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(meshGroup.children);
  if (intersects.length) {
    mesh = intersects[0].object;
    mesh.material.color.set(0x006666);
  }
}
renderer.domElement.addEventListener('click', onClick);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // labelRenderer2.render( scene, camera );
  labelRenderer3.render(scene, camera);
}

animate();
main();
