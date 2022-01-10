class Renderable
{
    constructor(program, position, amountOfVertices, vertPosBuffer, normalBuffer, texCoordBuffer, texture)
    {
        this.position = position;
        this.rotation = glMatrix.quat.create();
        this.scale = [1, 1, 1];

        this.amountOfVertices = amountOfVertices;
        this.vertPosBuffer = vertPosBuffer;
        this.normalBuffer = normalBuffer;
        this.texCoordBuffer = texCoordBuffer;
        this.texture = texture;

        this.mvpMatrix = glMatrix.mat4.create();
        this.modelMatrix = glMatrix.mat4.create();
        this.normalMatrix = glMatrix.mat4.create();

        gl.useProgram(program);
        this.uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this.uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        this.uNormalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");
        this.program = program;
    }

    bind()
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertPosBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(1);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(2);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    draw(projViewMatrix)
    {
        gl.useProgram(this.program);

        glMatrix.mat4.fromRotationTranslationScale(this.modelMatrix, this.rotation, this.position, this.scale);
        glMatrix.mat4.mul(this.mvpMatrix, projViewMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);
        gl.uniformMatrix4fv(this.uModelMatrixLocation, false, this.modelMatrix);

        glMatrix.mat4.invert(this.normalMatrix, this.modelMatrix);
        glMatrix.mat4.transpose(this.normalMatrix, this.normalMatrix);
        gl.uniformMatrix4fv(this.uNormalMatrixLocation, false, this.normalMatrix);

        this.bind();
        gl.drawArrays(gl.TRIANGLES, 0, this.amountOfVertices);
    }
}
