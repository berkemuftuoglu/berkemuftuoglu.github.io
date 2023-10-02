let scene, camera, renderer, carousel;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    let containerWidth = document.querySelector('#resume .container .section-title').offsetWidth;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    document.querySelector('#skills .container .section-title').appendChild(renderer.domElement);

    carousel = new THREE.Group();
    let imageUrls = [
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg',
        // ... (other SVG URLs)
    ];
    
    let geometry = new THREE.PlaneGeometry(2, 2);

    let radius = 5;
    let angleIncrement = Math.PI * 2 / imageUrls.length;

    for (let i = 0; i < imageUrls.length; i++) {
        let texture = new THREE.TextureLoader().load(imageUrls[i]);
        let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

        let plane = new THREE.Mesh(geometry, material);
        let angle = angleIncrement * i;
        plane.position.x = Math.cos(angle) * radius;
        plane.position.z = Math.sin(angle) * radius;
        plane.lookAt(camera.position);
        carousel.add(plane);
    }
    
    scene.add(carousel);
    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        carousel.rotation.y += 0.01;
        carousel.children.forEach(plane => {
            plane.lookAt(camera.position);
        });
        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener('resize', function() {
    let containerWidth = document.querySelector('#resume .container .section-title').offsetWidth;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = containerWidth / 300;
    camera.updateProjectionMatrix();
});

window.onload = init;
