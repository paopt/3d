const scene = new THREE.Scene();

const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 20;//根据包围盒大小(行政区域经纬度分布范围大小)设置渲染范围
//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(104, 35, 200); //沿着z轴观察
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

// 2d标签渲染器
labelRenderer2 = new THREE.CSS2DRenderer();
labelRenderer2.setSize( window.innerWidth, window.innerHeight );
labelRenderer2.domElement.style.position = 'absolute';
labelRenderer2.domElement.style.top = '0px';
labelRenderer2.domElement.style.pointerEvents = 'none';
document.body.appendChild( labelRenderer2.domElement );

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(104, 35, 0);
controls.update();

const meshGroup = new THREE.Group();
const lineGroup = new THREE.Group();
const chooseColor = 0x00ffff;
const gdpMap = {};
let geoData;
let maxGdp = 0;

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
  lineGroup.position.z = 0.1;
  scene.add(meshGroup);
  scene.add(lineGroup);
  data.features.forEach(feature => {
    const {properties, geometry} = feature;
    let {type, coordinates} = geometry;
    if (type === 'Polygon') {
      coordinates = [coordinates];
    }
    const mesh = drawMesh(coordinates);
    mesh.name = properties.name;
    mesh.center = properties.center;
    mesh.gdp = gdpMap[mesh.name];
    const color = getColor(mesh.gdp);
    mesh.material.color.copy(color);
    mesh.color = color;
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

// 2d标签，CSS2DRenderer
function drawLabel2() {
  // 创建div元素(作为标签)
  const div = document.createElement("div");
  div.style.color = "#fff";
  div.style.fontSize = "16px";
  div.style.position = "absolute";
  div.style.backgroundColor = 'rgba(25,25,25,0.5)';
  div.style.borderRadius = '5px';
  div.style.padding = '5px 10px';
  const label = new THREE.CSS2DObject(div);
  return label;
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
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  const geometry = new THREE.ShapeGeometry(shapeArr);
  const mesh = new THREE.Mesh( geometry, material ) ;
  return mesh;
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
      color: 0x000000, //边界Line颜色
    });
    const line = new THREE.Line( geometry, material );
    lineGroup.add(line);
  });
}

let mesh = null;
let label = drawLabel2();
scene.add(label);
function onClick(event) {
  if (mesh) {
    mesh.material.color.copy(mesh.color);
  } else {
    // label.element.style.display = 'none';
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
    mesh.material.color.set(0x00ffff);
    
    label.position.set(mesh.center[0], mesh.center[1], 1);
    label.element.innerHTML = mesh.name + 'GDP: ' + mesh.gdp + '(亿元)';
    label.element.style.display = 'block';
  } else {
    mesh = null;
    label.element.style.display = 'none';
  }
}
renderer.domElement.addEventListener('mousemove', onClick);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer2.setSize( window.innerWidth, window.innerHeight );
  labelRenderer2.render(scene, camera);
  renderer.render(scene, camera);
}
window.addEventListener("resize", onWindowResize);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  labelRenderer2.render(scene, camera);
}

animate();
main();


