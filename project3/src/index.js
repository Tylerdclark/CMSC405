import * as THREE from "three";
import "./modal"; //for the modal menu

("use strict");

let scene, camera, renderer; // Three.js rendering basics.

let canvas; // The canvas on which the image is rendered.

let model; // Contains the visible objects in the scene, but
// not the lights or camera.  The model can be
// rotated using the keyboard.

// Nodes in the scene graphs that are modified as part of the animation:
let sphereRotator; // The sphere is a child of this object; rotating
// this object about the y-axis rotates the sphere.

let animating = false; // This is set to true when an animation is running.

/*  Create the scene graph.  This function is called once, as soon as the page loads.
 *  The renderer has already been created before this function is called.
 */
const createWorld = () => {
    //renderer.setClearColor(0x444444); // Set background color (0x444444 is dark gray).
    scene = new THREE.Scene();

    // create a camera, sitting on the positive z-axis.  The camera is not part of the scene.
    camera = new THREE.PerspectiveCamera(
        45,
        canvas.width / canvas.height,
        1,
        30
    );
    camera.position.z = 15;

    // create some lights and add them to the scene.
    scene.add(new THREE.DirectionalLight(0xffffff, 0.4)); // dim light shining from above
    const viewpointLight = new THREE.DirectionalLight(0xffffff, 0.8); // a light to shine in the direction the camera faces
    viewpointLight.position.set(0, 0, 1); // shines down the z-axis
    scene.add(viewpointLight);

    // create the model
    //model = new THREE.Object3D();
 
    const points = new THREE.Geometry();

    while(points.vertices.length < 1000) {
      let x = 2 * Math.random() -1;
      let y = 2 * Math.random() -1;
      let z = 2 * Math.random() -1;
      
      if (x*x + y*y + z*z < 1) {
        points.vertices.push(new THREE.Vector3(x, y, z))
      }
      
    }
    const pointMaterial = new THREE.PointsMaterial( {
      color: "yellow",
      size: 2,
      sizeAttenuation: false
  } );
    const sphereOfPoints = new THREE.Points(points, pointMaterial);
    scene.add(sphereOfPoints)

    //model.rotation.set(0.2, 0, 0); // Tip it forward a bit, so we're not looking at it edge-on.

    //scene.add(model);
};

/*  Render the scene.  This is called for each frame of the animation.
 */
const render = () => {
    renderer.render(scene, camera);
};

/*  When an animation is in progress, this function is called just before rendering each
 *  frame of the animation, to make any changes necessary in the scene graph to prepare
 *  for that frame.
 */
const updateForFrame = () => {
    sphereRotator.rotation.y += 0.03;
};

//--------------------------- animation support -----------------------------------

/* This function runs the animation by calling updateForFrame() then calling render().
 * Finally, it arranges for itself to be called again to do the next frame.  When the
 * value of animating is set to false, this function does not schedule the next frame,
 * so the animation stops.
 */
const doFrame = () => {
    if (animating) {
        updateForFrame();
        render();
        requestAnimationFrame(doFrame);
    }
};

/* Responds when the setting of the "Animate" checkbox is changed.  This
 * function will start or stop the animation, depending on its setting.
 */
const doAnimateCheckbox = () => {
    const anim = document.getElementById("animate").checked;
    if (anim != animating) {
        animating = anim;
        if (animating) {
            doFrame();
        }
    }
};

//----------------------------- keyboard support ----------------------------------

/*  Responds to user's key press.  Here, it is used to rotate the model.
 */
const doKey = (event) => {
    const code = event.keyCode;
    let rotated = true;
    switch (code) {
        case 37:
          
            model.rotation.y -= 0.03;
            break; // left arrow
        case 39:
            model.rotation.y += 0.03;
            break; // right arrow
        case 38:
            model.rotation.x -= 0.03;
            break; // up arrow
        case 40:
            model.rotation.x += 0.03;
            break; // down arrow
        case 33:
            model.rotation.z -= 0.03;
            break; // page up
        case 34:
            model.rotation.z += 0.03;
            break; // page down
        case 36:
            model.rotation.set(0.2, 0, 0);
            break; // home
        default:
            rotated = false;
    }
    if (rotated) {
        event.preventDefault(); // Prevent keys from scrolling the page.
        if (!animating) {
            // (if an animation is running, no need for an extra render)
            render();
        }
    }
};

//----------------------------------------------------------------------------------

/**
 *  This init() function is called when by the onload event when the document has loaded.
 */
const init = () => {
    try {
        canvas = document.getElementById("glcanvas");
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
    } catch (e) {
        console.log(e);
        document.getElementById("canvas-holder").innerHTML =
            "<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
        return;
    }
    document.addEventListener("keydown", doKey, false);
    document.getElementById("animate").checked = false;
    document.getElementById("animate").onchange = doAnimateCheckbox;

    //window.addEventListener("resize", onWindowResize)

    createWorld();
    render();
};



window.addEventListener("load", init, false);

