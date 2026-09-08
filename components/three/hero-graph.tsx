"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildGraph, spineLength, type Vec3 } from "./graph-data";

const SIGNAL = new THREE.Color("#eaa94b");
const SIGNAL_BRIGHT = new THREE.Color("#f7bd63");
const INK = new THREE.Color("#8a8f98");
const INK_FAINT = new THREE.Color("#33363c");
const PACKETS = 3;

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function Graph() {
  const group = useRef<THREE.Group>(null);
  const nodesMesh = useRef<THREE.InstancedMesh>(null);
  const packets = useRef<THREE.InstancedMesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { nodes, edgeGeo, spineSegs, totalLen } = useMemo(() => {
    const g = buildGraph(28);
    const position: number[] = [];
    const color: number[] = [];
    g.edges.forEach((e) => {
      position.push(...g.nodes[e.a].pos, ...g.nodes[e.b].pos);
      const c = e.spine ? SIGNAL : INK_FAINT;
      color.push(c.r, c.g, c.b, c.r, c.g, c.b);
    });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
    edgeGeo.setAttribute("color", new THREE.Float32BufferAttribute(color, 3));

    const spineSegs: { a: Vec3; b: Vec3; len: number }[] = [];
    for (let i = 1; i < g.spineIds.length; i++) {
      const a = g.nodes[g.spineIds[i - 1]].pos;
      const b = g.nodes[g.spineIds[i]].pos;
      spineSegs.push({ a, b, len: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) });
    }
    return { nodes: g.nodes, edgeGeo, spineSegs, totalLen: spineLength(g.nodes, g.spineIds) };
  }, []);

  useLayoutEffect(() => {
    const mesh = nodesMesh.current;
    if (!mesh) return;
    nodes.forEach((n, i) => {
      dummy.position.set(...n.pos);
      dummy.scale.setScalar(n.spine ? 0.042 + n.weight * 0.026 : 0.014 + n.weight * 0.018);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, n.spine ? SIGNAL : INK);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes, dummy]);

  useFrame((state) => {
    const g = group.current;
    if (g) {
      const t = state.clock.elapsedTime;
      pointer.current.x += (state.pointer.x - pointer.current.x) * 0.045;
      pointer.current.y += (state.pointer.y - pointer.current.y) * 0.045;
      // sway, never a full spin: the S stays legible
      g.rotation.y = pointer.current.x * 0.28 + Math.sin(t * 0.22) * 0.13;
      g.rotation.x = -pointer.current.y * 0.16 + Math.sin(t * 0.17) * 0.04;
    }

    const pk = packets.current;
    if (!pk) return;
    const speed = 0.5;
    for (let p = 0; p < PACKETS; p++) {
      let d = (state.clock.elapsedTime * speed + (p / PACKETS) * totalLen) % totalLen;
      let seg = 0;
      while (seg < spineSegs.length - 1 && d > spineSegs[seg].len) {
        d -= spineSegs[seg].len;
        seg++;
      }
      const s = spineSegs[seg];
      const pos = lerpVec(s.a, s.b, s.len > 0 ? Math.min(d / s.len, 1) : 0);
      dummy.position.set(...pos);
      dummy.scale.setScalar(0.075);
      dummy.updateMatrix();
      pk.setMatrixAt(p, dummy.matrix);
    }
    pk.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} position={[1.7, -0.1, 0]}>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.42} />
      </lineSegments>

      <instancedMesh ref={nodesMesh} args={[undefined, undefined, nodes.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh ref={packets} args={[undefined, undefined, PACKETS]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={SIGNAL_BRIGHT} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export default function HeroGraph() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Graph />
    </Canvas>
  );
}
