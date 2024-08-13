class GameEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        this.objects = []; // Array to store all game objects

        this.camera.position.z = 5;
    }

    addObject(object) {
        this.scene.add(object.mesh);
        this.objects.push(object);
    }

    removeObject(object) {
        this.scene.remove(object.mesh);
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
            this.render();
        };
        animate();
    }

    update() {
        for (let object of this.objects) {
            if (typeof object.update === 'function') {
                object.update();
            }
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

class GameObject {
    constructor(mesh) {
        this.mesh = mesh;
    }

    update() {
        // Logic for updating the object each frame
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    }
}

// Initialize the game engine
const engine = new GameEngine();

// Create a cube and add it to the game engine
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
const gameObject = new GameObject(cube);

engine.addObject(gameObject);
engine.start();
