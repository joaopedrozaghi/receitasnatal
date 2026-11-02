"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * iPhone 17 Pro em 3D (modelo em /public/criativos/iphone.glb) com uma tela do app aplicada
 * no display. Renderiza uma vez (estático) e avisa em window.__phonesPending quando terminou.
 */
type Win = Window & { __phonesPending?: number };

const FINISHES = {
  silver: 0xd9dadc,
  graphite: 0x3a3c40,
  orange: 0xd87a3e,
  blue: 0x2f3f5c,
} as const;
export type Finish = keyof typeof FINISHES;

export function Phone3D({
  screen,
  width,
  height,
  yaw = -18,
  pitch = 6,
  roll = -3,
  finish = "silver",
  zoom = 1,
}: {
  screen: string;
  width: number;
  height: number;
  /** giro em graus (esquerda/direita) */
  yaw?: number;
  /** inclinação para frente/trás */
  pitch?: number;
  /** inclinação lateral */
  roll?: number;
  finish?: Finish;
  /** 1 = o aparelho ocupa a altura do quadro */
  zoom?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const w = window as Win;
    w.__phonesPending = (w.__phonesPending ?? 0) + 1;
    let done = false;
    const finish1 = () => {
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
    renderer.setPixelRatio(2);
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

    Promise.all([
      new GLTFLoader().loadAsync("/criativos/iphone.glb"),
      new THREE.TextureLoader().loadAsync(screen),
    ])
      .then(([gltf, tex]) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.name === "Display") {
            // UV a partir da posição: a imagem cobre o display inteiro
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
            // no modelo, a face do display aponta para dentro: desenha dos dois lados
            mesh.material = new THREE.MeshBasicMaterial({
              map: tex,
              toneMapped: false,
              side: THREE.DoubleSide,
            });
          } else if (mat.name === "Lens" && mesh.name === "Object_44") {
            // lente da câmera frontal: ilha dinâmica preta e sólida
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
              metalness: 0,
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
        const c = box.getCenter(new THREE.Vector3());
        model.position.sub(c);
        pivot.rotation.set(
          THREE.MathUtils.degToRad(pitch),
          THREE.MathUtils.degToRad(yaw),
          THREE.MathUtils.degToRad(roll),
          "YXZ",
        );
        scene.add(pivot);

        const size = box.getSize(new THREE.Vector3());
        const fov = THREE.MathUtils.degToRad(camera.fov);
        const dist = ((size.y / 2 / Math.tan(fov / 2)) * 1.08) / zoom;
        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(finish1);
      })
      .catch((e) => {
        console.error(e);
        finish1();
      });

    return () => {
      finish1();
      renderer.dispose();
      pmrem.dispose();
    };
  }, [screen, width, height, yaw, pitch, roll, finish, zoom]);

  return <canvas ref={ref} style={{ width, height }} />;
}
