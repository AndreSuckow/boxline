"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  length: string;
  width: string;
  height: string;
  active: "length" | "width" | "height";
};
const axes = ["length", "width", "height"] as const;
const names = { length: "Comprimento", width: "Largura", height: "Altura" };
const initials = { length: "C", width: "L", height: "A" };
export default function DimensionScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const values = axes.map((axis) =>
    Math.max(0.1, Math.min(300, Number(props[axis]) || 0.1)),
  );
  const [length, width, height] = values;
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    el.prepend(renderer.domElement);
    el.classList.add("dimension-ready");
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfffbf0, 0x594735, 2.8));
    const light = new THREE.DirectionalLight(0xfff7e8, 3);
    light.position.set(-3, 8, 5);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffffff, 1.4);
    fill.position.set(5, 2, -3);
    scene.add(fill);
    const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
    camera.position.set(7, 5, 8);
    camera.lookAt(0, 0.15, 0);
    const biggest = Math.max(length, width, height);
    const c = Math.max(0.5, (length / biggest) * 3.2);
    const l = Math.max(0.5, (width / biggest) * 3.2);
    const a = Math.max(0.5, (height / biggest) * 3.2);
    const paper = document.createElement("canvas");
    paper.width = paper.height = 128;
    const ctx = paper.getContext("2d")!;
    ctx.fillStyle = "#bd9b70";
    ctx.fillRect(0, 0, 128, 128);
    let seed = 47;
    for (let i = 0; i < 5000; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = seed % 128;
      seed = (seed * 16807) % 2147483647;
      ctx.fillStyle = i % 2 ? "rgba(68,41,10,.07)" : "rgba(255,245,213,.15)";
      ctx.fillRect(x, seed % 128, 1, 2);
    }
    const texture = new THREE.CanvasTexture(paper);
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.BoxGeometry(c, a, l);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.95,
    });
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: 0x886337,
        transparent: true,
        opacity: 0.45,
      }),
    );
    scene.add(edges);
    const tape = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, l),
      new THREE.MeshStandardMaterial({ color: 0xd7bf99, roughness: 1 }),
    );
    tape.rotation.x = -Math.PI / 2;
    tape.position.y = a / 2 + 0.005;
    scene.add(tape);
    const endpoints = {
      length: [
        new THREE.Vector3(-c / 2, -a / 2 - 0.48, l / 2 + 0.42),
        new THREE.Vector3(c / 2, -a / 2 - 0.48, l / 2 + 0.42),
      ],
      width: [
        new THREE.Vector3(c / 2 + 0.42, -a / 2 - 0.48, -l / 2),
        new THREE.Vector3(c / 2 + 0.42, -a / 2 - 0.48, l / 2),
      ],
      height: [
        new THREE.Vector3(-c / 2 - 0.5, -a / 2, l / 2 + 0.1),
        new THREE.Vector3(-c / 2 - 0.5, a / 2, l / 2 + 0.1),
      ],
    };
    const anchors: THREE.Vector3[] = [];
    axes.forEach((axis) => {
      const [start, end] = endpoints[axis];
      const direction = end.clone().sub(start).normalize();
      const distance = start.distanceTo(end);
      const color = axis === props.active ? 0x4a583f : 0x8b806e;
      scene.add(
        new THREE.ArrowHelper(
          direction,
          start,
          distance,
          color,
          Math.min(0.13, distance * 0.15),
          0.09,
        ),
      );
      scene.add(
        new THREE.ArrowHelper(
          direction.clone().negate(),
          end,
          distance,
          color,
          Math.min(0.13, distance * 0.15),
          0.09,
        ),
      );
      anchors.push(start.clone().add(end).multiplyScalar(0.5));
    });
    const draw = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      const aspect = w / Math.max(h, 1);
      camera.updateMatrixWorld();
      const bounds = new THREE.Box3().setFromObject(scene);
      let halfX = 0,
        halfY = 0;
      for (const x of [bounds.min.x, bounds.max.x])
        for (const y of [bounds.min.y, bounds.max.y])
          for (const z of [bounds.min.z, bounds.max.z]) {
            const p = new THREE.Vector3(x, y, z).applyMatrix4(
              camera.matrixWorldInverse,
            );
            halfX = Math.max(halfX, Math.abs(p.x));
            halfY = Math.max(halfY, Math.abs(p.y));
          }
      const vertical = Math.max(1.8, halfY * 1.28, (halfX / aspect) * 1.28);
      camera.left = -vertical * aspect;
      camera.right = vertical * aspect;
      camera.top = vertical;
      camera.bottom = -vertical;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      anchors.forEach((anchor, i) => {
        const p = anchor.clone().project(camera);
        const label = el.querySelector<HTMLElement>(
          '[data-axis="' + axes[i] + '"]',
        );
        if (label) {
          label.style.left = (p.x * 0.5 + 0.5) * w + "px";
          label.style.top = (-p.y * 0.5 + 0.5) * h + "px";
        }
      });
      renderer.render(scene, camera);
    };
    const resize = new ResizeObserver(draw);
    resize.observe(el);
    draw();
    return () => {
      resize.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(
            (m) => m.dispose(),
          );
        }
      });
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      el.classList.remove("dimension-ready");
    };
  }, [length, width, height, props.active]);
  return (
    <figure className="dimension-figure">
      <div
        ref={host}
        className="dimension-scene"
        role="img"
        aria-label={
          "Caixa em 3D: comprimento " +
          props.length +
          ", largura " +
          props.width +
          " e altura " +
          props.height +
          " centímetros."
        }
      >
        <div className="dimension-fallback" aria-hidden="true">
          <div className="mini-box">
            <i />
            <b>C × L × A</b>
          </div>
        </div>
        {axes.map((axis) => (
          <span
            className={
              "dimension-label " + (props.active === axis ? "is-active" : "")
            }
            data-axis={axis}
            key={axis}
            aria-hidden="true"
          >
            <b>{initials[axis]}</b> {props[axis] || "—"} cm
          </span>
        ))}
      </div>
      <figcaption>
        {names[props.active]} em destaque · medidas internas
      </figcaption>
    </figure>
  );
}
