import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// ============================================
// COUNTY DATA - Northampton County, Pennsylvania
// Population data: 2020 U.S. Census
// County seat: Easton (est. 1752 from Bucks County)
// Total county population: 312,951 (2020 Census)
// Sources: census.gov, norcopa.gov, Wikipedia
// ============================================

// Municipalities and townships with audit data
// Note: Audit findings are illustrative based on typical
// Controller's Office audit categories (P-Card, ACL Vendor reviews, etc.)
const countyZones = [
  // Cities (2 total in Northampton County)
  { id: 'bethlehem', name: 'Bethlehem', type: 'city', population: 77069,
    position: [0, 0, 0], size: [12, 12], risk: 'low',
    findings: 1, compliance: 92, lastAudit: '2025-09',
    note: 'Spans Lehigh & Northampton counties. 7th largest city in PA.',
    auditFindings: [
      { type: 'fiscal', desc: 'P-Card fixed-asset threshold exceeded (4 items)', severity: 'low' }
    ]},
  { id: 'easton', name: 'Easton (County Seat)', type: 'city', population: 29538,
    position: [25, 0, -5], size: [10, 10], risk: 'low',
    findings: 0, compliance: 96, lastAudit: '2025-11',
    note: 'County seat since 1752. Home to Lafayette College.',
    auditFindings: [] },

  // Boroughs (21 total - showing major ones)
  { id: 'nazareth', name: 'Nazareth', type: 'borough', population: 6053,
    position: [-15, 0, 10], size: [6, 6], risk: 'low',
    note: 'Home of Martin Guitars since 1839.',
    findings: 0, compliance: 98, lastAudit: '2025-10', auditFindings: [] },
  { id: 'bangor', name: 'Bangor', type: 'borough', population: 5187,
    position: [-25, 0, -15], size: [5, 5], risk: 'medium',
    note: 'Historic slate industry center.',
    findings: 2, compliance: 84, lastAudit: '2025-08',
    auditFindings: [
      { type: 'fiscal', desc: 'ACL review: check numbering gaps identified', severity: 'low' },
      { type: 'reporting', desc: 'Bank reconciliation delays', severity: 'medium' }
    ]},
  { id: 'bath', name: 'Bath', type: 'borough', population: 2808,
    position: [-8, 0, -20], size: [4, 4], risk: 'low',
    findings: 0, compliance: 96, lastAudit: '2025-07', auditFindings: [] },
  { id: 'wilson', name: 'Wilson', type: 'borough', population: 8259,
    position: [12, 0, 8], size: [6, 5], risk: 'low',
    note: 'Adjacent to Easton.',
    findings: 1, compliance: 91, lastAudit: '2025-10',
    auditFindings: [
      { type: 'internal', desc: 'IT access controls review recommended', severity: 'low' }
    ]},
  { id: 'hellertown', name: 'Hellertown', type: 'borough', population: 6131,
    position: [5, 0, 20], size: [5, 5], risk: 'low',
    note: 'Part of Lehigh Valley metro area.',
    findings: 0, compliance: 94, lastAudit: '2025-09', auditFindings: [] },
  { id: 'northampton-boro', name: 'Northampton', type: 'borough', population: 10395,
    position: [-5, 0, -8], size: [7, 6], risk: 'low',
    note: 'Incorporated 1902. Former "Cement Capital of the World".',
    findings: 1, compliance: 89, lastAudit: '2025-06',
    auditFindings: [
      { type: 'fiscal', desc: 'Pension funding actuarial review scheduled', severity: 'low' }
    ]},
  { id: 'pen-argyl', name: 'Pen Argyl', type: 'borough', population: 3596,
    position: [-28, 0, -20], size: [4, 4], risk: 'low',
    note: 'Named for slate (argillite) deposits.',
    findings: 0, compliance: 93, lastAudit: '2025-05', auditFindings: [] },
  { id: 'wind-gap', name: 'Wind Gap', type: 'borough', population: 2728,
    position: [-32, 0, -8], size: [4, 4], risk: 'low',
    note: 'Named for gap in Blue Mountain ridge.',
    findings: 0, compliance: 95, lastAudit: '2025-04', auditFindings: [] },
  { id: 'freemansburg', name: 'Freemansburg', type: 'borough', population: 2636,
    position: [3, 0, 5], size: [3, 3], risk: 'low',
    findings: 0, compliance: 94, lastAudit: '2025-08', auditFindings: [] },

  // Townships (15 total)
  { id: 'bethlehem-twp', name: 'Bethlehem Township', type: 'township', population: 25989,
    position: [8, 0, -12], size: [14, 12], risk: 'low',
    findings: 0, compliance: 95, lastAudit: '2025-11', auditFindings: [] },
  { id: 'lower-saucon', name: 'Lower Saucon Township', type: 'township', population: 11077,
    position: [18, 0, 15], size: [12, 10], risk: 'low',
    note: 'Incorporated 1743. Approx. 25 sq miles.',
    findings: 0, compliance: 97, lastAudit: '2025-10', auditFindings: [] },
  { id: 'forks', name: 'Forks Township', type: 'township', population: 16293,
    position: [30, 0, 8], size: [13, 11], risk: 'low',
    findings: 1, compliance: 90, lastAudit: '2025-09',
    auditFindings: [
      { type: 'procurement', desc: 'Professional services documentation review', severity: 'low' }
    ]},
  { id: 'palmer', name: 'Palmer Township', type: 'township', population: 22317,
    position: [20, 0, -15], size: [14, 12], risk: 'low',
    note: 'Founded 1857. Named for surveyor George Palmer.',
    findings: 1, compliance: 91, lastAudit: '2025-07',
    auditFindings: [
      { type: 'fiscal', desc: 'ACL review: duplicate vendor payment identified (refund requested)', severity: 'low' }
    ]},
  { id: 'williams', name: 'Williams Township', type: 'township', population: 6575,
    position: [35, 0, -8], size: [10, 9], risk: 'low',
    note: 'Est. 1750. Rolling hills, farmland, woodland.',
    findings: 0, compliance: 95, lastAudit: '2025-08', auditFindings: [] },
  { id: 'upper-nazareth', name: 'Upper Nazareth Township', type: 'township', population: 8127,
    position: [-18, 0, 0], size: [11, 10], risk: 'low',
    note: 'Part of historic Barony of Nazareth (25,000 acres).',
    findings: 0, compliance: 93, lastAudit: '2025-10', auditFindings: [] },
  { id: 'lower-nazareth', name: 'Lower Nazareth Township', type: 'township', population: 7081,
    position: [-12, 0, -5], size: [9, 8], risk: 'low',
    findings: 0, compliance: 94, lastAudit: '2025-09', auditFindings: [] },
  { id: 'plainfield', name: 'Plainfield Township', type: 'township', population: 6257,
    position: [-30, 0, 5], size: [12, 11], risk: 'low',
    note: 'Organized 1762. Split from Bushkill.',
    findings: 1, compliance: 89, lastAudit: '2025-08',
    auditFindings: [
      { type: 'reporting', desc: 'Account coding consistency review', severity: 'low' }
    ]},
  { id: 'bushkill', name: 'Bushkill Township', type: 'township', population: 8589,
    position: [-35, 0, -10], size: [14, 13], risk: 'low',
    findings: 0, compliance: 92, lastAudit: '2025-07', auditFindings: [] },
    position: [-28, 0, -25], size: [15, 14], risk: 'low',
    findings: 0, compliance: 91, lastAudit: '2025-06', auditFindings: [] },
  { id: 'lehigh', name: 'Lehigh Township', type: 'township', population: 10766,
    position: [-20, 0, -20], size: [13, 12], risk: 'low',
    findings: 0, compliance: 93, lastAudit: '2025-09', auditFindings: [] },
  { id: 'allen', name: 'Allen Township', type: 'township', population: 5479,
    position: [-8, 0, -15], size: [8, 7], risk: 'low',
    note: 'Est. 1748. Named for Chief Justice William Allen.',
    findings: 0, compliance: 94, lastAudit: '2025-05', auditFindings: [] },
  { id: 'east-allen', name: 'East Allen Township', type: 'township', population: 5094,
    position: [-15, 0, -12], size: [8, 7], risk: 'low',
    findings: 0, compliance: 92, lastAudit: '2025-04', auditFindings: [] },
  { id: 'hanover', name: 'Hanover Township', type: 'township', population: 11549,
    position: [-3, 0, -18], size: [10, 9], risk: 'low',
    findings: 0, compliance: 94, lastAudit: '2025-06', auditFindings: [] },
  { id: 'lower-mt-bethel', name: 'Lower Mt. Bethel Township', type: 'township', population: 3271,
    position: [40, 0, 0], size: [12, 11], risk: 'low',
    note: 'Along Delaware River.',
    findings: 0, compliance: 91, lastAudit: '2025-03', auditFindings: [] },
  { id: 'upper-mt-bethel', name: 'Upper Mt. Bethel Township', type: 'township', population: 7012,
    position: [42, 0, -12], size: [13, 12], risk: 'low',
    findings: 0, compliance: 90, lastAudit: '2025-02', auditFindings: [] },
];

