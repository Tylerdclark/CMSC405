"use strict";

let gl; // The webgl context.
let canvas; // The canvas we are drawing to

let prog; // The main shader program, for the 3D on-screen image

let a_coords_loc; // Location of the a_coords attribute variable in the shader program.
let a_normal_loc; // Location of a_normal attribute
let a_texCoords_loc;

let u_modelview; // Locations for uniform matrices
let u_projection;
let u_normalMatrix;
let u_texture;
let u_textureTransform;

/////////////////
let u_useLighting;
let u_ambientColor;
let u_lightingDirection;
let u_directionalColor;
///////////////////


let projection = mat4.create(); // projection matrix
let modelview; // modelview matrix; value comes from rotator
let normalMatrix = mat3.create(); // matrix, derived from modelview matrix, for transforming normal vectors
let textureTransform = mat3.create(); // texture transform matrix

let framebuffer; // The framebuffer object that is used to draw to the texture
let texture; // The texture object where the 2D image is drawn

let rotator; // A TrackballRotator to implement rotation by mouse.

let frameNumber = 0; // frame number during animation (actually only goes up by 0.5 per frame)

let torusMdl, sphereMdl, coneMdl, cylinderMdl, diskMdl, ringMdl, cubeMdl; // basic objects, created using function createModel

let matrixStack = []; // A stack of matrices for implementing hierarchical graphics.

let textureLoaded;

let textureObjects;

let animating = false;
let showDoor = true;
let showFloor = true;
let isLighting = true;

const IMAGES = [
    "./textures/brick.jpg",
    "./textures/wood.png",
    "./textures/grass.png",
];

/**
 * Draws the image
 */
const draw = () => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!textureLoaded) {
        return;
    }
    mat4.perspective(projection, Math.PI / 10, 1, 1, 50);
    gl.uniformMatrix4fv(u_projection, false, projection);

    modelview = rotator.getViewMatrix();
    mat3.identity(textureTransform);

    lights();
    castle();
};

const lights = () => {
    
    if (isLighting) {
        gl.uniform1i(u_useLighting, isLighting);
        gl.uniform3f(
            u_ambientColor,
            parseFloat(document.getElementById("ambientR").value),
            parseFloat(document.getElementById("ambientG").value),
            parseFloat(document.getElementById("ambientB").value)
        );

        let lightingDirection = [
            parseFloat(document.getElementById("lightDirectionX").value),
            parseFloat(document.getElementById("lightDirectionY").value),
            parseFloat(document.getElementById("lightDirectionZ").value)
        ];
        let adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        //vec3.scale(adjustedLD, 1);
        gl.uniform3fv(u_lightingDirection, adjustedLD);

        gl.uniform3f(
            u_directionalColor,
            parseFloat(document.getElementById("directionalR").value),
            parseFloat(document.getElementById("directionalG").value),
            parseFloat(document.getElementById("directionalB").value)
        );
    }
};

const castle = () => {

    if (animating) {
        mat4.rotate(modelview, modelview, (Math.PI / 180) * (frameNumber), [0, 1, 0])
    }
    //gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[2]);

    if (showFloor){
        pushMatrix();
        mat4.translate(modelview, modelview, [0, -1, 0]);
        mat4.rotate(modelview, modelview, Math.PI / 180, [0, 0, 0]);
        mat4.scale(modelview, modelview, [10, 1, 10]);
        cubeMdl.render();
        popMatrix();
    }

    // towers
    pushMatrix();
    mat4.translate(modelview, modelview, [3, 0, 2.5]);
    tower();
    popMatrix();

    pushMatrix();
    mat4.translate(modelview, modelview, [3, 0, -2.5]);
    tower();
    popMatrix();

    pushMatrix();
    mat4.translate(modelview, modelview, [-3, 0, -2.5]);
    tower();
    popMatrix();

    pushMatrix();
    mat4.translate(modelview, modelview, [-3, 0, 2.5]);
    tower();
    popMatrix();

    // wall
    pushMatrix();
    mat4.translate(modelview, modelview, [3, 0, 0]);
    mat4.rotate(modelview, modelview, (Math.PI / 180) * 90, [0, 1, 0] )
    wall();
    popMatrix();
    
    pushMatrix();
    mat4.translate(modelview, modelview, [-3, 0, 0]);
    mat4.rotate(modelview, modelview, (Math.PI / 180) * 90, [0, 1, 0] )
    wall();
    popMatrix();

    pushMatrix();
    mat4.translate(modelview, modelview, [0, 0, -2.5]);
    wall();
    popMatrix();

    pushMatrix();
    mat4.translate(modelview, modelview, [0, 0, 1.5]);
    gate();
    popMatrix();

    // raise the roof
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 2.75, 0])
    mat4.scale(modelview, modelview, [5.25,.5,5.25])
    cubeMdl.render();
    popMatrix();

    if (showDoor){
        gateDoor();
    }

};
const gateDoor = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[1]);
    pushMatrix()
    mat4.translate(modelview, modelview, [0, 1, 2.5]);
    mat4.scale(modelview, modelview, [3, 3, .5])
    cubeMdl.render()
    popMatrix()
}

