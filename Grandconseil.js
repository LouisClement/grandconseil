import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Position au centre du dôme

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Charger la texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('grandconseil.png', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1; // Inverser l'image pour un rendu correct
        
        // Créer la demi-sphère
        const geometry = new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const dome = new THREE.Mesh(geometry, material);
        scene.add(dome);
    });

    // Contrôles pour la navigation
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.3;
    
    // Gyroscope pour mobile
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;
            const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0;
            camera.rotation.x = beta;
            camera.rotation.y = gamma;
        });
    }

    window.addEventListener('resize', onWindowResize);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
