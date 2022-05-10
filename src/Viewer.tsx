import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Star } from "./Star";
import { useSize } from "./utils";
import {
  NORMAL_HEIGHT_PX,
  MOBILE_HEIGHT_PX,
} from "./InfoPanel";


const getColor = (star: Star): THREE.ColorRepresentation => {
  //主系列星のみ
  const st = star.spectralType;
  switch(st) {
    case st.startsWith("O") && st:
      return "#9bb0ff";
    case st.startsWith("B") && st:
      return "#aabfff";
    case st.startsWith("A") && st:
      return "#cad7ff";
    case st.startsWith("F") && st:
      return "#f8f7ff";
    case st.startsWith("G") && st:
      return "#fff4ea";
    case st.startsWith("K") && st:
      return "#ffd2a1";
    case st.startsWith("M") && st:
      return "#ffcc6f";
    case st.startsWith("L") && st:
      return "#8b4513";
    case st.startsWith("T") && st:
      return "#8b4513";
    case st.startsWith("Y") && st:
      return "#8b4513";
    default:
      return "white";
  }
}

export const Viewer = (props: {
  starsMap: Map<string, Star>,
  setSelected: (star: Star | null) => void,
  selected: Star | null,
}) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  //Maybe faster than `sceneRef.current?.getObjectByName` ?
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const starsRef = useRef<THREE.Group | null>(null);
  const targetMarkersRef = useRef<THREE.Group | null>(null);

  const { isMobileSize } = useSize();
  const isMobileSizeRef = useRef<boolean>(false);
  isMobileSizeRef.current = isMobileSize;

  useEffect(() => {
    const controls = controlsRef.current;
    if (controls == null || props.selected == null) {
      return;
    }
    const targetObj = starsRef.current?.getObjectByName(`star_${props.selected?.idx}`);
    if (targetObj) {
      controls.target = targetObj.position;
      const max = controls.maxDistance;
      controls.maxDistance = 20;
      controls.update();
      drawTargetMarkers(targetObj);
      controls.maxDistance = max;
      controls.update();
    }
  }, [props.selected])

  useEffect(() => {
    createView(props.starsMap);
    return () => {
      const target = document.querySelector("#render-target");
      if (target && target.firstChild) {
        target.removeChild(target.firstChild);
      }
    }
  }, [props.starsMap]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        const { width, height } = viewerSize(isMobileSizeRef.current);
        rendererRef.current?.setSize(width, height);
        rendererRef.current?.setPixelRatio(window.devicePixelRatio);
        const camera = cameraRef.current;
        if (camera) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }, 200);
    }
    console.log("add resize listener");
    window.addEventListener("resize", handleResize);
    return () => {
      console.log("detach resize listener");
      window.removeEventListener("resize", handleResize);
    }
  }, [isMobileSize]);


  const viewerSize = (_isMobileSize?: boolean) => {
    const ms = _isMobileSize === undefined ? isMobileSize : _isMobileSize;
    return {
      width: window.innerWidth - (ms ? 0 : NORMAL_HEIGHT_PX),
      height: window.innerHeight - (ms ? MOBILE_HEIGHT_PX : 0),
    }
  }

  const onCanvasClick = (ev: MouseEvent) => {
    const cam = cameraRef.current;
    const controls = controlsRef.current;
    const group = starsRef.current;
    const scene = sceneRef.current;
    const targetCanvas = document.querySelector("#render-target") as HTMLCanvasElement;

    if (cam == null || group == null || controls == null || scene == null) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    const x = ev.clientX;
    const y = ev.clientY;

    const mouseVec = new THREE.Vector2();
    mouseVec.x =  ( x / targetCanvas.clientWidth ) * 2 - 1;
    mouseVec.y = -( y / targetCanvas.clientHeight ) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseVec, cam);
    const targetObj = raycaster.intersectObjects(group.children)[0]?.object;
    if (targetObj) {
      const key = `${targetObj.name}`
      const selected = props.starsMap.get(key);
      //controls.target = targetObj.position;
      if (selected) {
        props.setSelected(selected);
      }
      //drawTargetMarkers(targetObj);
    }
  }

  const drawAxies = (scene: THREE.Scene) => {
    const lm = new THREE.LineBasicMaterial( { color: "yellow", transparent: true, opacity: 0.5 } );
    const lm2 = new THREE.LineBasicMaterial( { color: "white", transparent: true, opacity: 0.5 } );
    [10, 20, 50, 100].forEach((rad) => {
      const pts = new THREE.Path().absarc(0, 0, rad, 0, Math.PI * 2, true).getPoints(90);
      const bg = new THREE.BufferGeometry().setFromPoints(pts);
      const circle = new THREE.Line(bg, lm);
      scene.add(circle);

      const circle2 = circle.clone(true);
      circle2.material = lm2;
      scene.add(circle2.rotateX(Math.PI / 2));
    });
    const gx = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-105, 0, 0),
      new THREE.Vector3(105, 0, 0),
    ]);
    const lx = new THREE.Line(gx, lm);
    scene.add(lx);
    const gy = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -105, 0),
      new THREE.Vector3(0, 105, 0),
    ]);
    const ly = new THREE.Line(gy, lm);
    scene.add(ly);
    const gz = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -105),
      new THREE.Vector3(0, 0, 105),
    ]);
    const lz = new THREE.Line(gz, lm2);
    scene.add(lz);
  }

  const drawTargetMarkers = (starObj: THREE.Object3D) => {
    const tmpGroup = targetMarkersRef.current;
    if (tmpGroup == null) {
      return;
    }
    const pos = starObj.position;
    const bg = new THREE.BufferGeometry()
      .setFromPoints([
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(pos.x, pos.y, 0),
        new THREE.Vector3(pos.x, pos.y, pos.z),
      ]);
    const lm = new THREE.LineBasicMaterial( { color: "lightskyblue", transparent: true, opacity: 0.5 } );
    const line = new THREE.Line(bg, lm);
    tmpGroup.clear();
    tmpGroup.add(line);
  }

  const createView = (starsMap: Map<string, Star>) => {
    if (starsMap.size < 1) {
      return;
    }

    const targetCanvas = document.querySelector("#render-target") as HTMLCanvasElement;
    targetCanvas.addEventListener("click", onCanvasClick);

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: targetCanvas,
    });
    const { width, height } = viewerSize();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const group = new THREE.Group();
    starsRef.current = group;
    scene.add(group);

    const targetMarkers = new THREE.Group();
    targetMarkersRef.current = targetMarkers;
    scene.add(targetMarkers);

    drawAxies(scene);

    Array.from(starsMap.entries()).forEach(([key, star]) => {
      const material = new THREE.MeshBasicMaterial({ color: getColor(star) });
      if (star.x != null && star.y != null && star.z != null) {
        const geometry = new THREE.SphereGeometry(0.06);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(star.x, star.y, star.z);
        mesh.name = key;
        group.add(mesh);
        if (star.idx === 0) {
          props.setSelected(star);
        }
      }
    })
    const ratio = width / height;
    const camera = new THREE.PerspectiveCamera(45, ratio);
    camera.up.set(0, 0, 1);
    cameraRef.current = camera;
    camera.position.set(10, 10, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controlsRef.current = controls;
    tick();

    function tick() {
      renderer.render(scene, camera);
      controls.update();
      requestAnimationFrame(tick);
    }
    return () => {
      document.querySelector("#render-target")?.removeChild(renderer.domElement);
    }
  };

  return (
    <canvas id="render-target" />
  )
}
