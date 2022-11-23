import * as THREE from "../../build/three.module.js";
import output_fragment from "./output_fragment2.glsl.js";

/**
 * 添加扫描光带效果
 */
 function addScanLightBar(material) {
  let materialShader;
  material.onBeforeCompile = shader => {
    materialShader = shader;
    shader.uniforms.time = {
      value: 0.0,
    };
    // 顶点位置坐标position类似uv坐标进行插值计算，用于在片元着色器中控制片元像素
    shader.vertexShader = shader.vertexShader.replace(
      "void main() {",
      [
        "varying vec3 vPosition;",
        "void main() {",
        "vPosition = position;",
      ].join("\n")
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      [
        "varying vec3 vPosition;",
        "uniform float time;",
        "void main() {"
      ].join("\n")
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <output_fragment>",
      output_fragment
    );
  };
  // 创建一个时钟对象Clock
  const clock = new THREE.Clock();
  const scanAnimation = () => {
    // 获得两次scanAnimation执行的时间间隔deltaTime
    var deltaTime = clock.getDelta();
    // 更新uniforms中时间，这样就可以更新着色器中time变量的值
    if (materialShader) {
      materialShader.uniforms.time.value += deltaTime;
      if (materialShader.uniforms.time.value > 15){
        materialShader.uniforms.time.value = 0;
      }
    }
    requestAnimationFrame(scanAnimation);
  };
  scanAnimation();
}

export {
  addScanLightBar
};