"use strict";


let gl;   // The webgl context.
let canvas; // The canvas we are drawing to

let a_coords_loc;         // Location of the a_coords attribute variable in the shader program.
let a_normal_loc;         // Location of a_normal attribute 
let a_texCoords_loc; 

let u_modelview;       // Locations for uniform matrices
let u_projection;
let u_normalMatrix;

let u_material;     // An object holds uniform locations for the material.
let u_lights;       // An array of objects that holds uniform locations for light properties.

let projection = mat4.create();    // projection matrix
let modelview;                     // modelview matrix; value comes from rotator
let normalMatrix = mat3.create();  // matrix, derived from modelview matrix, for transforming normal vectors

let rotator;  // A TrackballRotator to implement rotation by mouse.

let frameNumber = 0;  // frame number during animation (actually only goes up by 0.5 per frame)

let torusMdl, sphereMdl, coneMdl, cylinderMdl, diskMdl, ringMdl, cubeMdl;  // basic objects, created using function createModel

let matrixStack = [];           // A stack of matrices for implementing hierarchical graphics.

let currentColor = [1,1,1,1];   // The current diffuseColor; render() functions in the basic objects set
                                // the diffuse color to currentColor when it is called before drawing the object.
                                // Other color properties, which don't change often are handled elsewhere.

/**
 * Draws the image, which consists of either the "world" or a closeup of the "car".
 */
const draw = () => {
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(projection, Math.PI/4, 1, 1, 50);
    gl.uniformMatrix4fv(u_projection, false, projection );

    modelview = rotator.getViewMatrix();
    
    lights();

    pushMatrix();
    mat4.translate(modelview,modelview,[0,-5,0]);
    mat4.rotate(modelview,modelview, (Math.PI / 180) , [0,0,0]);
    mat4.scale(modelview, modelview, [10, 1, 10])
    currentColor = [0,0.4,0.8,1];
    cubeMdl.render();
    popMatrix();
    
    castle();
    
}


const lights = () => {   
     
    // Three of four lights used, all enabled
    // Use lights to enhance models looks
    gl.uniform1i( u_lights[0].enabled, 1 );   
    // Looking down z
    gl.uniform4f( u_lights[0].position, 0,0,1,0 ); 
    gl.uniform3f( u_lights[0].color, 1.0,1.0,1.0 );  
    
    gl.uniform1i( u_lights[1].enabled, 1 );  
    // Looking down X
    gl.uniform4f( u_lights[1].position, 1,0,0,0 ); 
    gl.uniform3f( u_lights[1].color, 0.0,1.0,0.0 );  
    
     gl.uniform1i( u_lights[2].enabled, 1 );  
    // Looking down Y
    gl.uniform4f( u_lights[2].position, 0,1,0,0 ); 
    gl.uniform3f( u_lights[2].color, 1.0,0.0,1.0 );  
    
    currentColor = [ 0.3, 0.3, 0.3, 1 ];
    pushMatrix();  

    // Modifying this material will change the Boxman look
    gl.uniform3f( u_material.emissiveColor, 0, 0, 0 );
    popMatrix();  
   
}

const castle = () => {
    /*TODO: make castle */
}

const tower = () => {
    /*TODO: make tower */
}

const wall = () => {
    /*TODO: make wall */
}


/**
 *  Push a copy of the current modelview matrix onto the matrix stack.
 */
const pushMatrix = () => {
    matrixStack.push( mat4.clone(modelview) );
}


/**
 *  Restore the modelview matrix to a value popped from the matrix stack.
 */
const popMatrix = () => {
    modelview = matrixStack.pop();
}

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
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    if (xtraTranslate)
        model.xtraTranslate = xtraTranslate;
    else
        model.xtraTranslate = null;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function() {  // This function will render the object.
           // Since the buffer from which we are taking the coordinates and normals
           // change each time an object is drawn, we have to use gl.vertexAttribPointer
           // to specify the location of the data. And to do that, we must first
           // bind the buffer that contains the data.  Similarly, we have to
           // bind this object's index buffer before calling gl.drawElements.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
        gl.uniform4fv(u_material.diffuseColor, currentColor);
        if (this.xtraTranslate) {
            pushMatrix();
            mat4.translate(modelview,modelview,this.xtraTranslate);
        }
        gl.uniformMatrix4fv(u_modelview, false, modelview );
        mat3.normalFromMat4(normalMatrix, modelview);
        gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
        if (this.xtraTranslate) {
            popMatrix();
        }
    }
    return model;
}


/* Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type String is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 *    The second and third parameters are the id attributes for <script>
 * elementst that contain the source code for the vertex and fragment
 * shaders.
 */
const createProgram = (gl) => {

    const vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShader); //from shader-source.js
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
     }
    const fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShader); //from shader-source.js
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    const prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}


/* Initialize the WebGL context.  Called from init() */
const initGL = () => {
    const prog = createProgram(gl);
    gl.useProgram(prog);
    gl.enable(gl.DEPTH_TEST);
    
    /* Get attribute and uniform locations */
    
    a_coords_loc =  gl.getAttribLocation(prog, "a_coords");
    a_normal_loc =  gl.getAttribLocation(prog, "a_normal");
    gl.enableVertexAttribArray(a_coords_loc);
    gl.enableVertexAttribArray(a_normal_loc);
    
    u_modelview = gl.getUniformLocation(prog, "modelview");
    u_projection = gl.getUniformLocation(prog, "projection");
    u_normalMatrix =  gl.getUniformLocation(prog, "normalMatrix");
    u_material = {
        diffuseColor: gl.getUniformLocation(prog, "material.diffuseColor"),
        specularColor: gl.getUniformLocation(prog, "material.specularColor"),
        emissiveColor: gl.getUniformLocation(prog, "material.emissiveColor"),
        specularExponent: gl.getUniformLocation(prog, "material.specularExponent")
    };
    u_lights = new Array(4);
    for (let i = 0; i < 4; i++) {
        u_lights[i] = {
            enabled: gl.getUniformLocation(prog, "lights[" + i + "].enabled"),
            position: gl.getUniformLocation(prog, "lights[" + i + "].position"),
            color: gl.getUniformLocation(prog, "lights[" + i + "].color")            
        };
    }
            
    gl.uniform3f( u_material.specularColor, 0.1, 0.1, 0.1 );  // specular properties don't change
    gl.uniform1f( u_material.specularExponent, 16 );
    gl.uniform3f( u_material.emissiveColor, 0, 0, 0);  // default, will be changed temporarily for some objects
    

    for (let i = 1; i < 4; i++) { // set defaults for lights
        gl.uniform1i( u_lights[i].enabled, 0 ); 
        gl.uniform4f( u_lights[i].position, 0, 0, 1, 0 );        
        gl.uniform3f( u_lights[i].color, 1,1,1 ); 
    }
    
  // Lights are set on in the draw() method
    
  
    
} // end initGL()



//--------------------------------- animation framework ------------------------------

    
let animating = false;

/*
This is where you control the animation by changing positions,
and rotations values as needed.
Trial and error works on the numbers. Graph paper design is more efficient. 
*/

const frame = () => {
    if (animating) {
        frameNumber += 1;
        /* TODO: Add animation logic */
        draw();
        requestAnimationFrame(frame);
    }
}

const setAnimating = (run) => {
    if (run != animating) {
        animating = run;
        if (animating)
            requestAnimationFrame(frame);
    }
}

//-------------------------------------------------------------------------


/**
 * initialization function that will be called when the page has loaded
 */
const init = () => {
    try {
        canvas = document.getElementById("webglcanvas");
        gl = canvas.getContext("webgl") || 
                         canvas.getContext("experimental-webgl");
        if ( ! gl ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("message").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }
    try {
        initGL();  // initialize the WebGL graphics context
    }
    catch (e) {
        document.getElementById("message").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context:" + e + "</p>";
        return;
    }
    document.getElementById("animCheck").checked = false;
    document.getElementById("reset").onclick = () => {
       rotator.setView(17,[0,1,2]);
       frameNumber = 0;    
       /* TODO: reset conditions for animation */
       animating = false;
       document.getElementById("animCheck").checked = false;
       draw();
    }
    
    // Not really using all of these
    // As you create your scene use these or create from primitives
    torusMdl = createModel(uvTorus(0.5,1,16,8));   // Create all the basic object;
    sphereMdl = createModel(uvSphere(1));
    coneMdl = createModel(uvCone(),[0,0,.5]);
    cylinderMdl = createModel(uvCylinder(),[0,0,1.5]);
    diskMdl = createModel(uvCylinder(5.5,0.5,64),[0,0,.25]);
    ringMdl = createModel(ring(3.3,4.8,40));
    cubeMdl = createModel(cube());
 
    
 // This controls the zoom and initial placement
    rotator = new TrackballRotator(canvas, () => {
        if (!animating)
           draw();
    },40,[0,0,2]); 
    draw();
}