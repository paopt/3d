import { CSS2DObject, CSS2DRenderer} from '../jsm/renderers/CSS2DRenderer.js';

// 2d标签渲染器
const labelRenderer2 = new CSS2DRenderer();
labelRenderer2.setSize( window.innerWidth, window.innerHeight );
labelRenderer2.domElement.style.position = 'absolute';
labelRenderer2.domElement.style.top = '0px';
labelRenderer2.domElement.style.pointerEvents = 'none';
document.body.appendChild( labelRenderer2.domElement );

function createLabel() {
  // 创建div元素(作为标签)
  const div = document.createElement("div");
  div.style.color = "#fff";
  div.style.fontSize = "16px";
  div.style.position = "absolute";
  div.style.backgroundColor = 'rgba(25,25,25,0.5)';
  div.style.borderRadius = '5px';
  div.style.padding = '5px 10px';
  const label = new CSS2DObject(div);
  return label;
}

export {
  createLabel, labelRenderer2
};