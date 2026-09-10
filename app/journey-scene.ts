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

  const gateGeometry = new THREE.TorusGeometry(0.36, 0.006, 6, 48);
  const gates = points.map((point, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: index < 4 ? 0x2448df : 0x8270ea,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    });
    const gate = new THREE.Mesh(gateGeometry, material);
    gate.position.copy(point);
    gate.rotation.set(Math.PI / 2.45, index * 0.46, index % 2 ? 0.34 : -0.34);
    scene.add(gate);
    return { gate, material };
  });

  const traveller = new THREE.Group();
  const signalGeometry = new THREE.SphereGeometry(0.065, 20, 14);
  const signalMaterial = new THREE.MeshBasicMaterial({ color: 0x8aa1ff });
  traveller.add(new THREE.Mesh(signalGeometry, signalMaterial));

  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 64;
  glowCanvas.height = 64;
  const glowContext = glowCanvas.getContext('2d');
  if (glowContext) {
    const gradient = glowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.16, 'rgba(180,202,255,.85)');
    gradient.addColorStop(0.48, 'rgba(88,117,242,.24)');
    gradient.addColorStop(1, 'rgba(88,117,242,0)');
    glowContext.fillStyle = gradient;
    glowContext.fillRect(0, 0, 64, 64);
  }
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0x8aa1ff,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(0.85, 0.85, 1);
  traveller.add(glow);

  const trailSampleCount = 42;
  const trailSpan = 0.13;
  const trailMaterials: THREE.LineBasicMaterial[] = [];
  const trailLines = [-0.12, 0, 0.12].map((offset, index) => {
    const positions = new Float32Array(trailSampleCount * 3);
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positionAttribute);
    const material = new THREE.LineBasicMaterial({
      color: index === 1 ? 0x6f8cff : 0x9aaeff,
      transparent: true,
      opacity: index === 1 ? 0.5 : 0.24,
      depthWrite: false,
    });
    const line = new THREE.Line(geometry, material);
    line.frustumCulled = false;
    trailMaterials.push(material);
    scene.add(line);
    return { geometry, offset, positionAttribute, positions };
  });
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
    size: 0.018,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  let targetProgress = 0;
  let progress = 0;
  let isVisible = false;
  let frame = 0;
  let disposed = false;
  let previousTime = performance.now();
  const blue = new THREE.Color(0x2448df);
  const violet = new THREE.Color(0x8270ea);
  const travelPoint = new THREE.Vector3();
  const travelTangent = new THREE.Vector3();
  const trailPoint = new THREE.Vector3();
  const trailNormal = new THREE.Vector3();
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
    const pulse = 1 + Math.sin(time * 0.004) * 0.035;
    traveller.scale.setScalar(pulse);

    trailLines.forEach(
      ({ offset, positionAttribute, positions }, lineIndex) => {
        for (let sample = 0; sample < trailSampleCount; sample++) {
          const ratio = sample / (trailSampleCount - 1);
          const sampleProgress = Math.max(
            0,
            progress - trailSpan * (1 - ratio),
          );
          curve.getPointAt(sampleProgress, trailPoint);
          curve.getTangentAt(sampleProgress, travelTangent);
          trailNormal.set(-travelTangent.y, travelTangent.x, 0).normalize();
          const spread = Math.sin(ratio * Math.PI) * offset;
          trailPoint.addScaledVector(trailNormal, spread);
          trailPoint.z +=
            offset * Math.sin(ratio * Math.PI * 2 + lineIndex * 0.8) * 0.45;
          const writeIndex = sample * 3;
          positions[writeIndex] = trailPoint.x;
          positions[writeIndex + 1] = trailPoint.y;
          positions[writeIndex + 2] = trailPoint.z;
        }
        positionAttribute.needsUpdate = true;
      },
    );

    const colour = blue.clone().lerp(violet, progress);
    signalMaterial.color.copy(colour).offsetHSL(0, -0.08, 0.2);
    glowMaterial.color.copy(colour).offsetHSL(0, -0.15, 0.18);
    trailMaterials.forEach((material, index) => {
      material.color
        .copy(colour)
        .offsetHSL(0, -0.08, index === 1 ? 0.16 : 0.26);
    });

    gates.forEach(({ gate, material }, index) => {
      const closeness = Math.max(0, 1 - Math.abs(active - index));
      const reached = index <= activeIndex;
      gate.scale.setScalar(1 + closeness * 0.12);
      gate.rotation.z += delta * (reached ? 0.1 : 0.035) * (index % 2 ? -1 : 1);
      material.opacity = 0.025 + closeness * 0.16 + (reached ? 0.025 : 0);
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
      signalGeometry.dispose();
      signalMaterial.dispose();
      glowMaterial.dispose();
      glowTexture.dispose();
      trailLines.forEach(({ geometry }) => geometry.dispose());
      trailMaterials.forEach((material) => material.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      delete host.dataset.ready;
    },
  };
}
