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

const ANGLE_STEP = 45.0; // 旋转速度

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

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  gl.clearColor(0, 0, 0, 1);

  // Current rotation angle
  let currentAngle = 0.0;
  // Model matrix
  const modelMatrix = new Matrix4();

  // 轮询
  const tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
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

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
  modelMatrix.translate(0.35, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 重新绘制
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

// 计算角度
let g_last = Date.now();
function animate(angle) {
  const now = Date.now();
  const elapsed = now - g_last;
  g_last = now;
  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

main();