// Row Officers at County Courthouse - 669 Washington St, Easton, PA 18042
// Note: Northampton County operates under Home Rule Charter (1978)
// Some positions are appointed rather than elected
// Source: norcopa.gov, ballotpedia.org, paauditor.gov
const rowOfficers = [
  { id: 'controller', name: 'Controller - Tara Zrinski', position: [25, 0, -3], color: 0x4a9eff,
    note: 'Elected 2023. Former County Council member. Fiscal watchdog.' },
  { id: 'fiscal', name: 'Fiscal Affairs', position: [27, 0, -3], color: 0x4a9eff,
    note: 'Dept. of Fiscal Affairs handles treasury functions under Home Rule.' },
  { id: 'sheriff', name: 'Sheriff - Christopher Zieger', position: [23, 0, -5], color: 0x4a9eff,
    note: 'Appointed 2024. 30 years with Sheriff Dept. Succeeded Richard Johnston.' },
  { id: 'recorder', name: 'Recorder of Deeds - Dorothy Edelman', position: [27, 0, -7], color: 0x4a9eff,
    note: '669 Washington St, Easton. Land records since 1752.' },
  { id: 'register', name: 'Register of Wills - Patricia J. Manento', position: [23, 0, -7], color: 0x4a9eff,
    note: 'Estate documents, inheritance tax. Records from 1752.' },
  { id: 'prothonotary', name: 'Prothonotary - Holly Ruggiero', position: [25, 0, -7], color: 0x4a9eff,
    note: 'Appointed (not elected in Northampton Co.). Civil court records.' },
  { id: 'clerk', name: 'Clerk of Courts - Leigh Ann Fisher', position: [29, 0, -5], color: 0x4a9eff,
    note: 'Criminal Division records. Appointed under Home Rule.' },
  { id: 'da', name: 'District Attorney - Stephen Baratta', position: [21, 0, -5], color: 0x4a9eff,
    note: 'Elected 2023. Former judge, 25 years on bench.' },
  { id: 'coroner', name: 'Coroner - Zachary Lysek', position: [21, 0, -7], color: 0x4a9eff,
    note: 'PA State Coroners Assoc. Board Member. Class 3, Region 4.' },
];

