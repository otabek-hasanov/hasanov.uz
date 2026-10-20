import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  EllipseCurve,
  Euler,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

function dbSvg() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/><path d="M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/></svg>';
}

const ICONS = {
  php: { bg: '#777BB4', label: 'php' },
  javascript: { bg: '#F7DF1E', label: 'JS', dark: true },
  nodejs: {
    bg: '#339933',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2l8 4.6v10.8L12 22l-8-4.6V6.6z"/></svg>',
  },
  react: {
    bg: '#0b1120',
    svg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" stroke-width="1.2"><circle cx="12" cy="12" r="1.6" fill="#61DAFB"/>' +
      '<ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/>' +
      '<ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/></svg>',
  },
  tailwind: {
    bg: '#0b1120',
    svg:
      '<svg viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 5c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.36C13.46 9.9 14.68 11 17 11c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.36C15.54 6.1 14.33 5 12 5zM7 11c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.36C8.46 15.9 9.68 17 12 17c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.36C10.54 12.1 9.33 11 7 11z"/></svg>',
  },
  mysql: { bg: '#4479A1', svg: dbSvg() },
  postgresql: { bg: '#336791', svg: dbSvg() },
  mongodb: {
    bg: '#47A248',
    svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2c3 3.5 6 7.2 6 11.2A6 6 0 0 1 6 13.2C6 9.2 9 5.5 12 2z"/></svg>',
  },
  redis: {
    bg: '#DC382D',
    svg:
      '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2l8 3.6-8 3.6-8-3.6L12 2zm-8 7.4 8 3.6 8-3.6v3.2l-8 3.6-8-3.6V9.4zm0 6 8 3.6 8-3.6v3.2l-8 3.6-8-3.6v-3.2z"/></svg>',
  },
  git: {
    bg: '#F05032',
    svg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="6" r="2"/>' +
      '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 8v8M6 8c0 5 5 1 8 1"/></svg>',
  },
  telegram: {
    bg: '#26A5E4',
    svg:
      '<svg viewBox="0 0 24 24" fill="#fff"><path d="M21.5 3.5 2.3 11.1c-.9.35-.9 1.65.02 1.98l4.46 1.58 1.73 5.4c.28.87 1.4 1.1 2 .42l2.5-2.8 4.56 3.38c.76.56 1.85.14 2.04-.79l3.3-15.3c.2-.95-.76-1.7-1.6-1.47zM8.3 13.6l9.4-6.9-7.6 8.2z"/></svg>',
  },
  payments: {
    bg: '#7C3AED',
    svg:
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="2.5" y="5.5" width="19" height="13" rx="2.2"/>' +
      '<path d="M2.5 9.5h19" stroke-width="2.2"/><path d="M6 14.5h5" stroke-linecap="round"/></svg>',
  },
};

