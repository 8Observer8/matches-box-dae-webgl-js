const canvas = document.getElementById("renderCanvas");
const gl = canvas.getContext("webgl");
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.5, 0.6, 0.8, 1.0);
