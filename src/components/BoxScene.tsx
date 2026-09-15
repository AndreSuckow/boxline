"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
export default function BoxScene({ exploded = false }: { exploded?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.25 : 1.75),
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(6.7, 4.5, 7.8);
    camera.lookAt(0, 0.35, 0);
    scene.add(new THREE.HemisphereLight(0xfff9f0, 0x594735, 2));
    const light = new THREE.DirectionalLight(0xfff8ee, 3);
    light.position.set(-3, 8, 5);
    light.castShadow = true;
    light.shadow.mapSize.set(
      window.innerWidth < 800 ? 1024 : 2048,
      window.innerWidth < 800 ? 1024 : 2048,
    );
    Object.assign(light.shadow.camera, {
      left: -7,
      right: 7,
      top: 7,
      bottom: -7,
    });
    light.shadow.normalBias = 0.03;
    light.shadow.radius = 4;
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffffff, 2);
    fill.position.set(6, 3, -4);
    scene.add(fill);
    const texture = new THREE.TextureLoader().load(
      (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/textures/kraft.webp",
      () => schedule(),
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    const kraft = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.92,
      color: 0xdfd6c5,
    });
    const inner = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 1,
      color: 0xbb905e,
    });
    const group = new THREE.Group();
    scene.add(group);
    const pieces: THREE.Mesh[] = [];
    const part = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      material = kraft,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = mesh.receiveShadow = true;
      group.add(mesh);
      pieces.push(mesh);
      return mesh;
    };
    if (!exploded) {
      part(3.2, 0.055, 2.45, 0, -0.8, 0, inner);
      part(3.2, 1.8, 0.055, 0, 0.1, 1.225);
      part(3.2, 1.8, 0.055, 0, 0.1, -1.225);
      part(0.055, 1.8, 2.45, -1.6, 0.1, 0);
      part(0.055, 1.8, 2.45, 1.6, 0.1, 0);
      part(3.2, 0.045, 1.1, 0, 1.12, 1.73).rotation.x = 0.38;
      part(3.2, 0.045, 1.1, 0, 1.12, -1.73).rotation.x = -0.38;
      part(1.25, 0.045, 2.4, -2.11, 1.3, 0).rotation.z = -0.5;
      part(1.25, 0.045, 2.4, 2.11, 1.3, 0).rotation.z = 0.5;
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 1024;
      labelCanvas.height = 512;
      const lc = labelCanvas.getContext("2d")!;
      lc.fillStyle = "#443522";
      lc.font = "600 110px Arial";
      lc.fillText("BoxLyne", 85, 255);
      lc.font = "23px Arial";
      lc.fillText("ENGENHARIA DE EMBALAGEM", 91, 305);
      lc.strokeStyle = "#443522";
      lc.lineWidth = 5;
      lc.strokeRect(89, 350, 33, 33);
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 1.25),
        new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(labelCanvas),
          transparent: true,
          depthWrite: false,
        }),
      );
      label.position.set(0, 0.02, 1.26);
      group.add(label);
    } else {
      part(3.7, 0.065, 2.4, 0, 0.19, 0);
      part(3.7, 0.065, 2.4, 0, -0.19, 0, inner);
      const wave = new THREE.Shape();
      for (let i = 0; i <= 160; i++) {
        const x = -1.85 + (i * 3.7) / 160,
          y = Math.sin((i / 160) * Math.PI * 24) * 0.115;
        if (i === 0) wave.moveTo(x, y);
        else wave.lineTo(x, y);
      }
      for (let i = 160; i >= 0; i--)
        wave.lineTo(
          -1.85 + (i * 3.7) / 160,
          Math.sin((i / 160) * Math.PI * 24) * 0.115 - 0.035,
        );
      wave.closePath();
      const core = new THREE.Mesh(
        new THREE.ExtrudeGeometry(wave, {
          depth: 2.4,
          bevelEnabled: false,
          steps: 1,
        }),
        inner,
      );
      core.position.z = -1.2;
      core.castShadow = core.receiveShadow = true;
      group.add(core);
    }
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = exploded ? -1.8 : -0.85;
    floor.receiveShadow = true;
    scene.add(floor);
    group.rotation.y = -0.25;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetX = 0,
      targetY = -0.25,
      frame = 0,
      visible = true;
    let pointer: number | null = null;
    let lastX = 0,
      lastY = 0,
      hovering = false;
    const move = (e: PointerEvent) => {
      if (exploded || (pointer !== null && pointer !== e.pointerId)) return;
      if (pointer !== null || (e.pointerType === "mouse" && hovering)) {
        targetY +=
          ((e.clientX - lastX) * Math.PI * 2) / Math.max(el.clientWidth, 1);
        targetX +=
          ((e.clientY - lastY) * Math.PI * 2) / Math.max(el.clientHeight, 1);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      hovering = true;
      schedule();
    };
    const down = (e: PointerEvent) => {
      if (
        exploded ||
        pointer !== null ||
        (e.pointerType === "mouse" && e.button !== 0)
      )
        return;
      pointer = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    };
    const release = (e: PointerEvent) => {
      if (pointer !== e.pointerId) return;
      pointer = null;
      hovering = false;
      el.classList.remove("is-dragging");
      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
    };
    const leave = () => {
      hovering = false;
    };
    const key = (e: KeyboardEvent) => {
      if (exploded) return;
      const step = Math.PI / 6;
      if (e.key === "ArrowLeft") targetY -= step;
      else if (e.key === "ArrowRight") targetY += step;
      else if (e.key === "ArrowUp") targetX -= step;
      else if (e.key === "ArrowDown") targetX += step;
      else if (e.key === "Home") {
        targetX = 0;
        targetY = -0.25;
      } else return;
      e.preventDefault();
      schedule();
    };
    if (!exploded) {
      group.children.forEach((child) => {
        child.position.y -= 0.3;
      });
      floor.visible = false;
      camera.position.multiplyScalar(1.12);
      camera.lookAt(0, 0, 0);
    }
    const scrollRegion = el.closest(
      ".engineering-scroll",
    ) as HTMLElement | null;
    const grid = el.closest(".engineering-grid") as HTMLElement | null;
    const descriptions = grid?.querySelector<HTMLElement>(
      ".layer-descriptions",
    );
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("lostpointercapture", release);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("keydown", key);
    const resize = new ResizeObserver(() => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      schedule();
    });
    resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(el);
    let shadersReady = false;
    function schedule() {
      if (shadersReady && !frame && visible)
        frame = requestAnimationFrame(render);
    }
    if (exploded)
      window.addEventListener("scroll", schedule, { passive: true });
    function render() {
      frame = 0;
      if (!visible) return;
      if (!exploded) {
        const smoothing = reduced.matches ? 1 : 0.16;
        group.rotation.y = THREE.MathUtils.lerp(
          group.rotation.y,
          targetY,
          smoothing,
        );
        group.rotation.x = THREE.MathUtils.lerp(
          group.rotation.x,
          targetX,
          smoothing,
        );
        if (
          Math.abs(group.rotation.x - targetX) > 0.0001 ||
          Math.abs(group.rotation.y - targetY) > 0.0001
        )
          schedule();
      } else {
        const rect = scrollRegion?.getBoundingClientRect();
        const travel = rect
          ? rect.height - (grid?.clientHeight ?? window.innerHeight)
          : 1;
        const p = reduced.matches
          ? 1
          : THREE.MathUtils.clamp(
              rect ? (90 - rect.top) / Math.max(travel, 1) : 1,
              0,
              1,
            );
        const ease = (v: number) => {
          const t = THREE.MathUtils.clamp(v, 0, 1);
          return t * t * (3 - 2 * t);
        };
        const tilt = ease((p - 0.08) / 0.42);
        const separation = ease((p - 0.2) / 0.45);
        const reveal = ease((p - 0.72) / 0.2);
        pieces[0].position.y = 0.165 + separation * 1.05;
        pieces[1].position.y = -0.165 - separation * 1.05;
        group.rotation.set(0, -0.12 * tilt, 0);
        camera.position.set(4.8 * tilt, 9 - 3.5 * tilt, 0.001 + 6.5 * tilt);
        // Fit all eight corners using the current viewport, including the final split.
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        const bounds = new THREE.Box3().setFromObject(group);
        const outward = camera.position.clone().normalize();
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
          camera.quaternion,
        );
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(
          camera.quaternion,
        );
        const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const tanH = tanV * camera.aspect;
        let distance = 0;
        for (const x of [bounds.min.x, bounds.max.x])
          for (const y of [bounds.min.y, bounds.max.y])
            for (const z of [bounds.min.z, bounds.max.z]) {
              const corner = new THREE.Vector3(x, y, z);
              distance = Math.max(
                distance,
                Math.abs(corner.dot(right)) / tanH + corner.dot(outward),
                Math.abs(corner.dot(up)) / tanV + corner.dot(outward),
              );
            }
        camera.position.copy(
          outward.multiplyScalar(Math.max(9, distance * 1.18)),
        );
        camera.lookAt(0, 0, 0);
        if (grid) {
          grid.style.setProperty("--explanation", String(reveal));
          grid.dataset.stage =
            p < 0.2 ? "assembled" : p < 0.72 ? "separating" : "explained";
        }
        if (descriptions)
          descriptions.style.visibility = reveal > 0 ? "visible" : "hidden";
      }
      renderer.render(scene, camera);
    }
    let disposed = false;
    const compileTimer = window.setTimeout(() => {
      renderer
        .compileAsync(scene, camera)
        .then(() => {
          if (!disposed) {
            shadersReady = true;
            schedule();
            setReady(true);
          }
        })
        .catch(() => {
          if (!disposed) setReady(false);
        });
    }, 0);
    const lost = (e: Event) => {
      e.preventDefault();
      setReady(false);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      window.clearTimeout(compileTimer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      resize.disconnect();
      observer.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("lostpointercapture", release);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("keydown", key);
      grid?.style.removeProperty("--explanation");
      if (descriptions) descriptions.style.removeProperty("visibility");
      const materials = new Set<THREE.Material>();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(
            (m) => materials.add(m),
          );
        }
      });
      materials.forEach((m) => {
        if ("map" in m) (m.map as THREE.Texture | null)?.dispose();
        m.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [exploded]);
  return (
    <div
      ref={host}
      className={"box-scene " + (ready ? "is-ready" : "")}
      tabIndex={exploded ? undefined : 0}
      role="img"
      aria-label={
        exploded
          ? "Estrutura 3D: face externa, miolo ondulado e face interna"
          : "Caixa de papelão BoxLyne em 3D. Mova o mouse, arraste com o dedo ou use as setas para girar; Home restaura a posição"
      }
    >
      <div className="scene-fallback" aria-hidden="true">
        {exploded ? (
          <div className="fallback-layers">
            <i />
            <i />
            <i />
          </div>
        ) : (
          <div className="mini-box">
            <i />
            <b>BoxLyne</b>
          </div>
        )}
      </div>
    </div>
  );
}
