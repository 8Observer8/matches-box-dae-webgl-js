
async function initVertexBuffers(modelPaths, callback)
{
    const vertPosBuffers = [];
    const normalBuffers = [];
    const texCoordBuffers = [];
    const amounts = [];

    for (let i = 0; i < modelPaths.length; ++i)
    {
        const contentResponse = await fetch(modelPaths[i]);
        const content = await contentResponse.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");

        const expForIndexes = "//*[local-name() = 'p']/text()";
        let nodes = xmlDoc.evaluate(expForIndexes, xmlDoc, null, XPathResult.ANY_TYPE, null);
        let result = nodes.iterateNext();
        const order = result.textContent.trim().split(" ").map((value) => { return parseInt(value); });
        // console.log(order);

        const partOfPositionsId = "mesh-positions-array";
        const expForPositions = `//*[local-name() = 'float_array'][substring(@id, string-length(@id) -` +
            `string-length('${partOfPositionsId}') + 1) = '${partOfPositionsId}']`;
        nodes = xmlDoc.evaluate(expForPositions, xmlDoc, null, XPathResult.ANY_TYPE, null);
        result = nodes.iterateNext();
        const positions = result.textContent.trim().split(" ").map((value) => { return parseFloat(value); });
        // console.log(positions);

        const partOfNormalsId = "mesh-normals-array";
        const expForNormals = `//*[local-name() = 'float_array'][substring(@id, string-length(@id) -` +
            `string-length('${partOfNormalsId}') + 1) = '${partOfNormalsId}']`;
        nodes = xmlDoc.evaluate(expForNormals, xmlDoc, null, XPathResult.ANY_TYPE, null);
        result = nodes.iterateNext();
        const normals = result.textContent.trim().split(" ").map((value) => { return parseFloat(value); });
        // console.log(normals);

        const partOfTexCoordsId = "mesh-map-0-array";
        const expForTexCoords = `//*[local-name() = 'float_array'][substring(@id, string-length(@id) -` +
            `string-length('${partOfTexCoordsId}') + 1) = '${partOfTexCoordsId}']`;
        nodes = xmlDoc.evaluate(expForTexCoords, xmlDoc, null, XPathResult.ANY_TYPE, null);
        result = nodes.iterateNext();
        const texCoords = result.textContent.trim().split(" ").map((value) => { return parseFloat(value); });
        // console.log(texCoords);

        const correctionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.fromXRotation(correctionMatrix, -Math.PI / 2);

        const vertPosResult = [];
        const normalsResult = [];
        const texCoordsResult = [];

        const amountOfTriangles = order.length / 9;
        for (let i = 0; i < amountOfTriangles; ++i)
        {
            for (let j = 0; j < 9; ++j)
            {
                if ((i * 9 + j) % 3 === 0)
                {
                    const vx = positions[order[i * 9 + j] * 3 + 0];
                    const vy = positions[order[i * 9 + j] * 3 + 1];
                    const vz = positions[order[i * 9 + j] * 3 + 2];
                    const oldPos = glMatrix.vec3.fromValues(vx, vy, vz);
                    const newPos = glMatrix.vec3.create();
                    glMatrix.vec3.transformMat4(newPos, oldPos, correctionMatrix);
                    vertPosResult.push(newPos[0]);
                    vertPosResult.push(newPos[1]);
                    vertPosResult.push(newPos[2]);
                }
                else if((i * 9 + j) % 3 === 1)
                {
                    const nx = normals[order[i * 9 + j] * 3 + 0];
                    const ny = normals[order[i * 9 + j] * 3 + 1];
                    const nz = normals[order[i * 9 + j] * 3 + 2];
                    const oldNormal = glMatrix.vec3.fromValues(nx, ny, nz);
                    const newNormal = glMatrix.vec3.create();
                    glMatrix.vec3.transformMat4(newNormal, oldNormal, correctionMatrix);
                    normalsResult.push(newNormal[0]);
                    normalsResult.push(newNormal[1]);
                    normalsResult.push(newNormal[2]);
                }
                else if((i * 9 + j) % 3 === 2)
                {
                    texCoordsResult.push(texCoords[order[i * 9 + j] * 2 + 0]);
                    texCoordsResult.push(texCoords[order[i * 9 + j] * 2 + 1]);
                }
            }
        }
        // console.log(vertPosResult);
        // console.log(texCoordsResult);

        const vertPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPosResult), gl.STATIC_DRAW);

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsResult), gl.STATIC_DRAW);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsResult), gl.STATIC_DRAW);

        vertPosBuffers.push(vertPosBuffer);
        normalBuffers.push(normalBuffer);
        texCoordBuffers.push(texCoordBuffer);
        amounts.push(vertPosResult.length / 3);
    }

    callback(vertPosBuffers, normalBuffers, texCoordBuffers, amounts);
}
