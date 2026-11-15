/**
 * Background Visuals:
 * 1. Full-screen 2D Canvas: Twinkling stars + diagonal shooting meteors with glowing fading tails.
 * 2. Three.js WebGL Layer: 3D depth star particles & subtle electric-blue wireframe orbital geometry.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener('pointermove', function (e) {
    pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ------------------------------------------------------------------------
     1. 2D Starfield & Shooting Stars Canvas
     ------------------------------------------------------------------------ */
  function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let meteors = [];
    let nextMeteorAt = performance.now() + 1800;

    function buildStars() {
      const count = Math.min(240, Math.max(95, Math.floor((width * height) / 7200)));
      stars = [];
      for (let i = 0; i < count; i++) {
        const isBlueTint = Math.random() > 0.68;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.45 + 0.35,
          depth: Math.random() * 0.85 + 0.15,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.022 + 0.008,
          alphaBase: Math.random() * 0.55 + 0.25,
          color: isBlueTint ? '96, 165, 250' : '241, 245, 249'
        });
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
    }

    function spawnMeteor() {
      const fromTop = Math.random() > 0.25;
      const startX = fromTop ? width * (0.2 + Math.random() * 0.78) : width * 0.96;
      const startY = fromTop ? -20 : height * (0.05 + Math.random() * 0.4);
      const angle = Math.PI * (0.72 + Math.random() * 0.12); // Diagonal down-left
      const speed = 11 + Math.random() * 7;

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 120 + Math.random() * 110,
        life: 0,
        maxLife: 48 + Math.random() * 24,
        thickness: 1.5 + Math.random() * 1.1
      });
    }

    function render(now) {
      ctx.clearRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      // Draw twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) s.phase += s.speed;
        const twinkle = 0.5 + 0.5 * Math.sin(s.phase);
        const alpha = Math.min(1, s.alphaBase + twinkle * 0.45);
        const px = (s.x - pointer.x * 16 * s.depth + width) % width;
        const py = (s.y - pointer.y * 12 * s.depth + height) % height;

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + s.color + ', ' + alpha.toFixed(3) + ')';
        ctx.fill();

        if (s.r > 1.45 && twinkle > 0.85) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(59, 130, 246, ' + (alpha * 0.16).toFixed(3) + ')';
          ctx.fill();
        }
      }

      // Shooting stars
      if (!prefersReducedMotion) {
        if (now >= nextMeteorAt) {
          spawnMeteor();
          nextMeteorAt = now + 2400 + Math.random() * 3600;
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life += 1;

          const progress = m.life / m.maxLife;
          const opacity = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);

          const mag = Math.hypot(m.vx, m.vy) || 1;
          const tailX = m.x - (m.vx / mag) * m.length;
          const tailY = m.y - (m.vy / mag) * m.length;

          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, 'rgba(255, 255, 255, ' + (0.95 * opacity).toFixed(3) + ')');
          grad.addColorStop(0.28, 'rgba(96, 165, 250, ' + (0.75 * opacity).toFixed(3) + ')');
          grad.addColorStop(1, 'rgba(30, 64, 175, 0)');

          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = m.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Glowing head spark
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.thickness * 1.45, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(219, 234, 254, ' + (0.9 * opacity).toFixed(3) + ')';
          ctx.fill();

          if (m.life >= m.maxLife || m.x < -200 || m.y > height + 200) {
            meteors.splice(i, 1);
          }
        }
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(render);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(render);
  }

  /* ------------------------------------------------------------------------
     2. Three.js WebGL 3D Ambient Layer
     ------------------------------------------------------------------------ */
  function initWebGLBackground() {
    const canvas = document.getElementById('webgl-bg-canvas');
    if (!canvas || typeof window.THREE === 'undefined') return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      canvas.style.display = 'none';
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 11;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 3D Starfield Cloud
    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x3b82f6);
    const colorB = new THREE.Color(0x93c5fd);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 3;

      const mixed = colorA.clone().lerp(colorB, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Subtle Wireframe Polyhedron & Orbital Ring behind Hero Right
    const wireframeGroup = new THREE.Group();
    wireframeGroup.position.set(3.8, 0.4, -2.5);

    const icoGeo = new THREE.IcosahedronGeometry(2.15, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.11
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    wireframeGroup.add(icoMesh);

    const ringGeo = new THREE.TorusGeometry(3.15, 0.015, 12, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.16
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.38;
    ringMesh.rotation.y = Math.PI * 0.18;
    wireframeGroup.add(ringMesh);

    scene.add(wireframeGroup);

    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      wireframeGroup.position.x = w < 1024 ? 0 : 3.6;
    }

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    let scrollRatio = 0;
    window.addEventListener('scroll', function () {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRatio = window.scrollY / maxScroll;
    }, { passive: true });

    function animate() {
      if (!prefersReducedMotion) {
        icoMesh.rotation.x += 0.0018;
        icoMesh.rotation.y += 0.0024;
        ringMesh.rotation.z -= 0.0015;
        particles.rotation.y += 0.00035;
      }

      // Smooth pointer & scroll parallax
      camera.position.x += (pointer.targetX * 0.65 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.targetY * 0.45 - scrollRatio * 2.2 - camera.position.y) * 0.04;
      camera.lookAt(0, -scrollRatio * 1.4, 0);

      // Fade subtle geometric mesh gracefully as user scrolls past Hero
      const heroFade = Math.max(0.18, 1 - scrollRatio * 2.6);
      icoMat.opacity = 0.11 * heroFade;
      ringMat.opacity = 0.16 * heroFade;

      renderer.render(scene, camera);
      if (!prefersReducedMotion) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initStarfield();
    initWebGLBackground();
  });
})();
