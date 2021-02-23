import * as THREE from "three";
import { BufferGeometry } from "three";
import "./modal"; //for the modal menu

("use strict");

let scene, camera, renderer; // Three.js rendering basics.

let canvas; // The canvas on which the image is rendered.

let animating = false; // This is set to true when an animation is running.

let frame = 0; //Do stuff based on frame
let deleted = 0; //just for debugging 

let obstacles = [];

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
    const viewpointLight = new THREE.DirectionalLight(0xffffff, 0.8); // a light to shine in the direction the camera faces
    viewpointLight.position.set(0, 0, 1); // shines down the z-axis
    scene.add(viewpointLight);

    //scene.add();
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
    //////////////////// Create some stuff //////////////////////

    for (let i = 0; i < Math.log2(frame); i++) {
        obstacles.push(
            getSquare(getRandFunction(-200, 200), getRandFunction(-200, 200))
        );
    }

    //////////////////// Add the stuff to scene //////////////////////
    obstacles.forEach((obj) => {
        scene.add(obj);
    });

    obstacles.forEach((obj) => {
        obj.rotation.x += 0.05;
        obj.rotation.y += 0.05;
        obj.rotation.z += 0.05;
        obj.position.z += 5;
    });

    obstacles = obstacles.filter((obj) => {
        const withinZ = obj.position.z < 450;

        camera.updateMatrix();
        camera.updateMatrixWorld();
        var frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(
            new THREE.Matrix4().multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            )
        );
        if (frustum.containsPoint(obj) && withinZ) {
            return obj;
        } else {
            dispose3(obj);
            console.log(`objects: ${obstacles.length}, deleted: ${++deleted}`);
        }
    });
};

//--------------------------- animation support -----------------------------------

/* This function runs the animation by calling updateForFrame() then calling render().
 * Finally, it arranges for itself to be called again to do the next frame.  When the
 * value of animating is set to false, this function does not schedule the next frame,
 * so the animation stops.
 */
const doFrame = () => {
    if (animating) {
        setTimeout(() => {
            updateForFrame();
            render();
            requestAnimationFrame(doFrame);
            frame++;
        }, 10);
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
    console.log(`${event.key} = ${event.code}`);
    let rotated = true;
    switch (code) {
        case 37:
            cube.rotation.y -= 0.03;
            break; // left arrow
        case 39:
            cube.rotation.y += 0.03;
            break; // right arrow
        case 38:
            cube.rotation.x -= 0.03;
            break; // up arrow
        case 40:
            cube.rotation.x += 0.03;
            break; // down arrow
        case 33:
            cube.rotation.z -= 0.03;
            break; // page up
        case 34:
            cube.rotation.z += 0.03;
            break; // page down
        case 36:
            cube.rotation.set(0.2, 0, 0);
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

/**
 * Produces a pseudo anaglyph cube
 * @param {*} x horizontal
 * @param {*} y vertical
 */
const getSquare = (x, y) => {
    const weirdSquare = new THREE.Object3D();
    // Make a cube.
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Make a material
    const whiteMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });

    const redMaterial = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true,
    });

    const blueMaterial = new THREE.MeshBasicMaterial({
        color: "cyan",
        wireframe: true,
    });

    // Create a mesh based on the geometry and material
    const whiteMesh = new THREE.Mesh(geometry, whiteMaterial);
    const redMesh = new THREE.Mesh(geometry, redMaterial);
    const blueMesh = new THREE.Mesh(geometry, blueMaterial);

    redMesh.position.x -= 0.1;
    redMesh.position.y += 0.1;
    blueMesh.position.x += 0.1;
    blueMesh.position.y -= 0.1;

    weirdSquare.add(whiteMesh);
    weirdSquare.add(redMesh);
    weirdSquare.add(blueMesh);

    weirdSquare.position.x = x;
    weirdSquare.position.y = y;

    return weirdSquare;
};

/**
 * A way to set a range for random numbers
 * @param {*} min minimum number, can be negative
 * @param {*} max max number
 */
const getRandFunction = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min;

/**
 * Disposes the object from the scene
 * @param {*}  obj to remove
 */
const dispose3 = (obj) => {
    let children = obj.children;
    let child;

    if (children) {
        for (let i = 0; i < children.length; i += 1) {
            child = children[i];

            dispose3(child);
        }
    }

    let geometry = obj.geometry;
    let material = obj.material;

    if (geometry) {
        geometry.dispose();
    }

    if (material) {
        let texture = material.map;

        if (texture) {
            texture.dispose();
        }

        material.dispose();
    }
};

window.addEventListener("load", init, false);
