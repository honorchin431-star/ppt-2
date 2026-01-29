// 确保 Three.js 已加载
window.addEventListener('load', init);

function init() {
    const container = document.getElementById('canvas-container');
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xe6f0ff, 0.8);
    pointLight.position.set(-10, -10, 5);
    scene.add(pointLight);

    const objects = [];
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.TetrahedronGeometry(1),
        new THREE.OctahedronGeometry(1),
        new THREE.IcosahedronGeometry(1)
    ];

    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.1,
        side: THREE.DoubleSide
    });

    const objectCount = 20;
    for (let i = 0; i < objectCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (Math.random() - 0.5) * 30;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 10 - 5;

        const scale = Math.random() * 1.5 + 0.5;
        mesh.scale.set(scale, scale, scale);

        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.005 + 0.002,
            floatOffset: Math.random() * Math.PI * 2
        };

        scene.add(mesh);
        objects.push(mesh);
    }

    function animate(time) {
        requestAnimationFrame(animate);

        objects.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;

            mesh.position.y += Math.sin(time * 0.001 + mesh.userData.floatOffset) * mesh.userData.floatSpeed;
        });

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate(0);

    const progressBar = document.querySelector('#reading-progress .progress-bar');
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
        progressBar.style.width = pct + '%';
    });

    const tocLinks = document.querySelectorAll('.toc a');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const parallaxItems = Array.from(document.querySelectorAll('.parallax-media'));
    const textCards = Array.from(document.querySelectorAll('.mag-hero .text-card, .mag-section .text-card'));
    let ticking = false;

    function updateParallax() {
        parallaxItems.forEach(el => {
            el.style.transform = 'none';
        });
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target.closest('.mag-hero, .mag-section');
            const card = section ? section.querySelector('.text-card') : null;
            if (entry.isIntersecting && card) {
                card.classList.add('appear');
            }
        });
    }, { threshold: 0.25 });

    parallaxItems.forEach(img => io.observe(img));

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('load', updateParallax);
}
