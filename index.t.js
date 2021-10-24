import * as THREE from 'three';
import Simplex from './simplex-noise.js';

const localVector = new THREE.Vector3();
const simplex = new Simplex('lol');

const _makeSilkMesh = () => {
  // const velocity = v.clone();
  // let grounded = false;
  
  const silkMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 0.05, 0.1, 10, 10, 10), new THREE.MeshNormalMaterial());
  const defaultScale = new THREE.Vector3(1, 0.3, 1).multiplyScalar(0.5);
  silkMesh.scale.copy(defaultScale);

  const startTime = Date.now();
  let lastTimestamp = startTime;
  let animation = null;
  const timeOffset = Math.random() * 10;
  silkMesh.update = () => {
    const now = Date.now();
    const timeDiff = (now - lastTimestamp) / 1000;
    lastTimestamp = now;

    const time = timeOffset + performance.now() * 0.002;
    const k = 1;
    for (var i = 0; i < silkMesh.geometry.attributes.position.array.length; i += 3) {
      const p = localVector.fromArray(silkMesh.geometry.attributes.position.array, i);
      const f = 0.5 + 0.2 * simplex.noise3D(p.x * k + time, p.y * k, p.z * k);
      p.normalize().multiplyScalar(f);
      p.toArray(silkMesh.geometry.attributes.position.array, i);
    }
    silkMesh.geometry.attributes.position.needsUpdate = true;
    silkMesh.geometry.computeVertexNormals();
    silkMesh.geometry.normalsNeedUpdate = true;
    silkMesh.geometry.verticesNeedUpdate = true;
  };
  return silkMesh;
};
// const silkMesh = _makeSilkMesh();
// silkMesh.position.set(0, 1.2, -2);
// scene.add(silkMesh);

export default async app => {
  const silkMesh = _makeSilkMesh();
  /* app.addEventListener('frame', () => {
    silkMesh.update();
  }); */
  return silkMesh;
};