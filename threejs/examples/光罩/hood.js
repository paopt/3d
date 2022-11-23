import * as THREE from "../../build/three.module.js";

const vertexShader = `
  varying vec3 vNormal;
  void main() 
  {
    // normal：对应geometry.attributes.normal数据
    // 相机视图矩阵和模型自身的矩阵变换都会影响模型表面某位置法线相对视线夹角发生改变
    // 法线矩阵normalMatrix是通过模型的模型矩阵和视图矩阵变换而来
    // three.js内部normalMatrix表示顶点法线的变换矩阵
    vNormal = normalize( normalMatrix * normal ); 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;
const fragmentShader =  `
  varying vec3 vNormal;
  void main() 
  {
    vec3 z = vec3(0.0,0.0,1.0);//z轴方向单位向量
    //两个向量夹角余弦值dot(vNormal, z)范围[-1,1]
    float x = abs(dot(vNormal, z));//点乘结果余弦值绝对值范围[0,1]
    //透明度渐变模拟一种透明发光的感觉
    // 夹角零度 余弦值1  夹角90度余弦值0   
    // 对于球体而言：夹角90度的边缘部分最亮或说不透明 中间完全透明
    // float alpha = 1.0-x;//透明度随着余弦值线性变化
    float alpha = pow( 1.0 - x, 2.0 );//透明度随着余弦值非线性变化  比如二次方  三次方 渲染不同的效果
    gl_FragColor = vec4( vec3(0.0,1.0,1.0), alpha );
  }
`;
function createHood(v) {
  const geometry = new THREE.SphereGeometry( 30, 32, 32, 0, Math.PI );
  const material = new THREE.ShaderMaterial( {
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  } );
  const sphere = new THREE.Mesh( geometry, material );
  sphere.position.copy(v);
  sphere.rotateX(-Math.PI / 2);
  sphere.position.y = 1;
  return sphere;
}

export {
  createHood
};