// Risk colors
const riskColors = {
  high: 0xff4757,
  medium: 0xffa502,
  low: 0x2ed573
};

// ============================================
// THREE.JS SETUP
// ============================================

let scene, camera, renderer, controls;
let walkMode = false;
let walkControls;
let raycaster, mouse;
let zoneMeshes = [];
let officerMeshes = [];
let selectedZone = null;

// Movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);
  scene.fog = new THREE.Fog(0x0a0a1a, 50, 150);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 60);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('container').appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minDistance = 10;
  controls.maxDistance = 120;

  // Walk controls (for first-person mode)
  walkControls = new PointerLockControls(camera, document.body);

  // Raycaster for selection
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Lighting
  setupLighting();

  // Ground
  createGround();

  // Create county zones
  createZones();

  // Create row officer buildings
  createOfficerBuildings();

  // Grid overlay
  createGrid();

  // Roads/connections
  createRoads();

  // Event listeners
  window.addEventListener('resize', onResize);
  renderer.domElement.addEventListener('click', onClick);
  renderer.domElement.addEventListener('mousemove', onMouseMove);

  // Control buttons
  document.getElementById('btn-reset').addEventListener('click', resetView);
  document.getElementById('btn-top').addEventListener('click', topView);
  document.getElementById('btn-walk').addEventListener('click', toggleWalkMode);
  document.getElementById('btn-layers').addEventListener('click', toggleLayers);

  // Keyboard
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Hide loading
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 500);

  // Start animation
  animate();

  // Init minimap
  initMinimap();
}

