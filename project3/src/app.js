import * as THREE from "three";

class App {
    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.camera = new THREE.PerspectiveCamera(70,
            window.innerWidth / window.innerHeight, 1,1000);

        this.camera.position.z = 400;
        this.renderer.setSize((window.innerWidth, window.innerHeight));

        this.scene.add(getModel());
        this.scene.add(addLights());


        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", () => this.onWindowResize() );

        this.animate();
    }
    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight)
        console.log(`Resizing to ${window.innerWidth} / ${window.innerHeight}`);
    }
    animate() {
        requestAnimationFrame(()=> {
            this.doAnimate()
        });
        this.renderer.render(this.scene, this.camera)
    }
    doAnimate(){
        //Do the animation stuff
        console.log("Hello?");
    }
}

const addLights = () => {
    const dLight = new THREE.DirectionalLight(0xff0000, 0.7);
    dLight.position.set(1,0,0);
    return dLight;
}
const getModel = () => {
    const model = new THREE.Object3D()
    const geometry = new THREE.TorusGeometry( 5, 1, 8, 50 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    model.add( new THREE.Mesh( geometry, material ));
    return model;
}




export { App as default}
