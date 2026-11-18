import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * ============================================================================
 * INTERACTIVE DARK-MODE BERSUS 3D ENGINE (js/scene.js)
 * ============================================================================
 * Interactive capabilities:
 * 1. Well-spaced 3D Elliptical Crown / Arch layout for all 12 nodes so labels
 *    never overlap and every crystal is easy to click & hover.
 * 2. Interactive Cyber Knight (Left) & Cyber Statue (Right):
 *    - Head/body tracks cursor in 3D space
 *    - Hovering ignites wireframe armor, visor & plasma bat
 *    - Clicking Knight activates AI/ML Core mode + shockwave ring
 *    - Clicking Statue activates Full-Stack/Cloud mode + plasma burst
 *    - Direct drag-to-spin on Knight, Statue, or full 360° OrbitControls
 * 3. Interactive 3D Node Selection + Sequential Auto-Tour (01 -> 02 -> ... -> 12)
 *    with a 3D Target Reticle Ring that locks onto the active node.
 */

export class PortfolioScene3D {
  constructor({
    canvas,
    labelsContainer,
    skills,
    onSelectSkill,
    onHoverSkill,
    onSculptureClick,
    onTimelineUpdate
  }) {
    this.canvas = canvas;
    this.labelsContainer = labelsContainer;
    this.skills = skills;
    this.onSelectSkill = onSelectSkill;
    this.onHoverSkill = onHoverSkill;
    this.onSculptureClick = onSculptureClick;
    this.onTimelineUpdate = onTimelineUpdate;

    this.nodeMeshes = new Map();
    this.labelElements = new Map();
    this.interactableMeshes = [];
    this.chainPulses = [];
    this.shockwaves = [];

    this.selectedSkillId = null;
    this.hoveredSkillId = null;
    this.hoveredSculpture = null; // 'knight' | 'statue' | null
    this.activeFilter = 'all';
    this.highlightedSet = null;
    this.showConstellation = true;

    this.isPlaying = true;
    this.isAutoTouring = false;
    this.autoTourIndex = 0;
    this.autoTourTimer = null;

    this.timelineProgress = 0.65;
    this.knightSpinOffset = 0;
    this.statueSpinOffset = 0;
    this.draggingSculpture = null;
    this.prevPointerX = 0;

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.raycaster = new THREE.Raycaster();

    this._initScene();
    this._initCyberLights();
    this._createCyberEnvironment();
    this._createCyberKnight();
    this._createCyberStatue();
    this._createLinked3DNodeChain();
    this._createTargetReticle();
    this._bindEvents();
    this._animate();
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06070c, 0.018);

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      160
    );
    this.camera.position.set(0, 0.7, 14.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.85;
    this.controls.minDistance = 4.5;
    this.controls.maxDistance = 26;
    this.controls.enablePan = true;
    this.controls.maxPolarAngle = Math.PI * 0.75;
    this.controls.minPolarAngle = Math.PI * 0.22;
    this.controls.target.set(0, 0.2, 0);

    this.stageGroup = new THREE.Group();
    this.scene.add(this.stageGroup);
  }

  _initCyberLights() {
    const ambient = new THREE.AmbientLight(0x94a3b8, 0.95);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(-6, 12, 10);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    this.cyanLight = new THREE.PointLight(0x00f2fe, 6.0, 24);
    this.cyanLight.position.set(-5.5, 2.5, 3.8);
    this.scene.add(this.cyanLight);

    this.pinkLight = new THREE.PointLight(0xff2a85, 6.0, 24);
    this.pinkLight.position.set(5.5, 2.0, 3.8);
    this.scene.add(this.pinkLight);

    // Interactive cursor light that follows the user's mouse in 3D space!
    this.cursorLight = new THREE.PointLight(0x38ef7d, 4.0, 14);
    this.cursorLight.position.set(0, 1, 5);
    this.scene.add(this.cursorLight);

    const backLight = new THREE.DirectionalLight(0x8b5cf6, 2.4);
    backLight.position.set(0, 8, -10);
    this.scene.add(backLight);
  }

  _createCyberEnvironment() {
    const gridHelper = new THREE.GridHelper(48, 48, 0xff2a85, 0x1e293b);
    gridHelper.position.y = -2.58;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.38;
    this.scene.add(gridHelper);

    const pCount = 950;
    const pos = new Float32Array(pCount * 3);
    const col = new Float32Array(pCount * 3);
    const c1 = new THREE.Color(0x00f2fe);
    const c2 = new THREE.Color(0xff2a85);
    const c3 = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26 - 4;

      const pick = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      col[i * 3] = pick.r;
      col[i * 3 + 1] = pick.g;
      col[i * 3 + 2] = pick.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.095,
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  /**
   * LEFT 3D SCULPTURE: Interactive Cyber-Obsidian AI Chess Knight
   */
  _createCyberKnight() {
    this.knightGroup = new THREE.Group();
    this.knightGroup.position.set(-2.5, -0.55, 1.0);
    this.knightGroup.rotation.set(0.08, 0.55, 0.2);
    this.stageGroup.add(this.knightGroup);

    this.knightObsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b0d14,
      emissive: 0x050814,
      roughness: 0.18,
      metalness: 0.78,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      flatShading: true
    });

    this.knightWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    const addPart = (geo, pos, rot = [0, 0, 0], scale = [1, 1, 1], withWire = true) => {
      const m = new THREE.Mesh(geo, this.knightObsidianMat);
      m.position.set(...pos);
      m.rotation.set(...rot);
      m.scale.set(...scale);
      m.castShadow = true;
      m.receiveShadow = true;
      m.userData = { isKnight: true };
      this.interactableMeshes.push(m);
      this.knightGroup.add(m);

      if (withWire) {
        const w = new THREE.Mesh(geo, this.knightWireMat);
        w.position.set(...pos);
        w.rotation.set(...rot);
        w.scale.set(scale[0] * 1.015, scale[1] * 1.015, scale[2] * 1.015);
        this.knightGroup.add(w);
      }
      return m;
    };

    const basePoints = [
      new THREE.Vector2(0.0, -2.1),
      new THREE.Vector2(1.38, -2.1),
      new THREE.Vector2(1.42, -1.9),
      new THREE.Vector2(1.22, -1.72),
      new THREE.Vector2(1.32, -1.52),
      new THREE.Vector2(1.05, -1.25),
      new THREE.Vector2(0.88, -0.95),
      new THREE.Vector2(1.02, -0.78),
      new THREE.Vector2(0.75, -0.55),
      new THREE.Vector2(0.0, -0.55)
    ];
    addPart(new THREE.LatheGeometry(basePoints, 10), [0, 0, 0]);

    this.knightBaseRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.36, 0.035, 12, 48),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe })
    );
    this.knightBaseRing.rotation.x = Math.PI / 2;
    this.knightBaseRing.position.y = -1.78;
    this.knightGroup.add(this.knightBaseRing);

    addPart(new THREE.CylinderGeometry(0.68, 0.88, 1.25, 7, 2), [0.08, -0.05, 0.05], [0, 0, -0.18], [1.05, 1, 0.82]);
    addPart(new THREE.CylinderGeometry(0.58, 0.72, 1.2, 7, 2), [-0.08, 0.85, 0.05], [0, 0, -0.32], [1.0, 1, 0.76]);
    addPart(new THREE.CylinderGeometry(0.48, 0.62, 1.0, 6, 1), [-0.15, 1.55, 0.05], [0, 0, -0.15], [0.95, 1, 0.72]);

    addPart(new THREE.DodecahedronGeometry(0.62, 0), [0.05, 1.92, 0.06], [0.1, 0.3, -0.2], [1.15, 0.95, 0.76]);
    addPart(new THREE.CylinderGeometry(0.28, 0.52, 1.15, 6, 1), [0.68, 1.65, 0.06], [0, 0, -1.18], [0.9, 1.0, 0.68]);
    addPart(new THREE.CylinderGeometry(0.18, 0.36, 0.85, 5, 1), [0.55, 1.38, 0.06], [0, 0, -1.05], [0.75, 1.0, 0.55]);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2a85 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
    eyeL.position.set(0.32, 2.02, 0.38);
    const eyeR = eyeL.clone();
    eyeR.position.set(0.32, 2.02, -0.26);
    this.knightGroup.add(eyeL, eyeR);

    const earGeo = new THREE.ConeGeometry(0.2, 0.62, 4);
    addPart(earGeo, [-0.1, 2.52, 0.24], [0.15, 0, 0.15]);
    addPart(earGeo, [-0.1, 2.52, -0.14], [-0.15, 0, 0.15]);

    const maneCoords = [
      { pos: [-0.38, 2.22, 0.05], rot: [0, 0, 0.55], scale: [0.45, 0.65, 0.42] },
      { pos: [-0.58, 1.82, 0.05], rot: [0, 0, 0.35], scale: [0.52, 0.7, 0.46] },
      { pos: [-0.68, 1.32, 0.05], rot: [0, 0, 0.15], scale: [0.56, 0.75, 0.48] },
      { pos: [-0.65, 0.78, 0.05], rot: [0, 0, -0.05], scale: [0.58, 0.75, 0.5] },
      { pos: [-0.52, 0.25, 0.05], rot: [0, 0, -0.25], scale: [0.55, 0.7, 0.48] },
      { pos: [-0.35, -0.22, 0.05], rot: [0, 0, -0.42], scale: [0.5, 0.65, 0.44] }
    ];
    const plateGeo = new THREE.OctahedronGeometry(0.55, 0);
    maneCoords.forEach((m) => addPart(plateGeo, m.pos, m.rot, m.scale));

    this.knightHoloRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.02, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.5 })
    );
    this.knightHoloRing.rotation.x = Math.PI / 2.4;
    this.knightHoloRing.position.y = 0.6;
    this.knightGroup.add(this.knightHoloRing);
  }

  /**
   * RIGHT 3D SCULPTURE: Interactive Cyber-Chrome & Alabaster Statue
   */
  _createCyberStatue() {
    this.statueGroup = new THREE.Group();
    this.statueGroup.position.set(2.5, -2.55, 1.0);
    this.statueGroup.rotation.set(0, -0.18, 0);
    this.stageGroup.add(this.statueGroup);

    this.statueAlabasterMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      emissive: 0x000000,
      roughness: 0.28,
      metalness: 0.35,
      clearcoat: 0.65
    });

    const creaseMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbd5e1,
      roughness: 0.35,
      metalness: 0.45,
      flatShading: true
    });

    const addSculpt = (geo, pos, rot = [0, 0, 0], scale = [1, 1, 1], useCrease = false) => {
      const m = new THREE.Mesh(geo, useCrease ? creaseMat : this.statueAlabasterMat);
      m.position.set(...pos);
      m.rotation.set(...rot);
      m.scale.set(...scale);
      m.castShadow = true;
      m.receiveShadow = true;
      m.userData = { isStatue: true };
      this.interactableMeshes.push(m);
      this.statueGroup.add(m);
      return m;
    };

    addSculpt(new THREE.CylinderGeometry(1.12, 1.24, 0.24, 48), [0, 0.12, 0]);
    addSculpt(new THREE.CylinderGeometry(1.02, 1.12, 0.12, 48), [0, 0.28, 0]);

    this.statueReactorRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.16, 0.035, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0xff2a85 })
    );
    this.statueReactorRing.rotation.x = Math.PI / 2;
    this.statueReactorRing.position.y = 0.24;
    this.statueGroup.add(this.statueReactorRing);

    addSculpt(new THREE.CapsuleGeometry(0.16, 0.35, 8, 16), [-0.36, 0.42, 0.12], [Math.PI / 2, 0, -0.1]);
    addSculpt(new THREE.CylinderGeometry(0.18, 0.16, 0.85, 14, 4), [-0.35, 0.82, 0], [0, 0, 0.04], [1, 1, 1], true);
    addSculpt(new THREE.CylinderGeometry(0.24, 0.19, 1.05, 14, 4), [-0.31, 1.72, 0.02], [0, 0, 0.05], [1, 1, 1], true);

    addSculpt(new THREE.CapsuleGeometry(0.16, 0.35, 8, 16), [0.36, 0.42, 0.08], [Math.PI / 2, 0, 0.12]);
    addSculpt(new THREE.CylinderGeometry(0.18, 0.16, 0.85, 14, 4), [0.35, 0.82, -0.02], [0, 0, -0.04], [1, 1, 1], true);
    addSculpt(new THREE.CylinderGeometry(0.24, 0.19, 1.05, 14, 4), [0.31, 1.72, 0], [0, 0, -0.05], [1, 1, 1], true);

    addSculpt(new THREE.CylinderGeometry(0.46, 0.44, 0.45, 16, 2), [0, 2.38, 0], [0, 0, 0], [1.05, 1, 0.72], true);
    addSculpt(new THREE.TorusGeometry(0.43, 0.045, 10, 32), [0, 2.52, 0], [Math.PI / 2, 0, 0], [1.06, 0.74, 1]);
    addSculpt(new THREE.TorusGeometry(0.44, 0.035, 10, 32), [0, 2.63, 0], [Math.PI / 2, 0.05, 0], [1.06, 0.74, 1]);
    addSculpt(new THREE.CylinderGeometry(0.58, 0.44, 1.35, 16, 5), [0, 3.32, 0], [0, 0, 0], [1.08, 1, 0.68], true);

    addSculpt(new THREE.TorusGeometry(0.24, 0.08, 12, 24), [0, 4.02, 0.04], [1.35, 0, 0], [1.1, 1.0, 0.9], true);
    addSculpt(new THREE.TorusGeometry(0.2, 0.065, 12, 24), [0, 4.14, 0.02], [1.45, 0, 0]);
    addSculpt(new THREE.BoxGeometry(0.24, 0.26, 0.08), [-0.24, 3.55, 0.34], [0, -0.15, 0]);
    addSculpt(new THREE.BoxGeometry(0.24, 0.26, 0.08), [0.24, 3.55, 0.34], [0, 0.15, 0]);

    addSculpt(new THREE.SphereGeometry(0.22, 16, 16), [-0.66, 3.82, 0]);
    addSculpt(new THREE.CylinderGeometry(0.16, 0.14, 0.78, 12, 3), [-0.74, 3.38, 0.02], [0.05, 0, 0.12], [1, 1, 1], true);
    addSculpt(new THREE.CylinderGeometry(0.14, 0.11, 0.75, 12, 3), [-0.78, 2.68, 0.1], [0.18, 0, 0.05], [1, 1, 1], true);
    addSculpt(new THREE.SphereGeometry(0.13, 12, 12), [-0.79, 2.24, 0.16], [0, 0, 0], [0.85, 1.15, 0.75]);

    addSculpt(new THREE.SphereGeometry(0.22, 16, 16), [0.66, 3.82, 0]);
    addSculpt(new THREE.CylinderGeometry(0.16, 0.14, 0.72, 12, 3), [0.86, 3.62, 0.08], [0.2, 0, -0.75], [1, 1, 1], true);
    addSculpt(new THREE.CylinderGeometry(0.13, 0.15, 0.74, 12, 3), [0.96, 4.08, 0.26], [-0.35, 0, 0.32], [1, 1, 1], true);
    addSculpt(new THREE.SphereGeometry(0.14, 14, 14), [0.82, 4.42, 0.36]);

    // Head + Visor Group so the head can track the user's cursor!
    this.statueHeadGroup = new THREE.Group();
    this.statueHeadGroup.position.set(0, 4.25, 0.02);
    this.statueGroup.add(this.statueHeadGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.35, 16), this.statueAlabasterMat);
    this.statueHeadGroup.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 24), this.statueAlabasterMat);
    head.position.set(0, 0.33, 0.03);
    head.scale.set(0.88, 1.12, 0.95);
    head.userData = { isStatue: true };
    this.interactableMeshes.push(head);
    this.statueHeadGroup.add(head);

    this.statueVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.085, 0.16),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe })
    );
    this.statueVisor.position.set(0, 0.39, 0.25);
    this.statueHeadGroup.add(this.statueVisor);

    const hairClusters = [
      [0, 0.61, 0.0, 0.24],
      [-0.18, 0.55, 0.06, 0.16],
      [0.18, 0.55, 0.06, 0.16],
      [-0.24, 0.4, -0.04, 0.15],
      [0.24, 0.4, -0.04, 0.15],
      [0, 0.47, -0.2, 0.22]
    ];
    hairClusters.forEach(([hx, hy, hz, hr]) => {
      const h = new THREE.Mesh(new THREE.DodecahedronGeometry(hr, 1), creaseMat);
      h.position.set(hx, hy, hz);
      this.statueHeadGroup.add(h);
    });

    const batGroup = new THREE.Group();
    batGroup.position.set(0.82, 4.44, 0.36);
    batGroup.rotation.set(0.15, -0.22, 1.22);
    this.statueGroup.add(batGroup);

    const batMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.055, 2.65, 20),
      this.statueAlabasterMat
    );
    batMesh.position.set(0, 0.75, 0);
    batGroup.add(batMesh);

    this.batGlowRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.145, 0.13, 0.42, 20),
      new THREE.MeshBasicMaterial({ color: 0xff2a85, wireframe: true })
    );
    this.batGlowRing.position.set(0, 1.55, 0);
    batGroup.add(this.batGlowRing);
  }

  /**
   * 3D SEQUENTIAL LINKED NODE CHAIN:
   * Positioned in a wide, clean 12-point Panoramic Arch around the stage
   * so none of the 12 floating labels ever overlap!
   */
  _createLinked3DNodeChain() {
    this.nodesGroup = new THREE.Group();
    this.scene.add(this.nodesGroup);

    // Hand-tuned 3D Panoramic Arch coordinates for all 12 nodes (Left -> Top -> Right)
    const archCoords = [
      new THREE.Vector3(-6.4, -1.5, 0.2),  // 01: RAG & GraphRAG
      new THREE.Vector3(-5.8,  0.1, -0.4), // 02: LLMs & Guardrails
      new THREE.Vector3(-4.9,  1.6, -1.0), // 03: Scikit-Learn, SHAP & ML Eval
      new THREE.Vector3(-3.6,  2.7, -1.4), // 04: OpenCV & TensorFlow Lite
      new THREE.Vector3(-2.0,  3.3, -1.6), // 05: Python & SQL
      new THREE.Vector3(-0.3,  3.5, -1.6), // 06: C++ & Java
      new THREE.Vector3( 1.4,  3.3, -1.6), // 07: Next.js 15, React.js & JS
      new THREE.Vector3( 3.1,  2.7, -1.4), // 08: FastAPI, Node.js, Express & Redis
      new THREE.Vector3( 4.5,  1.6, -1.0), // 09: PostgreSQL, Supabase & DB Design
      new THREE.Vector3( 5.5,  0.2, -0.4), // 10: Docker, Azure & CI/CD
      new THREE.Vector3( 6.1, -1.2,  0.2), // 11: Vercel & Render Cloud Deployment
      new THREE.Vector3( 4.8, -2.2,  1.1)  // 12: Git, GitHub, VS Code & Postman
    ];

    this.chainPoints = [];

    this.skills.forEach((skill, idx) => {
      const group = new THREE.Group();
      const pos = archCoords[idx] || new THREE.Vector3((idx - 5.5) * 1.1, 2.0, -1.0);
      group.position.copy(pos);
      this.chainPoints.push(pos);

      const nodeColor = new THREE.Color(skill.color || 0x00f2fe);

      const mat = new THREE.MeshPhysicalMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.55,
        roughness: 0.15,
        metalness: 0.75,
        clearcoat: 1.0,
        flatShading: true,
        transparent: true,
        opacity: 0.95
      });

      const geo = new THREE.OctahedronGeometry(0.42, 0);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { skillId: skill.id, sequenceIndex: idx + 1 };
      this.interactableMeshes.push(mesh);
      group.add(mesh);

      const cage = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.6, 0),
        new THREE.MeshBasicMaterial({
          color: nodeColor,
          wireframe: true,
          transparent: true,
          opacity: 0.38
        })
      );
      group.add(cage);

      group.userData = {
        skill,
        mesh,
        cage,
        basePos: pos.clone(),
        sequenceIndex: idx + 1,
        nodeColor
      };

      this.nodesGroup.add(group);
      this.nodeMeshes.set(skill.id, group);

      if (this.labelsContainer) {
        const label = document.createElement('button');
        label.className = 'node-label-3d';
        label.dataset.skillId = skill.id;
        label.dataset.category = skill.category;
        label.style.setProperty('--node-color', skill.color);
        label.innerHTML = `
          <span class="node-seq-num">${String(idx + 1).padStart(2, '0')}</span>
          <span class="node-name">${skill.name}</span>
        `;
        label.addEventListener('click', (e) => {
          e.stopPropagation();
          this.stopAutoTour();
          this.selectSkill(skill.id);
        });
        label.addEventListener('mouseenter', () => {
          this.setHoveredSkill(skill.id);
        });
        label.addEventListener('mouseleave', () => {
          this.setHoveredSkill(null);
        });
        this.labelsContainer.appendChild(label);
        this.labelElements.set(skill.id, label);
      }
    });

    if (this.chainPoints.length > 1) {
      this.chainCurve = new THREE.CatmullRomCurve3(this.chainPoints);
      const tubeGeo = new THREE.TubeGeometry(this.chainCurve, 140, 0.032, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending
      });
      this.chainTubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(this.chainTubeMesh);

      for (let i = 0; i < 10; i++) {
        const pulseMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 12, 12),
          new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xff2a85 : 0x00f2fe
          })
        );
        this.scene.add(pulseMesh);
        this.chainPulses.push({
          mesh: pulseMesh,
          t: i / 10,
          speed: 0.12
        });
      }
    }
  }

  /**
   * 3D Target Reticle Ring that locks onto whichever 3D Node is selected/hovered
   */
  _createTargetReticle() {
    this.reticleGroup = new THREE.Group();
    this.reticleGroup.visible = false;
    this.scene.add(this.reticleGroup);

    const r1 = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 0.82, 32),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, side: THREE.DoubleSide })
    );
    const r2 = new THREE.Mesh(
      new THREE.RingGeometry(0.92, 0.96, 6),
      new THREE.MeshBasicMaterial({ color: 0xff2a85, side: THREE.DoubleSide })
    );
    this.reticleGroup.add(r1, r2);
  }

  /**
   * Spawn an expanding 3D Neon Shockwave Ring at a given position
   */
  spawnShockwave(origin = new THREE.Vector3(0, 0, 0), hexColor = 0x00f2fe) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.58, 48),
      new THREE.MeshBasicMaterial({
        color: hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      })
    );
    ring.position.copy(origin);
    this.scene.add(ring);
    this.shockwaves.push({ mesh: ring, scale: 1.0, opacity: 0.95 });
  }

  /**
   * Sequential Auto-Tour across all 12 3D Nodes!
   */
  toggleAutoTour(onTourStep) {
    if (this.isAutoTouring) {
      this.stopAutoTour();
      return false;
    }
    this.isAutoTouring = true;
    const step = () => {
      if (!this.isAutoTouring) return;
      const skill = this.skills[this.autoTourIndex];
      if (skill) {
        this.selectSkill(skill.id);
        if (onTourStep) onTourStep(skill, this.autoTourIndex, this.skills.length);
      }
      this.autoTourIndex = (this.autoTourIndex + 1) % this.skills.length;
      this.autoTourTimer = setTimeout(step, 3400);
    };
    step();
    return true;
  }

  stopAutoTour() {
    this.isAutoTouring = false;
    if (this.autoTourTimer) {
      clearTimeout(this.autoTourTimer);
      this.autoTourTimer = null;
    }
  }

  /**
   * Step forward (+1) or backward (-1) along the 12-node 3D chain
   */
  stepSkillChain(delta = 1) {
    this.stopAutoTour();
    const currentIdx = this.skills.findIndex((s) => s.id === this.selectedSkillId);
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + delta + this.skills.length) % this.skills.length;
    this.selectSkill(this.skills[nextIdx].id);
  }

  setTimelineProgress(progress) {
    this.timelineProgress = Math.max(0, Math.min(1, progress));
    if (this.onTimelineUpdate) {
      this.onTimelineUpdate(this.timelineProgress);
    }
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    return this.isPlaying;
  }

  selectSkill(skillId) {
    this.selectedSkillId = skillId;
    this.highlightedSet = null;

    if (!skillId || !this.nodeMeshes.has(skillId)) {
      this.selectedSkillId = null;
      this.reticleGroup.visible = false;
      this.flyToPosition(new THREE.Vector3(0, 0.7, 14.2), new THREE.Vector3(0, 0.2, 0));
      if (this.onSelectSkill) this.onSelectSkill(null);
      return;
    }

    this.showConstellation = true;
    const group = this.nodeMeshes.get(skillId);
    const skill = group.userData.skill;
    const targetPos = group.position.clone();
    const camPos = targetPos.clone().add(new THREE.Vector3(0, 0.3, 4.8));

    this.spawnShockwave(targetPos, skill.color);
    this.flyToPosition(camPos, targetPos);
    if (this.onSelectSkill) this.onSelectSkill(skill);
  }

  setHoveredSkill(skillId) {
    if (this.hoveredSkillId === skillId) return;
    this.hoveredSkillId = skillId;
    this.canvas.style.cursor = skillId ? 'pointer' : 'grab';
    if (this.onHoverSkill) {
      const node = skillId ? this.nodeMeshes.get(skillId) : null;
      this.onHoverSkill(node ? node.userData.skill : null);
    }
  }

  setCategoryFilter(category) {
    this.stopAutoTour();
    this.activeFilter = category;
    this.highlightedSet = null;
    this.showConstellation = true;
    if (category === 'all') {
      this.selectSkill(null);
    } else {
      this.flyToPosition(new THREE.Vector3(0, 1.0, 14.5), new THREE.Vector3(0, 0.4, 0));
    }
  }

  highlightProjectSkills(skillIds) {
    this.stopAutoTour();
    this.selectedSkillId = null;
    this.activeFilter = 'all';
    this.showConstellation = true;
    this.highlightedSet = skillIds ? new Set(skillIds) : null;
    this.spawnShockwave(new THREE.Vector3(0, 0.5, 0), 0xff2a85);
    this.flyToPosition(new THREE.Vector3(0, 1.0, 14.8), new THREE.Vector3(0, 0.3, 0));
  }

  triggerNeuralPulse() {
    this.spawnShockwave(this.knightGroup.position.clone().add(new THREE.Vector3(0, 1, 0)), 0x00f2fe);
    this.spawnShockwave(this.statueGroup.position.clone().add(new THREE.Vector3(0, 3, 0)), 0xff2a85);
    this.chainPulses.forEach((p) => {
      p.speed = 0.45;
      setTimeout(() => {
        p.speed = 0.12;
      }, 1400);
    });
  }

  flyToPosition(camPos, targetPos, duration = 0.95) {
    if (window.gsap) {
      window.gsap.to(this.camera.position, {
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
        duration,
        ease: 'power3.out'
      });
      window.gsap.to(this.controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration,
        ease: 'power3.out'
      });
    } else {
      this.camera.position.copy(camPos);
      this.controls.target.copy(targetPos);
    }
  }

  setCameraPreset(preset) {
    this.stopAutoTour();
    this.selectedSkillId = null;
    if (this.onSelectSkill) this.onSelectSkill(null);

    switch (preset) {
      case 'knight':
        this.spawnShockwave(new THREE.Vector3(-2.5, 0.6, 1.0), 0x00f2fe);
        this.flyToPosition(new THREE.Vector3(-2.5, 0.6, 7.2), new THREE.Vector3(-2.5, 0.4, 1.0));
        if (this.onSculptureClick) this.onSculptureClick('knight');
        break;
      case 'statue':
        this.spawnShockwave(new THREE.Vector3(2.5, 0.8, 1.0), 0xff2a85);
        this.flyToPosition(new THREE.Vector3(2.5, 0.8, 7.6), new THREE.Vector3(2.5, 0.4, 1.0));
        if (this.onSculptureClick) this.onSculptureClick('statue');
        break;
      case 'constellation':
        this.showConstellation = true;
        this.flyToPosition(new THREE.Vector3(0, 1.4, 15.6), new THREE.Vector3(0, 0.5, -0.5));
        break;
      case 'overview':
      default:
        this.activeFilter = 'all';
        this.highlightedSet = null;
        this.flyToPosition(new THREE.Vector3(0, 0.7, 14.2), new THREE.Vector3(0, 0.2, 0));
        break;
    }
  }

  _updateLabelsProjection() {
    if (!this.labelsContainer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const halfW = width / 2;
    const halfH = height / 2;
    const tempV = new THREE.Vector3();

    this.nodeMeshes.forEach((group, skillId) => {
      const label = this.labelElements.get(skillId);
      if (!label) return;

      if (!this.showConstellation) {
        label.style.opacity = '0';
        label.style.pointerEvents = 'none';
        return;
      }

      tempV.copy(group.position);
      tempV.y += 0.62;
      tempV.project(this.camera);

      if (tempV.z > 1) {
        label.style.opacity = '0';
        label.style.pointerEvents = 'none';
        return;
      }

      const x = tempV.x * halfW + halfW;
      const y = -(tempV.y * halfH) + halfH;
      label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      const skill = group.userData.skill;
      const matchesFilter =
        this.activeFilter === 'all' || skill.category === this.activeFilter;
      const matchesProject =
        !this.highlightedSet || this.highlightedSet.has(skillId);

      label.style.opacity = matchesFilter && matchesProject ? '1' : '0.18';
      label.style.pointerEvents = 'auto';
      label.classList.toggle('is-active', skillId === this.selectedSkillId);
    });
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let pointerDownPos = { x: 0, y: 0 };

    this.canvas.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      this.prevPointerX = e.clientX;

      const hit = this._raycastAt(e.clientX, e.clientY);
      if (hit) {
        if (hit.userData.isKnight) {
          this.draggingSculpture = 'knight';
          this.controls.enabled = false;
        } else if (hit.userData.isStatue) {
          this.draggingSculpture = 'statue';
          this.controls.enabled = false;
        }
      }
    });

    window.addEventListener('pointermove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Move 3D interactive cursor light
      if (this.cursorLight) {
        this.cursorLight.position.set(this.targetMouse.x * 7, this.targetMouse.y * 4, 4.5);
      }

      // Direct Drag-to-Spin on Knight or Statue!
      if (this.draggingSculpture) {
        const dx = e.clientX - this.prevPointerX;
        this.prevPointerX = e.clientX;
        if (this.draggingSculpture === 'knight') {
          this.knightSpinOffset += dx * 0.015;
        } else if (this.draggingSculpture === 'statue') {
          this.statueSpinOffset += dx * 0.015;
        }
        return;
      }

      // Hover raycasting
      const hit = this._raycastAt(e.clientX, e.clientY);
      if (hit) {
        if (hit.userData.skillId && this.showConstellation) {
          this.hoveredSculpture = null;
          this.setHoveredSkill(hit.userData.skillId);
        } else if (hit.userData.isKnight) {
          this.setHoveredSkill(null);
          this.hoveredSculpture = 'knight';
          this.canvas.style.cursor = 'grab';
        } else if (hit.userData.isStatue) {
          this.setHoveredSkill(null);
          this.hoveredSculpture = 'statue';
          this.canvas.style.cursor = 'grab';
        }
      } else {
        this.hoveredSculpture = null;
        this.setHoveredSkill(null);
      }
    });

    window.addEventListener('pointerup', (e) => {
      this.controls.enabled = true;
      const wasDraggingSculpture = this.draggingSculpture;
      this.draggingSculpture = null;

      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;

      const hit = this._raycastAt(e.clientX, e.clientY);
      if (hit) {
        if (hit.userData.skillId && this.showConstellation) {
          this.stopAutoTour();
          this.selectSkill(hit.userData.skillId);
        } else if (hit.userData.isKnight || wasDraggingSculpture === 'knight') {
          this.setCameraPreset('knight');
        } else if (hit.userData.isStatue || wasDraggingSculpture === 'statue') {
          this.setCameraPreset('statue');
        }
      }
    });
  }

  _raycastAt(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const m = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(m, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactableMeshes, false);
    return intersects.length > 0 ? intersects[0].object : null;
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    this.mouse.lerp(this.targetMouse, 0.08);

    if (this.isPlaying) {
      this.timelineProgress += dt * 0.02;
      if (this.timelineProgress > 1) this.timelineProgress = 0.08;
      if (this.onTimelineUpdate) {
        this.onTimelineUpdate(this.timelineProgress);
      }
    }

    const phase = (this.timelineProgress - 0.65) * Math.PI * 1.1;

    // 1. Animate Cyber-Obsidian Knight (Hover glow + Spin + Mouse tracking)
    if (this.knightGroup) {
      const isHovered = this.hoveredSculpture === 'knight';
      this.knightGroup.position.y = -0.55 + Math.sin(elapsed * 1.6) * 0.14;
      this.knightGroup.rotation.y =
        0.55 + phase * 0.45 + this.mouse.x * 0.35 + this.knightSpinOffset;
      this.knightGroup.rotation.z =
        0.2 + Math.cos(elapsed * 1.1) * 0.04 - this.mouse.y * 0.1;

      this.knightWireMat.opacity = isHovered ? 0.65 : 0.25;
      this.knightHoloRing.rotation.z += dt * (isHovered ? 2.4 : 0.8);
    }

    // 2. Animate Cyber Statue (Head tracks cursor + Hover visor glow + Spin)
    if (this.statueGroup) {
      const isHovered = this.hoveredSculpture === 'statue';
      this.statueGroup.rotation.y =
        -0.18 - phase * 0.3 + this.mouse.x * 0.22 + this.statueSpinOffset;
      this.statueGroup.position.y = -2.55 + Math.cos(elapsed * 1.2) * 0.05;

      if (this.statueHeadGroup) {
        this.statueHeadGroup.rotation.y = this.mouse.x * 0.35;
        this.statueHeadGroup.rotation.x = -this.mouse.y * 0.2;
      }
      if (this.batGlowRing) {
        this.batGlowRing.rotation.y += dt * (isHovered ? 3.5 : 1.0);
      }
    }

    // 3. Animate Expanding Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.scale += dt * 14;
      sw.opacity *= 0.91;
      sw.mesh.scale.set(sw.scale, sw.scale, 1);
      sw.mesh.material.opacity = sw.opacity;
      sw.mesh.lookAt(this.camera.position);
      if (sw.opacity < 0.02) {
        this.scene.remove(sw.mesh);
        this.shockwaves.splice(i, 1);
      }
    }

    // 4. Animate Target Reticle
    const focusId = this.hoveredSkillId || this.selectedSkillId;
    if (focusId && this.nodeMeshes.has(focusId)) {
      const targetNode = this.nodeMeshes.get(focusId);
      this.reticleGroup.visible = true;
      this.reticleGroup.position.copy(targetNode.position);
      this.reticleGroup.lookAt(this.camera.position);
      this.reticleGroup.rotation.z += dt * 1.8;
    } else {
      this.reticleGroup.visible = false;
    }

    // 5. Animate 3D Sequential Linked Node Chain & Pulses
    if (this.chainTubeMesh) {
      this.chainTubeMesh.visible = this.showConstellation;
    }

    if (this.chainCurve) {
      this.chainPulses.forEach((p) => {
        p.mesh.visible = this.showConstellation;
        p.t = (p.t + dt * p.speed) % 1.0;
        const pt = this.chainCurve.getPointAt(p.t);
        p.mesh.position.copy(pt);
      });
    }

    this.nodeMeshes.forEach((group, skillId) => {
      const { skill, mesh, cage, basePos } = group.userData;
      group.position.y = basePos.y + Math.sin(elapsed * 2.0 + group.userData.sequenceIndex) * 0.12;

      mesh.rotation.x += dt * 0.65;
      mesh.rotation.y += dt * 0.85;
      cage.rotation.y -= dt * 0.5;

      const matchesFilter =
        this.activeFilter === 'all' || skill.category === this.activeFilter;
      const matchesProject =
        !this.highlightedSet || this.highlightedSet.has(skillId);
      const visible = this.showConstellation && matchesFilter && matchesProject;

      const isFocused =
        skillId === this.selectedSkillId ||
        skillId === this.hoveredSkillId ||
        (this.highlightedSet && this.highlightedSet.has(skillId));

      const targetScale = isFocused ? 1.48 : visible ? 1.0 : 0.55;
      group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.14);

      mesh.material.opacity = visible ? 0.96 : this.showConstellation ? 0.14 : 0.0;
      cage.material.opacity = isFocused ? 0.9 : visible ? 0.35 : 0.04;
    });

    this.controls.update();
    this._updateLabelsProjection();
    this.renderer.render(this.scene, this.camera);
  }
}