function setupLighting() {
  // Ambient
  const ambient = new THREE.AmbientLight(0x404060, 0.5);
  scene.add(ambient);

  // Directional (sun)
  const sun = new THREE.DirectionalLight(0xffffee, 1);
  sun.position.set(50, 100, 50);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 200;
  sun.shadow.camera.left = -80;
  sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  scene.add(sun);

  // Hemisphere
  const hemi = new THREE.HemisphereLight(0x606080, 0x404040, 0.4);
  scene.add(hemi);
}

function createGround() {
  // Main ground plane
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a2e,
    roughness: 0.9,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // Water (Lehigh/Delaware rivers)
  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x1a3a5c,
    roughness: 0.3,
    metalness: 0.5,
    transparent: true,
    opacity: 0.8
  });

  // Lehigh River (curves through county)
  const riverPath = new THREE.CurvePath();
  riverPath.add(new THREE.LineCurve3(
    new THREE.Vector3(-40, -0.05, 25),
    new THREE.Vector3(10, -0.05, 15)
  ));
  riverPath.add(new THREE.LineCurve3(
    new THREE.Vector3(10, -0.05, 15),
    new THREE.Vector3(30, -0.05, 0)
  ));

  const riverGeo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-50, -0.05, 25),
      new THREE.Vector3(-20, -0.05, 20),
      new THREE.Vector3(0, -0.05, 15),
      new THREE.Vector3(15, -0.05, 5),
      new THREE.Vector3(35, -0.05, -2),
      new THREE.Vector3(50, -0.05, -5)
    ]),
    50, 2, 8, false
  );
  const river = new THREE.Mesh(riverGeo, riverMat);
  scene.add(river);
}

function createZones() {
  countyZones.forEach(zone => {
    const color = riskColors[zone.risk];

    // Zone base
    const geo = new THREE.BoxGeometry(zone.size[0], 0.5, zone.size[1]);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.3,
      transparent: true,
      opacity: 0.7
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(zone.position[0], 0.25, zone.position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { type: 'zone', data: zone };

    scene.add(mesh);
    zoneMeshes.push(mesh);

    // Glow ring for high risk
    if (zone.risk === 'high') {
      const ringGeo = new THREE.RingGeometry(
        Math.max(zone.size[0], zone.size[1]) / 2 + 0.5,
        Math.max(zone.size[0], zone.size[1]) / 2 + 1,
        32
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(zone.position[0], 0.1, zone.position[2]);
      scene.add(ring);

      // Animate glow
      mesh.userData.ring = ring;
    }

    // Zone label
    createLabel(zone.name, zone.position[0], 2, zone.position[2], zone.type);

    // Building indicators based on population
    const buildingCount = Math.floor(zone.population / 5000);
    for (let i = 0; i < Math.min(buildingCount, 8); i++) {
      const bx = zone.position[0] + (Math.random() - 0.5) * zone.size[0] * 0.7;
      const bz = zone.position[2] + (Math.random() - 0.5) * zone.size[1] * 0.7;
      const bh = 1 + Math.random() * 2;

      const buildGeo = new THREE.BoxGeometry(0.8, bh, 0.8);
      const buildMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a4a,
        roughness: 0.8
      });
      const building = new THREE.Mesh(buildGeo, buildMat);
      building.position.set(bx, bh / 2 + 0.5, bz);
      building.castShadow = true;
      scene.add(building);
    }
  });
}

function createOfficerBuildings() {
  rowOfficers.forEach(officer => {
    // County building
    const buildGeo = new THREE.BoxGeometry(1.5, 4, 1.5);
    const buildMat = new THREE.MeshStandardMaterial({
      color: officer.color,
      roughness: 0.5,
      metalness: 0.5,
      emissive: officer.color,
      emissiveIntensity: 0.2
    });

    const mesh = new THREE.Mesh(buildGeo, buildMat);
    mesh.position.set(officer.position[0], 2.5, officer.position[2]);
    mesh.castShadow = true;
    mesh.userData = { type: 'officer', data: officer };

    scene.add(mesh);
    officerMeshes.push(mesh);

    // Beacon light
    const beaconGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: officer.color,
      transparent: true,
      opacity: 0.8
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(officer.position[0], 5, officer.position[2]);
    scene.add(beacon);
    mesh.userData.beacon = beacon;

    // Point light
    const light = new THREE.PointLight(officer.color, 0.5, 10);
    light.position.copy(beacon.position);
    scene.add(light);
  });
}