function createHologram(container, skills) {
  const isMobile = window.innerWidth < 768;

  let width = container.clientWidth;
  let height = container.clientHeight;
  if (!width || !height) return null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  const renderer = new WebGLRenderer({ alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(width, height);
  renderer.domElement.className = 'absolute inset-0 h-full w-full';
  container.appendChild(renderer.domElement);

  const disposables = [];
  const track = (mesh) => {
    disposables.push(mesh.geometry, mesh.material);
    return mesh;
  };

  const outerGlow = track(
    new Mesh(new IcosahedronGeometry(1.7, 1), new MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.12, blending: AdditiveBlending }))
  );
  scene.add(outerGlow);

  const core = track(
    new Mesh(new IcosahedronGeometry(1.3, 2), new MeshBasicMaterial({ color: 0xf8fbff, transparent: true, opacity: 0.4, blending: AdditiveBlending }))
  );
  scene.add(core);

  const wire = track(
    new Mesh(new IcosahedronGeometry(1.345, 1), new MeshBasicMaterial({ color: 0xe0f7ff, wireframe: true, transparent: true, opacity: 0.9 }))
  );
  scene.add(wire);

  const ringColors = [0x60a5fa, 0x22d3ee, 0xffffff];
  const ringTilts = [
    { x: 0.35, y: 0.1, z: 0.1 },
    { x: -0.25, y: 0.6, z: 0.2 },
    { x: 0.15, y: -0.5, z: -0.15 },
  ];
  const ringRadii = [2.0, 2.5, 2.9];
  const rings = ringRadii.map((radius, i) => {
    const curve = new EllipseCurve(0, 0, radius, radius * 0.92, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(80).map((p) => new Vector3(p.x, p.y, 0));
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: ringColors[i % ringColors.length], transparent: true, opacity: 0.7 });
    disposables.push(geometry, material);
    const mesh = new LineLoop(geometry, material);
    const tilt = ringTilts[i];
    mesh.rotation.set(tilt.x, tilt.y, tilt.z);
    scene.add(mesh);
    return { mesh, radius, quat: new Quaternion().setFromEuler(new Euler(tilt.x, tilt.y, tilt.z)) };
  });

  const starCount = isMobile ? 140 : 320;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 5 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute('position', new BufferAttribute(starPositions, 3));
  const starMat = new PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.8 });
  disposables.push(starGeo, starMat);
  const stars = new Points(starGeo, starMat);
  scene.add(stars);

  const badgeWrap = document.createElement('div');
  badgeWrap.className = 'pointer-events-none absolute inset-0';
  container.appendChild(badgeWrap);

  const badgeSkills = skills.slice(0, isMobile ? 6 : 9);
  const badges = badgeSkills.map((skill, i) => {
    const def = ICONS[skill.icon] || { bg: '#64748b', label: '?' };

    const el = document.createElement('div');
    el.className =
      'absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-white/30 bg-ink-900/60 py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md backdrop-saturate-150';

    const iconEl = document.createElement('span');
    iconEl.className = 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold';
    iconEl.style.background = def.bg;
    iconEl.style.color = def.dark ? '#1a1a1a' : '#fff';
    if (def.svg) {
      iconEl.innerHTML = def.svg;
      const svgEl = iconEl.querySelector('svg');
      if (svgEl) svgEl.style.cssText = 'width:62%;height:62%';
    } else {
      iconEl.textContent = def.label;
    }

    const labelEl = document.createElement('span');
    labelEl.textContent = skill.name;

    el.appendChild(iconEl);
    el.appendChild(labelEl);
    badgeWrap.appendChild(el);

    return {
      el,
      ring: rings[i % rings.length],
      angle: (i / badgeSkills.length) * Math.PI * 2,
      speed: 0.09 + (i % 3) * 0.015,
    };
  });

  const vector = new Vector3();
  let frameId = null;
  let running = false;
  const clock = new Clock();
  let mouseX = 0;
  let mouseY = 0;

  function onPointerMove(e) {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }
  if (!isMobile) {
    container.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  function animate() {
    if (!running) return;
    const elapsed = clock.getElapsedTime();

    core.rotation.y = elapsed * 0.08;
    wire.rotation.y = -elapsed * 0.06;
    wire.rotation.x = elapsed * 0.03;
    stars.rotation.y = elapsed * 0.012;

    const breath = 1 + Math.sin(elapsed * 0.6) * 0.035;
    core.scale.setScalar(breath);
    wire.scale.setScalar(breath);
    outerGlow.scale.setScalar(1 + Math.sin(elapsed * 0.6 + 0.6) * 0.06);
    outerGlow.material.opacity = 0.08 + Math.sin(elapsed * 0.5) * 0.03;
    stars.material.opacity = 0.75 + Math.sin(elapsed * 0.8) * 0.1;

    scene.rotation.y += (mouseX * 0.15 - scene.rotation.y) * 0.04;
    scene.rotation.x += (-mouseY * 0.1 - scene.rotation.x) * 0.04;

    badges.forEach((badge) => {
      badge.angle += badge.speed * 0.016;
      vector.set(Math.cos(badge.angle) * badge.ring.radius, Math.sin(badge.angle) * badge.ring.radius * 0.92, 0);
      vector.applyQuaternion(badge.ring.quat);
      vector.applyEuler(scene.rotation);
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * width;
      const y = (-vector.y * 0.5 + 0.5) * height;
      badge.el.style.transform = 'translate(-50%, -50%)';
      badge.el.style.left = x + 'px';
      badge.el.style.top = y + 'px';
      badge.el.style.opacity = vector.z > 0.75 ? '0.55' : '1';
      badge.el.style.zIndex = String(Math.round((1 - vector.z) * 100));
    });

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  }

  function start() {
    if (frameId) return;
    running = true;
    frameId = requestAnimationFrame(animate);
  }
  function stop() {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = null;
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else start();
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (entry.isIntersecting ? start() : stop())),
      { threshold: 0.05 }
    );
    io.observe(container);
  } else {
    start();
  }

  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }, 200);
  }
  window.addEventListener('resize', onResize, { passive: true });

  container.classList.add('is-ready');

  return {
    destroy() {
      stop();
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (!isMobile) container.removeEventListener('pointermove', onPointerMove);
      if (io) io.disconnect();
      disposables.forEach((d) => d && d.dispose && d.dispose());
      renderer.dispose();
      container.innerHTML = '';
    },
  };
}

export default function Hologram({ skills }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !skills || skills.length === 0) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let instance = null;
    let cancelled = false;

    const boot = () => {
      if (cancelled || !containerRef.current) return;
      instance = createHologram(containerRef.current, skills);
    };

    const idleId =
      'requestIdleCallback' in window ? requestIdleCallback(boot, { timeout: 1500 }) : setTimeout(boot, 250);

    return () => {
      cancelled = true;
      if ('cancelIdleCallback' in window) cancelIdleCallback(idleId);
      else clearTimeout(idleId);
      if (instance) instance.destroy();
    };
  }, [skills]);

  return (
    <div
      id="hologram"
      ref={containerRef}
      className="reveal relative mx-auto h-72 w-72 sm:h-96 sm:w-96 lg:h-[26rem] lg:w-[26rem]"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/25 via-ice-400/15 to-transparent blur-2xl animate-float-slow" />
      <div className="absolute inset-[18%] rounded-full border border-brand-400/30" />
      <div className="absolute inset-[30%] rounded-full bg-white/10 backdrop-blur-sm" />
    </div>
  );
}
