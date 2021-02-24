import * as THREE from "three";
import "./modal"; //for the modal menu

("use strict");

let scene, camera, renderer; // Three.js rendering basics.
let canvas; // The canvas on which the image is rendered.
let animating = false; // This is set to true when an animation is running.
let objects = [];

let cylinderMesh;
let coneMesh;
let torusMesh;
let sphereMesh;
let cubeMesh;
let ringMesh;

const cylinderCb = document.getElementById("cylinderCb");
const coneCb = document.getElementById("coneCb");
const torusCb = document.getElementById("torusCb");
const sphereCb= document.getElementById("sphereCb");
const cubeCb= document.getElementById("cubeCb");
const ringCb = document.getElementById("ringCb");

/*  Create the scene graph.  This function is called once, as soon as the page loads.
 *  The renderer has already been created before this function is called.
 */
const createWorld = () => {
    //////////////////// Scene set-up //////////////////////
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        60,
        canvas.width / canvas.height,
        0.1,
        1000
    );
    camera.position.z = 400;
    
    //////////////////// Light up the scene //////////////////////

    scene.add(new THREE.DirectionalLight(0xffffff, 0.4)); // dim light shining from above
    scene.add(new THREE.AmbientLight(0xffffff,0.1)) //some ambient lighting
    const viewpointLight = new THREE.DirectionalLight(0xffffff, 0.8); // a light to shine in the direction the camera faces
    viewpointLight.position.set(0, 0, 1); // shines down the z-axis
    scene.add(viewpointLight);


    //////////////////// Create some stuff //////////////////////

    /* cylinder */

    const cylinderGeo = new THREE.CylinderGeometry(3,3,10,25,1)
    const cylinderMat = new THREE.MeshPhongMaterial({
        color: "green",
        //wireframe: true,
        emissive: 0,         // emission color; this is the default (black)
        specular: 0x070707,  // reflectivity for specular light
        flatShading: true,  // for flat-looking sides
        shininess: 100,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true  
    });

    cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinderMesh.position.set(-25, 20, 325);

    /* A cone */

    const coneGeo = new THREE.ConeGeometry(5, 10)
    const coneMat  = new THREE.MeshPhongMaterial({
        color: "blue",
        //wireframe: true,
        emissive: 0,         // emission color; this is the default (black)
        specular: 0x070707,  // reflectivity for specular light
        flatShading: true,  // for flat-looking sides
        shininess: 100,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true  
    });

    coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(0,20, 325) 

    /* Torus AKA donut */

    const torusGeo = new THREE.TorusGeometry(4, 2, 32, 32);
    const torusMat = new THREE.MeshPhongMaterial({
        color: "purple",
        emissive: 0,
        specular: 0x070707,  // reflectivity for specular light
        shininess: 100,
        side: THREE.DoubleSide
    })

    torusMesh = new THREE.Mesh(torusGeo,torusMat);
    torusMesh.position.set(30, 20, 325);

    /* A cube.. which I called square */
    const squareGeo = new THREE.BoxGeometry(10, 10, 10)
    const squareMat = new THREE.MeshPhongMaterial({
        color: "white",
        //wireframe: true,
        emissive: 0,         // emission color; this is the default (black)
        specular: 0x070707,  // reflectivity for specular light
        flatShading: true,  // for flat-looking sides
        shininess: 100,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true  
    });
    cubeMesh = new THREE.Mesh(squareGeo, squareMat)
    cubeMesh.position.z = 330
    cubeMesh.position.y = -20;

    /* A sphere */
    const sphereGeo = new THREE.SphereGeometry(5, 32, 16)
    const sphereMat = new THREE.MeshPhongMaterial({
        color: "cyan",
        emissive: 0,
        specular: 0x070707,  // reflectivity for specular light
        shininess: 100
    })
    sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(-25,-20,325)

    /* A ring */
    
    const ringGeo = new THREE.RingGeometry(2, 5, 32, 32)
    const ringMat = new THREE.MeshPhongMaterial({
        color: "red",
        emissive: 0,
        specular: 0x070707,  // reflectivity for specular light
        shininess: 100,
        side: THREE.DoubleSide
    })
    ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(30, -20, 325)
    
    //////////////////// Add the stuff to scene //////////////////////
    objects.push(cubeMesh)
    objects.push(sphereMesh);
    objects.push(ringMesh);
    objects.push(coneMesh);
    objects.push(torusMesh);
    objects.push(cylinderMesh);
    scene.add(cubeMesh);
    scene.add(sphereMesh);
    scene.add(ringMesh);
    scene.add(coneMesh);
    scene.add(torusMesh);
    scene.add(cylinderMesh);

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
    objects.forEach( obj => {
        obj.rotation.x +=0.03;
        obj.rotation.y +=0.03;
        obj.rotation.z +=0.03;
    })
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
const doCheckbox = () => {
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
    console.log(`${event.key} = ${code}`);
    let rotated = true;
    switch (code) {
        case 37:
            objects.every(obj => obj.rotation.y -= 0.03)
            break; // left arrow
        case 39:
            objects.every(obj => obj.rotation.y += 0.03)
            break; // right arrow
        case 38:
            objects.every(obj => obj.rotation.x -= 0.03)
            break; // up arrow
        case 40:
            objects.every(obj => obj.rotation.x += 0.03)
            break; // down arrow
        case 65:
            objects.every(obj => obj.rotation.z -= 0.03)
            break; // a key
        case 90:
            objects.every(obj => obj.rotation.z += 0.03)
            break; // z key
        case 27:
            objects.every(obj => obj.rotation.set(0.2, 0, 0))
            break; // escape
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
    /* Responding to keys*/
    document.addEventListener("keydown", doKey, false);
    /* Animating based on checkbox */
    document.getElementById("animate").checked = false;
    document.getElementById("animate").onchange = doCheckbox;
    /* The shape checkboxes*/
    cylinderCb.checked = true;
    coneCb.checked = true;
    torusCb.checked = true;
    sphereCb.checked = true;
    cubeCb.checked = true;
    ringCb.checked = true;

    /* Remove them if we don't need em*/
    cylinderCb.onchange = (event) => shapeChange(event, cylinderMesh);
    coneCb.onchange = (event) => shapeChange(event, coneMesh);
    torusCb.onchange = (event) => shapeChange(event, torusMesh);
    sphereCb.onchange = (event) => shapeChange(event, sphereMesh);
    cubeCb.onchange = (event) => shapeChange(event, cubeMesh);
    ringCb.onchange = (event) => shapeChange(event, ringMesh);

    //window.addEventListener("resize", onWindowResize)

    createWorld();
    render();
};

const shapeChange = (event, shapeMesh) => {
    if (event.currentTarget.checked) {
        scene.add(shapeMesh);
    }else{
        scene.remove(shapeMesh);
    }
    render();
    requestAnimationFrame(doFrame);
}

// make it load

window.addEventListener("load", init, false);
