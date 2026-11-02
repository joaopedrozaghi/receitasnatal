"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { Finish } from "./Phone3D";

/**
 * iPhone 17 Pro 3D para vídeo: redesenha a cada mudança de props (giro, tela, transição).
 * As telas são desenhadas num canvas 2D que vira a textura do display, então dá para
 * deslizar de uma tela para outra. Avisa em window.__phonesPending quando carregou.
 */
type Win = Window & { __phonesPending?: number };

const FINISHES: Record<Finish, number> = {
  silver: 0xd9dadc,
  graphite: 0x3a3c40,
  orange: 0xd87a3e,
  blue: 0x2f3f5c,
};

const TEX_W = 900;
const TEX_H = 2002;

interface State {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pivot: THREE.Group;
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture;
  imgs: HTMLImageElement[];
}

export function Phone3DLive({
  screens,
  from,
  to = from,
  mix = 0,
  width,
  height,
  yaw = 0,
  pitch = 0,
  roll = 0,
  finish = "silver",
  zoom = 1,
}: {
  /** URLs das telas (PNG) */
  screens: string[];
  /** índice da tela atual */
  from: number;
  /** índice da próxima tela (para a transição) */
  to?: number;
  /** 0 → tela `from`, 1 → tela `to` (desliza da direita) */
  mix?: number;
  width: number;
  height: number;
  yaw?: number;
  pitch?: number;
  roll?: number;
  finish?: Finish;
  zoom?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef<State | null>(null);
  const props = useRef({ from, to, mix, yaw, pitch, roll });
  props.current = { from, to, mix, yaw, pitch, roll };

  const draw = () => {
    const s = st.current;
    if (!s) return;
    const p = props.current;
    const { ctx } = s;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    const a = s.imgs[p.from];
    const b = s.imgs[p.to];
    const x = p.mix * TEX_W;
    if (a) ctx.drawImage(a, -x * 0.35, 0, TEX_W, TEX_H);
    if (b && p.mix > 0) {
      ctx.fillStyle = `rgba(0,0,0,${0.35 * p.mix})`;
      ctx.fillRect(0, 0, TEX_W, TEX_H);
      ctx.drawImage(b, TEX_W - x, 0, TEX_W, TEX_H);
    }
    s.tex.needsUpdate = true;
    s.pivot.rotation.set(
      THREE.MathUtils.degToRad(p.pitch),
      THREE.MathUtils.degToRad(p.yaw),
      THREE.MathUtils.degToRad(p.roll),
      "YXZ",
    );
    s.renderer.render(s.scene, s.camera);
  };

  // monta a cena uma vez
  useEffect(() => {
    const w = window as Win;
    w.__phonesPending = (w.__phonesPending ?? 0) + 1;
    let done = false;
    const ready = () => {
      if (!done) {
        done = true;
        w.__phonesPending = (w.__phonesPending ?? 1) - 1;
      }
    };

    const canvas = ref.current!;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(1.5);
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-2, 3, 4);
    const rim = new THREE.DirectionalLight(0xfff1d6, 1.6);
    rim.position.set(3, 1, -2);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));
    const camera = new THREE.PerspectiveCamera(20, width / height, 0.01, 10);

    const c2d = document.createElement("canvas");
    c2d.width = TEX_W;
    c2d.height = TEX_H;
    const ctx = c2d.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c2d);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = src;
      });

    Promise.all([new GLTFLoader().loadAsync("/criativos/iphone.glb"), Promise.all(screens.map(loadImg))])
      .then(([gltf, imgs]) => {
        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.name === "Display") {
            const g = mesh.geometry;
            g.computeBoundingBox();
            const bb = g.boundingBox!;
            const pos = g.attributes.position!;
            const uv = new Float32Array(pos.count * 2);
            for (let i = 0; i < pos.count; i++) {
              uv[i * 2] = (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x);
              uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y);
            }
            g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
            mesh.material = new THREE.MeshBasicMaterial({
              map: tex,
              toneMapped: false,
              side: THREE.DoubleSide,
            });
          } else if (mat.name === "Lens" && mesh.name === "Object_44") {
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0x050506,
              roughness: 0.3,
              metalness: 0.2,
            });
          } else if (mat.name === "Glass") {
            mesh.material = new THREE.MeshPhysicalMaterial({
              color: 0x000000,
              transparent: true,
              opacity: 0.08,
              roughness: 0.02,
              envMapIntensity: 0.6,
            });
          } else if (mat.name === "Aluminum" || mat.name === "Tint_back_glass") {
            mat.color = new THREE.Color(FINISHES[finish]);
            mat.metalness = mat.name === "Aluminum" ? 0.85 : 0.1;
            mat.roughness = mat.name === "Aluminum" ? 0.32 : 0.25;
          }
        });
        const pivot = new THREE.Group();
        pivot.add(model);
        const box = new THREE.Box3().setFromObject(model);
        model.position.sub(box.getCenter(new THREE.Vector3()));
        scene.add(pivot);
        const size = box.getSize(new THREE.Vector3());
        const dist = ((size.y / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) * 1.08) / zoom;
        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);

        st.current = { renderer, scene, camera, pivot, ctx, tex, imgs };
        draw();
        requestAnimationFrame(ready);
      })
      .catch((e) => {
        console.error(e);
        ready();
      });

    return () => {
      ready();
      st.current = null;
      renderer.dispose();
      pmrem.dispose();
      tex.dispose();
    };
    // a cena só é montada de novo se mudar tamanho, acabamento ou telas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, finish, zoom, screens.join("|")]);

  // redesenha a cada quadro
  useEffect(draw, [from, to, mix, yaw, pitch, roll]);

  return <canvas ref={ref} style={{ width, height, display: "block" }} />;
}
