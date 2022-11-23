const scene = new THREE.Scene();

const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 100;//根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(0, 14, 100); //沿着z轴观察
camera.lookAt(0, 14, 0); //指向中国地图的几何中心

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
controls.target.set(0, 14, 0);
controls.update();

let geoData;
const meshGroup = new THREE.Group();
const lineGroup = new THREE.Group();
const mapHeight = 3;

function main() {
  fetch('./world.json')
  .then(res => res.json())
  .then(res => {
    drawMap(res);
  });
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
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
main();