function createLabel(text, x, y, z, type) {
  // Create sprite-based label
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;

  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.roundRect(0, 0, 256, 64, 8);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, 128, 28);

  ctx.fillStyle = '#888';
  ctx.font = '12px sans-serif';
  ctx.fillText(type.toUpperCase(), 128, 48);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(x, y, z);
  sprite.scale.set(8, 2, 1);
  scene.add(sprite);
}

function createGrid() {
  const gridHelper = new THREE.GridHelper(200, 40, 0x333355, 0x222244);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);
}

function createRoads() {
  // Main roads connecting municipalities
  const roadMat = new THREE.MeshBasicMaterial({
    color: 0x333344,
    transparent: true,
    opacity: 0.6
  });

  // Route 22 (east-west)
  const road22Geo = new THREE.PlaneGeometry(100, 1);
  const road22 = new THREE.Mesh(road22Geo, roadMat);
  road22.rotation.x = -Math.PI / 2;
  road22.position.set(0, 0.05, 0);
  scene.add(road22);

  // Route 33 (north-south)
  const road33Geo = new THREE.PlaneGeometry(80, 1);
  const road33 = new THREE.Mesh(road33Geo, roadMat);
  road33.rotation.x = -Math.PI / 2;
  road33.rotation.z = Math.PI / 2;
  road33.position.set(-15, 0.05, -5);
  scene.add(road33);

  // Route 191
  const road191Geo = new THREE.PlaneGeometry(60, 0.8);
  const road191 = new THREE.Mesh(road191Geo, roadMat);
  road191.rotation.x = -Math.PI / 2;
  road191.rotation.z = Math.PI / 4;
  road191.position.set(15, 0.05, 5);
  scene.add(road191);
}

// ============================================
// MINIMAP
// ============================================

let minimapCtx;

function initMinimap() {
  const canvas = document.getElementById('minimap-canvas');
  canvas.width = 180;
  canvas.height = 180;
  minimapCtx = canvas.getContext('2d');
  updateMinimap();
}

function updateMinimap() {
  if (!minimapCtx) return;

  const ctx = minimapCtx;
  const w = 180, h = 180;
  const scale = 1.5;
  const offsetX = w / 2;
  const offsetY = h / 2;

  // Clear
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);

  // Draw zones
  countyZones.forEach(zone => {
    const x = offsetX + zone.position[0] * scale;
    const y = offsetY + zone.position[2] * scale;
    const zw = zone.size[0] * scale;
    const zh = zone.size[1] * scale;

    ctx.fillStyle = zone.risk === 'high' ? '#ff4757' :
                    zone.risk === 'medium' ? '#ffa502' : '#2ed573';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(x - zw/2, y - zh/2, zw, zh);
    ctx.globalAlpha = 1;
  });

  // Draw officers
  rowOfficers.forEach(officer => {
    const x = offsetX + officer.position[0] * scale;
    const y = offsetY + officer.position[2] * scale;
    ctx.fillStyle = '#4a9eff';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Update marker position
  const marker = document.getElementById('minimap-marker');
  const mx = offsetX + camera.position.x * scale;
  const my = offsetY + camera.position.z * scale;
  marker.style.left = `${mx}px`;
  marker.style.top = `${my}px`;
}

// ============================================
// INTERACTION
// ============================================

function onClick(event) {
  if (walkMode) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([...zoneMeshes, ...officerMeshes]);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    selectZone(obj);
  } else {
    deselectZone();
  }
}

function onMouseMove(event) {
  // Hover effects could go here
}