const tower = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[0]);
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 1.5, 0]);
    mat4.rotate(modelview, modelview, (Math.PI / 180) * 90, [1, 0, 0]);
    mat4.scale(modelview, modelview, [1, 1, 4.5]);
    cylinderMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 4, 0]);
    mat4.rotate(modelview, modelview, (Math.PI / 180) * 90, [1, 0, 0]);
    mat4.scale(modelview, modelview, [1.5, 1.5, 0.5]);
    cylinderMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 4.5, 0.5]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [1, 0, 0]);
    mat4.scale(modelview, modelview, [0.25, 0.5, 0.5]);
    cubeMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 4.5, -0.5]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [1, 0, 0]);
    mat4.scale(modelview, modelview, [0.25, 0.5, 0.5]);
    cubeMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [-0.5, 4.5, 0]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [1, 0, 0]);
    mat4.scale(modelview, modelview, [0.5, 0.5, 0.25]);
    cubeMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [0.5, 4.5, 0]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [1, 0, 0]);
    mat4.scale(modelview, modelview, [0.5, 0.5, 0.25]);
    cubeMdl.render();
    popMatrix();
};

const wall = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[0]);
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 1, 0]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [0, 0, 0]);
    mat4.scale(modelview, modelview, [5, 3, 0.5]);
    cubeMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 2.75, 0]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [0, 0, 0]);
    mat4.scale(modelview, modelview, [5, 0.75, 0.75]);
    cubeMdl.render();
    popMatrix();
};


const gate = () => {
    gl.bindTexture(gl.TEXTURE_2D, textureObjects[0]);
    pushMatrix();
    mat4.translate(modelview, modelview, [0, 3, 1]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [0, 0, 0]);
    mat4.scale(modelview, modelview, [5, 1, 0.75]);
    cubeMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [2, 1, 1]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [0, 0, 0]);
    mat4.scale(modelview, modelview, [1, 3, 0.75]);
    cubeMdl.render();
    popMatrix();
    pushMatrix();
    mat4.translate(modelview, modelview, [-2, 1, 1]);
    mat4.rotate(modelview, modelview, Math.PI / 180, [0, 0, 0]);
    mat4.scale(modelview, modelview, [1, 3, 0.75]);
    cubeMdl.render();
    popMatrix();
};

/**
 *  Push a copy of the current modelview matrix onto the matrix stack.
 */
const pushMatrix = () => {
    matrixStack.push(mat4.clone(modelview));
};

/**
 *  Restore the modelview matrix to a value popped from the matrix stack.
 */
const popMatrix = () => {
    modelview = matrixStack.pop();
};

/**
 *  Create one of the basic objects.  The modelData holds the data for
 *  an IFS using the structure from basic-objects-IFS.js.  This function
 *  creates VBOs to hold the coordinates, normal vectors, and indices
 *  from the IFS, and it loads the data into those buffers.  The function
 *  creates a new object whose properties are the identifies of the
 *  VBOs.  The new object also has a function, render(), that can be called to
 *  render the object, using all the data from the buffers.  That object
 *  is returned as the value of the function.  (The second parameter,
 *  xtraTranslate, is there because this program was ported from a Java
 *  version where cylinders were created in a different position, with
 *  the base on the xy-plane instead of with their center at the origin.
 *  The xtraTranslate parameter is a 3-vector that is applied as a
 *  translation to the rendered object.  It is used to move the cylinders
 *  into the position expected by the code that was ported from Java.)
 */
const createModel = (modelData, xtraTranslate) => {
    const model = {};
    model.coordsBuffer = gl.createBuffer();
    model.normalBuffer = gl.createBuffer();
    model.texCoordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    if (xtraTranslate) model.xtraTranslate = xtraTranslate;
    else model.xtraTranslate = null;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordsBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        modelData.vertexTextureCoords,
        gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function () {
        // This function will render the object.
        // Since the buffer from which we are taking the coordinates and normals
        // change each time an object is drawn, we have to use gl.vertexAttribPointer
        // to specify the location of the data. And to do that, we must first
        // bind the buffer that contains the data.  Similarly, we have to
        // bind this object's index buffer before calling gl.drawElements.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
        gl.vertexAttribPointer(a_texCoords_loc, 2, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(u_modelview, false, modelview);
        mat3.normalFromMat4(normalMatrix, modelview);
        gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    };
    return model;
};

/* Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type String is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 *    The second and third parameters are the id attributes for <script>
 * elementst that contain the source code for the vertex and fragment
 * shaders.
 */
const createProgram = (gl, vshader, fshader) => {
    const vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vshader); //from shader-source.js
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
    }
    const fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fshader); //from shader-source.js
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
};

