// 全局对象定义
let scene, camera, renderer, stats;

// GUI配置参数对象
let config = {
  width: 50,
  color: 0xff0000
};

/**
 * 初始化环境
 */
function initEnvironment() {
  // 场景
  scene = new THREE.Scene();

  // 相机
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 50, 50, 50 );

  // 渲染器
  renderer =  new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  // 控制器，鼠标控制
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.minDistance = 100;
  controls.maxDistance = 1000;
}


/**
 * 初始化灯光
 */
function initLight() {
  // 平行光
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
  directionalLight.position.set( 0.5, 0.6, 0.7 ).normalize();
  scene.add( directionalLight );

  // 环境光
  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);
}


/**
 * 初始化辅助对象
 */
function initHelper() {
  // 性能
  stats = new Stats();
  document.body.appendChild( stats.dom );

  // 坐标系
  const axesHelper = new THREE.AxesHelper(50);
  scene.add( axesHelper );
}

// 初始化配置面板
function initGUI() {
  const gui = new dat.GUI();

  gui.add(config, 'width', 0, 100).onChange(e => {
    config.width = e;
    console.log(config);
  });
  gui.addColor(config, 'color').onChange((e) => {
    config.color = e;
    console.log(config);
});
}

/**
 * 绑定各种事件
 */
function listen() {
  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * 绘制
 */
 function draw() {
  const geometry = new THREE.BoxGeometry(config.width, config.width, config.width);
  const material = new THREE.MeshPhongMaterial( { color: config.color} );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
}

// 循环渲染
function animate() {
  renderer.clear(true, true, true);
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  stats.update();
};

// 入口
function main() {
  initEnvironment();
  initLight();
  initHelper();
  initGUI();
  draw();
  listen();
  animate();
}

main();
