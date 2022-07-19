const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

function main() {
  const canvas = document.querySelector("#webgl");
  const gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return;
  }
  const n = initVertexBuffers(gl);
  if (n < 0) {
    return;
  }

  const angle = 90.0; // 旋转角度
  const radian = (Math.PI * angle) / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);

  //先平移，后旋转

  // 旋转 * ( 平移 * 坐标矢量) = (旋转 * 平移) * 坐标矢量
  // 使用矩阵函数库
  // 复合变换称为模型矩阵
  var modelMatrix = new Matrix4();

  var ANGLE = 60.0; // 旋转角度
  var Tx = 0.5;  // 平移距离
  modelMatrix.setRotate(ANGLE, 0, 0, 1);  // 旋转
  modelMatrix.translate(Tx, 0, 0);  // 平移

  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_xformMatrix");
    return;
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0, 0.3,   -0.3, -0.3,   0.3, -0.3]);
  const n = 3;
  const buffer = gl.createBuffer();
  if (!buffer) {
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return n;
}

main();
