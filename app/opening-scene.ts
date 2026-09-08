import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** Short-lived, pointer-responsive sculpture. All GPU resources are released on exit. */
export function createOpeningScene(host: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 600 ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.z = 9;
  const environment = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environmentMap = generator.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  generator.dispose();

  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const geometry = new THREE.TorusKnotGeometry(1.22, 0.35, 160, 24, 2, 3);
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xc9dbb1, metalness: 1, roughness: 0.18, clearcoat: 1,
    clearcoatRoughness: 0.1, envMapIntensity: 2.2,
  });
  const knot = new THREE.Mesh(geometry, metal);
  sculpture.add(knot);

  const ringGeometry = new THREE.TorusGeometry(2.13, 0.011, 6, 160);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xd9f96a, transparent: true, opacity: 0.58 });
  const rings = Array.from({ length: 3 }, (_, i) => {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.set(Math.PI * (0.25 + i * 0.19), i * 0.7, i * 0.6);
    sculpture.add(ring);
    return ring;
  });
  const light = new THREE.DirectionalLight(0xdfff7e, 5);
  light.position.set(3, 4, 2);
  scene.add(light);
  const blue = new THREE.DirectionalLight(0x5373ff, 8);
  blue.position.set(-4, -1, 2);
  scene.add(blue);

  const positions = new Float32Array(120 * 3);
  for (let i = 0; i < 120; i++) {
    // Deterministic distribution, so replay doesn't change the composition.
    const angle = i * 2.399963;
    const radius = 3.1 + (i % 17) / 5;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (i % 13) * 0.4 - 3;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: 0xd9f96a, size: 0.016, transparent: true, opacity: 0.65 });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let disposed = false;
  const start = performance.now();
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  const move = (event: PointerEvent) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    delete host.dataset.ready;
    host.dataset.fallback = 'true';
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  host.appendChild(renderer.domElement);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  window.addEventListener('pointermove', move, { passive: true });
  resize();
  const draw = () => {
    if (disposed) return;
    const t = (performance.now() - start) / 1000;
    const entry = 1 - Math.pow(1 - Math.min(t / 1.3, 1), 3);
    const scale = window.innerWidth < 600 ? 0.72 : 1;
    sculpture.scale.setScalar((0.35 + entry * 0.65) * scale);
    sculpture.rotation.y = t * 0.68 + pointerX * 0.65;
    sculpture.rotation.x = Math.sin(t * 0.5) * 0.35 + pointerY * 0.35;
    sculpture.rotation.z = -0.2 + t * 0.09;
    knot.rotation.z = t * -0.2;
    rings.forEach((ring, i) => { ring.rotation.z = t * (i % 2 ? -0.28 : 0.28) + i; });
    particles.rotation.z = t * 0.055;
    renderer.render(scene, camera);
    host.dataset.ready = 'true';
    frame = requestAnimationFrame(draw);
  };
  draw();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('pointermove', move);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    geometry.dispose();
    ringGeometry.dispose();
    particleGeometry.dispose();
    metal.dispose();
    ringMaterial.dispose();
    particleMaterial.dispose();
    environmentMap.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    delete host.dataset.ready;
  };
}
