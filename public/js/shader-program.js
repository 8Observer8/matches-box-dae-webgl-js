const vertShaderSource =
    `attribute vec4 aPosition;
    attribute vec4 aNormal;
    attribute vec2 aTexCoord;
    uniform mat4 uMvpMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vTexCoord;
    void main()
    {
        gl_Position = uMvpMatrix * aPosition;
        vPosition = vec3(uModelMatrix * aPosition);
        vNormal = normalize(vec3(uNormalMatrix * aNormal));
        vTexCoord = aTexCoord;
    }`;

const fragShaderSource =
    `precision mediump float;
    const vec3 lightColor = vec3(1.0, 1.0, 1.0);
    const float ambient = 0.3;
    uniform vec3 uLightPosition;
    uniform sampler2D uSampler;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vTexCoord;
    void main()
    {
        vec4 color = texture2D(uSampler, vTexCoord);
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(uLightPosition - vPosition);
        float nDotL = max(dot(lightDirection, normal), ambient);
        vec3 diffuse = lightColor * color.rgb * nDotL;
        gl_FragColor = vec4(diffuse, color.a);
    }`;

const vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, vertShaderSource);
gl.compileShader(vShader);
let ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
if (!ok) { console.log("vert: " + gl.getShaderInfoLog(vShader)); };

const fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fShader, fragShaderSource);
gl.compileShader(fShader);
ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
if (!ok) { console.log("frag: " + gl.getShaderInfoLog(fShader)); };

const program = gl.createProgram();
gl.attachShader(program, vShader);
gl.attachShader(program, fShader);
gl.bindAttribLocation(program, 0, "aPosition");
gl.bindAttribLocation(program, 1, "aNormal");
gl.bindAttribLocation(program, 2, "aTexCoord");
gl.linkProgram(program);
ok = gl.getProgramParameter(program, gl.LINK_STATUS);
if (!ok) { console.log("link: " + gl.getProgramInfoLog(program)); };
gl.useProgram(program);