/* Initialize the WebGL context.  Called from init() */
const initGL = () => {
    prog = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(prog);
    gl.enable(gl.DEPTH_TEST);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    a_coords_loc = gl.getAttribLocation(prog, "a_coords");
    a_normal_loc = gl.getAttribLocation(prog, "a_normal");
    a_texCoords_loc = gl.getAttribLocation(prog, "a_texCoords");
    u_modelview = gl.getUniformLocation(prog, "modelview");
    u_projection = gl.getUniformLocation(prog, "projection");
    u_normalMatrix = gl.getUniformLocation(prog, "normalMatrix");
    u_texture = gl.getUniformLocation(prog, "texture");
    u_textureTransform = gl.getUniformLocation(prog, "textureTransform");

    // hopefully for lighting

     u_useLighting = gl.getUniformLocation(prog, "uUseLighting");
     u_ambientColor = gl.getUniformLocation(prog, "uAmbientColor");
     u_lightingDirection = gl.getUniformLocation(prog, "uLightingDirection");
     u_directionalColor = gl.getUniformLocation(prog, "uDirectionalColor");

    gl.enableVertexAttribArray(a_coords_loc);
    gl.enableVertexAttribArray(a_normal_loc);
    gl.enableVertexAttribArray(a_texCoords_loc);

    gl.uniform1i(u_texture, 0);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    loadTextures();

    mat4.perspective(projection, Math.PI / 10, 1, 1, 10);
    gl.uniformMatrix4fv(u_projection, false, projection);
    // this was in draw vvv
    gl.uniformMatrix3fv(u_textureTransform, false, textureTransform);
}; // end initGL()

function loadTextures() {
    let loaded = 0; // number of textures that have been loaded
    textureObjects = new Array(IMAGES.length);

    const load = (textureNum, url) => {
        let img = new Image();
        img.onload = () => {
            loaded++;
            textureObjects[textureNum] = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, textureObjects[textureNum]);
            try {
                gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
            } catch (e) {
                // Chrome, at least, gets a security error if it tries to use a local file.
                document.getElementById("message").innerHTML =
                    "Sorry, can't access textures.  Note that some<br>browsers can't use textures from a local disk.";
                    console.log(e);
                    return;
            }
            
            gl.generateMipmap(gl.TEXTURE_2D);
            if (loaded === IMAGES.length) {
                textureLoaded = true;
                document.getElementById("message").innerHTML = "No errors ☺️";
                draw();
            }
        };
        img.onerror = () => {
            document.getElementById("message").innerHTML =
                "Sorry, could not load textures.";
        };
        img.src = url;
    };

    for (let i = 0; i < IMAGES.length; i++) {
        load(i, IMAGES[i]);
    }
}

//--------------------------------- animation framework ------------------------------



/*
This is where you control the animation by changing positions,
and rotations values as needed.
Trial and error works on the numbers. Graph paper design is more efficient. 
*/

const frame = () => {
    if (animating) {
        frameNumber = (frameNumber >= 360 ? 0 : ++frameNumber);
        draw();
        requestAnimationFrame(frame);
    }
};

const setAnimating = (run) => {
    if (run !== animating) {
        animating = run;
        if (animating) requestAnimationFrame(frame);
    }
};

const setDoor = (bool) => {
    showDoor = bool;
    draw();
    requestAnimationFrame(frame);
}
const setGround = (bool) => {
    showFloor = bool;
    draw();
    requestAnimationFrame(frame);
}
const setLighting = (bool) => {
    isLighting = bool;
    draw()
    requestAnimationFrame(frame);
}
//-------------------------------------------------------------------------

/**
 * initialization function that will be called when the page has loaded
 */
const init = () => {
    try {
        canvas = document.getElementById("webglcanvas");
        gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
        if (!gl) {
            throw "Browser does not support WebGL";
        }
    } catch (e) {
        document.getElementById("message").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }
    try {
        initGL(); // initialize the WebGL graphics context
    } catch (e) {
        document.getElementById("message").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context:" +
           // e +
            "</p>";
            console.log(e);
        return;
    }
    document.getElementById("animCheck").checked = false;
    document.getElementById("doorCheck").checked = true;
    document.getElementById("groundCheck").checked = true;
    document.getElementById("lighting").checked = true;
    document.getElementById("reset").onclick = () => {
        rotator.setView(40, [0, 1, 2]);
        frameNumber = 0;
        animating = false;
        showDoor = true;
        showFloor = true;
        frameNumber = 0;
        document.getElementById("animCheck").checked = false;
        document.getElementById("doorCheck").checked = true;
        document.getElementById("groundCheck").checked = true;
        document.getElementById("lighting").checked = true;
        draw();
    };

    // Not really using all of these
    // As you create your scene use these or create from primitives
    torusMdl = createModel(uvTorus(0.5, 1, 16, 8)); // Create all the basic object;
    sphereMdl = createModel(uvSphere(1));
    coneMdl = createModel(uvCone(), [0, 0, 0.5]);
    cylinderMdl = createModel(uvCylinder(), [0, 0, 1.5]);
    diskMdl = createModel(uvCylinder(5.5, 0.5, 64), [0, 0, 0.25]);
    ringMdl = createModel(ring(3.3, 4.8, 40));
    cubeMdl = createModel(cube());

    // This controls the zoom and initial placement
    rotator = new TrackballRotator(
        canvas,
        () => {
            if (!animating) draw();
        },
        40,
        [0, 1, 2]
    );
    draw();
};
