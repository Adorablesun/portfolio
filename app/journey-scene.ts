import * as THREE from 'three';

export type JourneySceneController = {
  setProgress: (progress: number, visible: boolean) => void;
  dispose: () => void;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** A transparent WebGL journey driven by the SVG route's scroll progress. */
export function createJourneyScene(
  host: HTMLDivElement,
): JourneySceneController {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf8f9fb, 0.055);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);

  const points = Array.from({ length: 8 }, (_, index) => {
    const t = index / 7;
    const direction = index % 2 ? 1 : -1;
    return new THREE.Vector3(
      direction * (1.25 + (index % 3) * 0.16),
      7.7 - t * 15.4,
      Math.sin(index * 1.7) * 0.75,
    );
  });
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.48);

  const routeGeometry = new THREE.TubeGeometry(curve, 180, 0.018, 6, false);
  const routeMaterial = new THREE.MeshBasicMaterial({
    color: 0x5875f2,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(routeGeometry, routeMaterial));

  const gateGeometry = new THREE.TorusGeometry(0.62, 0.018, 8, 72);
  const gates = points.map((point, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: index < 4 ? 0x2448df : 0x8270ea,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const gate = new THREE.Mesh(gateGeometry, material);
    gate.position.copy(point);
    gate.rotation.set(Math.PI / 2.45, index * 0.46, index % 2 ? 0.34 : -0.34);
    scene.add(gate);
    return { gate, material };
  });

  const traveller = new THREE.Group();
  const coreGeometry = new THREE.IcosahedronGeometry(0.27, 1);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8aa1ff,
    emissive: 0x142a9a,
    emissiveIntensity: 0.8,
    metalness: 0.72,
    roughness: 0.18,
    clearcoat: 1,
    transparent: true,
    opacity: 0.88,
  });
  traveller.add(new THREE.Mesh(coreGeometry, coreMaterial));

  const orbitGeometry = new THREE.TorusGeometry(0.45, 0.012, 6, 64);
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x2448df,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = 1.05;
  traveller.add(orbit);
  scene.add(traveller);

  const particlePositions = new Float32Array(110 * 3);
  for (let index = 0; index < 110; index++) {
    const point = curve.getPoint(index / 109);
    const angle = index * 2.399963;
    const radius = 0.65 + (index % 9) * 0.12;
    particlePositions[index * 3] = point.x + Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = point.y + Math.sin(angle) * radius;
    particlePositions[index * 3 + 2] = point.z + ((index % 7) - 3) * 0.18;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x667ff0,
    size: 0.025,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  scene.add(new THREE.HemisphereLight(0xeaf0ff, 0x5c4ea0, 2.4));
  const keyLight = new THREE.PointLight(0x6e8cff, 15, 9);
  keyLight.position.set(1.8, 1.8, 4);
  scene.add(keyLight);

  let targetProgress = 0;
  let progress = 0;
  let isVisible = false;
  let frame = 0;
  let disposed = false;
  let previousTime = performance.now();
  const blue = new THREE.Color(0x2448df);
  const violet = new THREE.Color(0x8270ea);
  const travelPoint = new THREE.Vector3();
  const cameraTarget = new THREE.Vector3();

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const render = (time: number) => {
    frame = 0;
    if (disposed || !isVisible) return;
    const delta = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    progress += (targetProgress - progress) * Math.min(1, delta * 7.5);
    curve.getPointAt(progress, travelPoint);
    traveller.position.copy(travelPoint);

    const active = progress * 7;
    const activeIndex = Math.round(active);
    const pulse = 1 + Math.sin(time * 0.006) * 0.08;
    traveller.scale.setScalar(pulse);
    traveller.rotation.x = time * 0.00042 + progress * Math.PI * 1.6;
    traveller.rotation.y = time * 0.00068 + progress * Math.PI * 3;
    orbit.rotation.z = time * -0.00072;

    const colour = blue.clone().lerp(violet, progress);
    coreMaterial.color.copy(colour).offsetHSL(0, -0.08, 0.16);
    coreMaterial.emissive.copy(colour).multiplyScalar(0.32);
    orbitMaterial.color.copy(colour);
    keyLight.color.copy(colour);
    keyLight.position.set(
      travelPoint.x + 1.3,
      travelPoint.y + 1.1,
      travelPoint.z + 3,
    );

    gates.forEach(({ gate, material }, index) => {
      const closeness = Math.max(0, 1 - Math.abs(active - index));
      const reached = index <= activeIndex;
      gate.scale.setScalar(
        1 + closeness * (0.2 + Math.sin(time * 0.005) * 0.08),
      );
      gate.rotation.z += delta * (reached ? 0.24 : 0.08) * (index % 2 ? -1 : 1);
      material.opacity = 0.08 + closeness * 0.52 + (reached ? 0.06 : 0);
    });

    camera.position.set(travelPoint.x * 0.22, travelPoint.y + 0.1, 7.6);
    cameraTarget.set(travelPoint.x * 0.44, travelPoint.y, travelPoint.z);
    camera.lookAt(cameraTarget);
    particles.rotation.y = progress * 0.3;
    renderer.render(scene, camera);
    host.dataset.ready = 'true';
    frame = requestAnimationFrame(render);
  };

  const contextLost = (event: Event) => {
    event.preventDefault();
    isVisible = false;
    cancelAnimationFrame(frame);
    frame = 0;
    delete host.dataset.ready;
    host.dataset.fallback = 'true';
  };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  host.appendChild(renderer.domElement);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  return {
    setProgress(nextProgress, visible) {
      targetProgress = clamp01(nextProgress);
      isVisible = visible;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(render);
      }
    },
    dispose() {
      disposed = true;
      isVisible = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      routeGeometry.dispose();
      routeMaterial.dispose();
      gateGeometry.dispose();
      gates.forEach(({ material }) => material.dispose());
      coreGeometry.dispose();
      coreMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      delete host.dataset.ready;
    },
  };
}
