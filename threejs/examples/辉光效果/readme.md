原理
1、渲染到纹理
2、阈值化，提取亮色
3、模糊
4、原始纹理与bloom纹理混合。

实现方式：后期处理。

场景中个别物体辉光实现：
1、创建两个效果合成器，一个bloom不渲染到屏幕，另一个正常渲染
2、场景中辉光物体除外，设置黑色材质
3、boom合成器渲染
4、还原物体材质，正常渲染
5、自定义后期通道，混合纹理

const shaderPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture },
    },
    vertexShader: vs,
    fragmentShader: fs,
    defines: {},
  }),
  'baseTexture',
); // 创建自定义的着色器Pass，详细见下
shaderPass.needsSwap = true;
finalComposer.addPass(shaderPass);

// vertextshader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
​
// fragmentshader
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;
void main() {
  gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
}