function selectZone(mesh) {
  // Deselect previous
  if (selectedZone) {
    selectedZone.material.emissive.setHex(0x000000);
    selectedZone.scale.set(1, 1, 1);
  }

  selectedZone = mesh;
  mesh.material.emissive.setHex(0x222255);
  mesh.scale.set(1.05, 1.2, 1.05);

  // Update info panel
  const panel = document.getElementById('info-panel');
  const data = mesh.userData.data;

  if (mesh.userData.type === 'zone') {
    document.querySelector('.zone-type').textContent = data.type.toUpperCase() + ' ZONE';
    document.getElementById('zone-name').textContent = data.name;
    document.getElementById('risk-level').textContent = data.risk.toUpperCase();
    document.getElementById('risk-level').className = 'value risk-' + data.risk;
    document.getElementById('finding-count').textContent = data.findings;
    document.getElementById('finding-count').className = 'value' + (data.findings > 2 ? ' risk-high' : '');
    document.getElementById('last-audit').textContent = data.lastAudit;
    document.getElementById('compliance').textContent = data.compliance + '%';
    document.getElementById('compliance').className = 'value' +
      (data.compliance < 80 ? ' risk-high' : data.compliance < 90 ? ' risk-medium' : ' risk-low');

    // Findings list and municipality note
    const findingsList = document.getElementById('findings-list');
    let html = '';

    // Show municipality note/history if available
    if (data.note) {
      html += `<div class="finding-item" style="color:#888;font-style:italic;border-bottom:1px solid #333;padding-bottom:10px;margin-bottom:5px;">${data.note}</div>`;
    }

    // Show population
    html += `<div class="finding-item"><strong>Population (2020 Census):</strong>&nbsp;${data.population.toLocaleString()}</div>`;

    if (data.auditFindings.length > 0) {
      html += data.auditFindings.map(f => `
        <div class="finding-item">
          <div class="finding-dot" style="background: ${
            f.severity === 'high' ? '#ff4757' :
            f.severity === 'medium' ? '#ffa502' : '#2ed573'
          }"></div>
          <span>${f.desc}</span>
        </div>
      `).join('');
    } else {
      html += '<div class="finding-item" style="color:#2ed573">No open audit findings</div>';
    }
    findingsList.innerHTML = html;
  } else if (mesh.userData.type === 'officer') {
    document.querySelector('.zone-type').textContent = 'ROW OFFICER / COUNTY OFFICIAL';
    document.getElementById('zone-name').textContent = data.name;
    document.getElementById('risk-level').textContent = 'Active';
    document.getElementById('risk-level').className = 'value risk-low';
    document.getElementById('finding-count').textContent = '--';
    document.getElementById('finding-count').className = 'value';
    document.getElementById('last-audit').textContent = '--';
    document.getElementById('compliance').textContent = '--';
    document.getElementById('compliance').className = 'value';
    document.getElementById('findings-list').innerHTML =
      `<div class="finding-item" style="flex-direction:column;align-items:flex-start;">
        <strong style="color:#4a9eff;">669 Washington St, Easton, PA 18042</strong>
        <span style="margin-top:8px;">${data.note || 'County Courthouse'}</span>
      </div>`;
  }

  panel.classList.add('visible');
}

function deselectZone() {
  if (selectedZone) {
    selectedZone.material.emissive.setHex(0x000000);
    selectedZone.scale.set(1, 1, 1);
    selectedZone = null;
  }
  document.getElementById('info-panel').classList.remove('visible');
}

// ============================================
// CONTROLS
// ============================================

function resetView() {
  camera.position.set(0, 50, 60);
  controls.target.set(0, 0, 0);
  controls.update();
}

function topView() {
  camera.position.set(0, 100, 0.01);
  controls.target.set(0, 0, 0);
  controls.update();
}

function toggleWalkMode() {
  walkMode = !walkMode;
  document.getElementById('btn-walk').classList.toggle('active', walkMode);

  if (walkMode) {
    camera.position.y = 2;
    walkControls.lock();
  } else {
    walkControls.unlock();
    resetView();
  }
}

function toggleLayers() {
  // Toggle visibility of different elements
  zoneMeshes.forEach(m => {
    m.visible = !m.visible;
  });
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
    case 'Escape':
      if (walkMode) toggleWalkMode();
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyW': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// ANIMATION
// ============================================

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  // Update controls
  if (!walkMode) {
    controls.update();
  } else if (walkControls.isLocked) {
    // Walk mode movement
    const speed = 0.5;
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) {
      walkControls.moveForward(direction.z * speed);
    }
    if (moveLeft || moveRight) {
      walkControls.moveRight(direction.x * speed);
    }

    // Keep at ground level
    camera.position.y = 2;
  }

  // Animate high-risk zones
  zoneMeshes.forEach(mesh => {
    if (mesh.userData.data.risk === 'high' && mesh.userData.ring) {
      mesh.userData.ring.material.opacity = 0.3 + Math.sin(time * 3) * 0.2;
    }
  });

  // Animate officer beacons
  officerMeshes.forEach(mesh => {
    if (mesh.userData.beacon) {
      mesh.userData.beacon.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
      mesh.userData.beacon.position.y = 5 + Math.sin(time) * 0.2;
    }
  });

  // Update minimap
  updateMinimap();

  renderer.render(scene, camera);
}

// Initialize
init();
  </script>
</body>
