class GameEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        this.objects = [];
        this.platforms = [];
        this.camera.position.z = 5;
        this.camera.position.y = 1;
        
        this.speed = 0.1;
    }

    addObject(object) {
        this.scene.add(object.mesh);
        this.objects.push(object);
    }

    addPlatform(platform) {
        this.scene.add(platform.mesh);
        this.platforms.push(platform);
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
        
        // Move the platforms to create an endless scrolling effect
        this.platforms.forEach(platform => {
            platform.mesh.position.z += this.speed;
            if (platform.mesh.position.z > this.camera.position.z) {
                platform.mesh.position.z -= 50; // Reset platform position
            }
        });

        // Update the camera to follow the player
        this.camera.position.z += this.speed;
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
        // Placeholder for object-specific logic
    }
}

class Player extends GameObject {
    constructor(mesh) {
        super(mesh);
        this.jumpSpeed = 0.2;
        this.gravity = 0.01;
        this.isJumping = false;
        this.velocityY = 0;
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = this.jumpSpeed;
        }
    }

    update() {
        if (this.isJumping) {
            this.mesh.position.y += this.velocityY;
            this.velocityY -= this.gravity;
            if (this.mesh.position.y <= 1) {
                this.mesh.position.y = 1;
                this.isJumping = false;
                this.velocityY = 0;
            }
        }
    }
}

class Platform extends GameObject {
    constructor(mesh) {
        super(mesh);
    }
}

// Initialize the game engine
const engine = new GameEngine();

// Create the player
const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
const player = new Player(playerMesh);

engine.addObject(player);

// Create platforms
const platformGeometry = new THREE.BoxGeometry(3, 0.2, 10);
const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
for (let i = 0; i < 5; i++) {
    const platformMesh = new THREE.Mesh(platformGeometry, platformMaterial);
    platformMesh.position.z = -i * 10;
    platformMesh.position.y = 0;
    const platform = new Platform(platformMesh);
    engine.addPlatform(platform);
}

// Start the game engine
engine.start();

// Handle player jump input
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        player.jump();
    }
});
