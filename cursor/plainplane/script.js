let scene, camera, renderer, ground, sky;
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};
let raindrops = [];
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.7, 0); // Set camera at average human height

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brown color
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    scene.add(ground);

    // Create sky
    const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide }); // Sky blue color
    sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Create rain
    createRain();

    // Add scattered objects
    addScatteredObjects();

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mouseup', onMouseUp, false);

    // Add new event listeners for keyboard
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    // Start animation loop
    animate();
}

function createRain() {
    const rainGeometry = new THREE.BufferGeometry();
    const rainVertices = [];

    for (let i = 0; i < 15000; i++) {
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        const z = Math.random() * 200 - 100;
        rainVertices.push(x, y, z);
    }

    rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));

    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);
    raindrops.push(rain);
}

function animateRain() {
    for (let rain of raindrops) {
        rain.rotation.y += 0.002;
        const positions = rain.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.1 + Math.random() * 0.1;
            if (positions[i] < -100) {
                positions[i] = 100;
            }
        }
        rain.geometry.attributes.position.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Handle movement
    updateMovement();
    
    animateRain();
    renderer.render(scene, camera);
}

function updateMovement() {
    velocity.x -= velocity.x * 10.0 * 0.016;
    velocity.z -= velocity.z * 10.0 * 0.016;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * 0.016;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * 0.016;

    camera.translateX(-velocity.x * 0.016);
    camera.translateZ(-velocity.z * 0.016);

    // Keep the camera at a constant height
    camera.position.y = 1.7;
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {
    isDragging = true;
}

function onMouseMove(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        camera.rotation.y -= deltaMove.x * 0.01;
        camera.rotation.x -= deltaMove.y * 0.01;

        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp(event) {
    isDragging = false;
}

function addScatteredObjects() {
    // Add trees
    const treeGeometry = new THREE.ConeGeometry(0.5, 2, 8);
    const treeMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); // Forest green

    for (let i = 0; i < 50; i++) {
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);
        tree.position.set(
            Math.random() * 80 - 40,
            1, // Half the height of the tree
            Math.random() * 80 - 40
        );
        scene.add(tree);
    }

    // Add rocks
    const rockGeometry = new THREE.DodecahedronGeometry(0.5);
    const rockMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Gray

    for (let i = 0; i < 30; i++) {
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(
            Math.random() * 80 - 40,
            0.25, // Half the size of the rock
            Math.random() * 80 - 40
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        scene.add(rock);
    }
}

init();
