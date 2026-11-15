/**
 * Interactive 3D Lanyard ID Card with Pendulum Spring Physics
 * Supports pointer hover 3D tilt, drag-and-release swing inertia,
 * and dynamic curved SVG lanyard strap ("DEVELOPER").
 */
(function () {
  'use strict';

  function initLanyard() {
    const stage = document.getElementById('lanyard-stage');
    const rig = document.getElementById('lanyard-rig');
    const card3d = document.getElementById('lanyard-card-3d');
    const strapPath = document.getElementById('lanyard-strap-path');
    const strapEdgeLeft = document.getElementById('lanyard-strap-edge-l');
    const strapEdgeRight = document.getElementById('lanyard-strap-edge-r');

    if (!stage || !rig || !card3d || !strapPath) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Physics state
    const state = {
      x: 0,
      y: -36, // Starts slightly dropped for entrance bounce
      vx: 1.6,
      vy: 0,
      tiltX: 0,
      tiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      isDragging: false,
      isHovered: false,
      dragStartX: 0,
      dragStartY: 0,
      originX: 0,
      originY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      time: 0
    };

    rig.addEventListener('pointerenter', function () {
      state.isHovered = true;
    });

    rig.addEventListener('pointerleave', function () {
      state.isHovered = false;
      if (!state.isDragging) {
        state.targetTiltX = 0;
        state.targetTiltY = 0;
      }
    });

    rig.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      state.lastPointerX = e.clientX;
      state.lastPointerY = e.clientY;
      state.originX = state.x;
      state.originY = state.y;
      state.totalDragDist = 0;
      rig.classList.add('is-dragging');
      try {
        rig.setPointerCapture(e.pointerId);
      } catch (err) {
        /* fallback for synthetic events */
      }
    });

    window.addEventListener('pointermove', function (e) {
      if (state.isDragging) {
        const dx = e.clientX - state.dragStartX;
        const dy = e.clientY - state.dragStartY;
        const stepX = e.clientX - state.lastPointerX;
        const stepY = e.clientY - state.lastPointerY;

        state.lastPointerX = e.clientX;
        state.lastPointerY = e.clientY;

        // Soft elastic leash clamping
        const maxOffsetX = 145;
        const maxOffsetY = 95;
        state.x = Math.max(-maxOffsetX, Math.min(maxOffsetX, state.originX + dx));
        state.y = Math.max(-75, Math.min(maxOffsetY, state.originY + dy * 0.72));

        state.vx = stepX * 0.45;
        state.vy = stepY * 0.35;

        state.targetTiltY = Math.max(-24, Math.min(24, stepX * 1.45 + (state.x * 0.08)));
        state.targetTiltX = Math.max(-18, Math.min(18, -stepY * 1.1));
        return;
      }

      if (state.isHovered) {
        const rect = rig.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
        state.targetTiltY = nx * 16;
        state.targetTiltX = -ny * 14;

        card3d.style.setProperty('--sheen-x', (50 + nx * 32).toFixed(1) + '%');
        card3d.style.setProperty('--sheen-y', (40 + ny * 28).toFixed(1) + '%');
      }
    });

    function releaseDrag(e) {
      if (!state.isDragging) return;
      state.isDragging = false;
      rig.classList.remove('is-dragging');
      if (e && e.pointerId !== undefined) {
        try {
          rig.releasePointerCapture(e.pointerId);
        } catch (err) {
          /* ignore */
        }
      }

      state.targetTiltX = 0;
      state.targetTiltY = 0;
    }

    window.addEventListener('pointerup', releaseDrag);
    window.addEventListener('pointercancel', releaseDrag);

    function updateStrap(endX, endY, swingDeg) {
      // SVG viewBox is 0 0 340 540; anchor top is (170, 0)
      // Rig center-top clasp sits at (170 + endX, 424 + endY)
      const anchorX = 170;
      const anchorY = 0;
      const targetX = 170 + endX;
      const targetY = 424 + endY;

      // Control point lags slightly behind for realistic ribbon curve
      const ctrlX = anchorX + endX * 0.42 - swingDeg * 1.6;
      const ctrlY = (anchorY + targetY) * 0.56;

      const d = 'M ' + anchorX + ' ' + anchorY + ' Q ' + ctrlX.toFixed(1) + ' ' + ctrlY.toFixed(1) + ' ' + targetX.toFixed(1) + ' ' + targetY.toFixed(1);
      strapPath.setAttribute('d', d);

      if (strapEdgeLeft && strapEdgeRight) {
        const dL = 'M ' + (anchorX - 15) + ' ' + anchorY + ' Q ' + (ctrlX - 15).toFixed(1) + ' ' + ctrlY.toFixed(1) + ' ' + (targetX - 15).toFixed(1) + ' ' + targetY.toFixed(1);
        const dR = 'M ' + (anchorX + 15) + ' ' + anchorY + ' Q ' + (ctrlX + 15).toFixed(1) + ' ' + ctrlY.toFixed(1) + ' ' + (targetX + 15).toFixed(1) + ' ' + targetY.toFixed(1);
        strapEdgeLeft.setAttribute('d', dL);
        strapEdgeRight.setAttribute('d', dR);
      }
    }

    function step() {
      state.time += 0.025;

      if (!state.isDragging) {
        // Gentle idle air-current target
        const ambientX = prefersReducedMotion ? 0 : Math.sin(state.time * 0.85) * 4.5;
        const ambientY = prefersReducedMotion ? 0 : Math.cos(state.time * 1.3) * 1.8;

        // Pendulum spring restoring force
        const stiffnessX = 0.048;
        const stiffnessY = 0.085;
        const damping = 0.905;

        const forceX = (ambientX - state.x) * stiffnessX;
        const forceY = (ambientY - state.y) * stiffnessY;

        state.vx = (state.vx + forceX) * damping;
        state.vy = (state.vy + forceY) * damping;

        state.x += state.vx;
        state.y += state.vy;
      }

      // Smooth 3D hover/drag tilt
      state.tiltX += (state.targetTiltX - state.tiltX) * 0.14;
      state.tiltY += (state.targetTiltY - state.tiltY) * 0.14;

      // Natural pendulum tilt angle tied to displacement & velocity
      const swingDeg = -state.x * 0.13 - state.vx * 0.45;

      rig.style.transform =
        'translate3d(' + state.x.toFixed(2) + 'px, ' + state.y.toFixed(2) + 'px, 0) ' +
        'rotateZ(' + swingDeg.toFixed(2) + 'deg)';

      card3d.style.transform =
        'rotateX(' + state.tiltX.toFixed(2) + 'deg) ' +
        'rotateY(' + state.tiltY.toFixed(2) + 'deg)';

      // Dynamic sheen during idle swing when not hovered
      if (!state.isHovered) {
        const sx = 50 + Math.sin(state.time * 0.9 + state.x * 0.03) * 20;
        const sy = 36 + Math.cos(state.time * 0.7) * 14;
        card3d.style.setProperty('--sheen-x', sx.toFixed(1) + '%');
        card3d.style.setProperty('--sheen-y', sy.toFixed(1) + '%');
      }

      updateStrap(state.x, state.y, swingDeg);
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  document.addEventListener('DOMContentLoaded', initLanyard);
})();
