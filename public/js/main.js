let matchesBox, floor;

const projMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create();
const projViewMatrix = glMatrix.mat4.create();

initVertexBuffers(["assets/matches-box.dae", "assets/floor.dae"],
    (vertPosVBOs, normalVBOs, texCoordVBOs, amounts) =>
    {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        const matchesBoxImage = document.getElementById("matchesBoxImage");
        const matchesBoxTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, matchesBoxTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, matchesBoxImage);
        matchesBox = new Renderable(program, [0, 1, 2], amounts[0],
            vertPosVBOs[0], normalVBOs[0], texCoordVBOs[0], matchesBoxTexture);

        const floorImage = document.getElementById("floorImage");
        const floorTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, floorTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, floorImage);
        floor = new Renderable(program, [0, -2, 0], amounts[1],
            vertPosVBOs[1], normalVBOs[1], texCoordVBOs[1], floorTexture);
        floor.scale = [10, 10, 10];

        init();
    });

function init()
{
    glMatrix.mat4.perspective(projMatrix, 55 * Math.PI / 180, 1, 0.1, 500);
    glMatrix.mat4.lookAt(viewMatrix, [3, 5, 7], [0, 0, 0], [0, 1, 0]);

    const lightPosition = glMatrix.vec3.fromValues(5, 7, 9);
    const uLightPositionLocation = gl.getUniformLocation(program, "uLightPosition");
    gl.uniform3fv(uLightPositionLocation, lightPosition);

    window.onresize = () =>
    {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        glMatrix.mat4.perspective(projMatrix, 55 * Math.PI / 180, w / h, 0.1, 500);
        draw();
    };
    window.onresize(null);
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.mul(projViewMatrix, projMatrix, viewMatrix);

    matchesBox.draw(projViewMatrix);
    floor.draw(projViewMatrix);
}
