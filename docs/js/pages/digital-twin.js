// Digital Twin Data Model - Can load staffing from tags
let countyData = {
  units: [
    { id: 'sheriff', name: "Sheriff's Office", position: { x: 0, y: 0, z: 0 }, dimensions: { width: 60, height: 8, depth: 40 }, color: 0x3498db, lines: [{ id: 'sheriff-sales', name: 'Sheriff Sales', stations: 5 }, { id: 'process-service', name: 'Process Service', stations: 4 }, { id: 'inmate-accounts', name: 'Inmate Accounts', stations: 4 }, { id: 'court-security', name: 'Court Security', stations: 4 }], staffing: 156 },
    { id: 'fiscal-affairs-revenue', name: 'Fiscal Affairs - Revenue', position: { x: 80, y: 0, z: 0 }, dimensions: { width: 50, height: 6, depth: 30 }, color: 0x27ae60, lines: [{ id: 'cash-receipts', name: 'Cash Receipts', stations: 3 }, { id: 'disbursements', name: 'Disbursements', stations: 3 }, { id: 'investments', name: 'Investments', stations: 4 }, { id: 'tax-collection', name: 'Tax Collection', stations: 3 }, { id: 'bank-reconciliation', name: 'Bank Reconciliation', stations: 3 }], staffing: 18 },
    { id: 'coroner', name: "Coroner's Office", position: { x: 160, y: 0, z: 0 }, dimensions: { width: 40, height: 6, depth: 25 }, color: 0x9b59b6, lines: [{ id: 'death-investigation', name: 'Death Investigation', stations: 4 }, { id: 'autopsy', name: 'Autopsy', stations: 4 }, { id: 'cremation-permits', name: 'Cremation Permits', stations: 3 }, { id: 'property-control', name: 'Property Control', stations: 3 }], staffing: 14 },
    { id: 'district-attorney', name: "District Attorney's Office", position: { x: 240, y: 0, z: 0 }, dimensions: { width: 55, height: 7, depth: 35 }, color: 0xe74c3c, lines: [{ id: 'prosecution', name: 'Criminal Prosecution', stations: 5 }, { id: 'forfeiture', name: 'Asset Forfeiture', stations: 5 }, { id: 'grants', name: 'Grant Management', stations: 4 }, { id: 'restitution', name: 'Victim Restitution', stations: 3 }], staffing: 89 },
    { id: 'recorder-of-deeds', name: 'Recorder of Deeds', position: { x: 0, y: 0, z: 60 }, dimensions: { width: 35, height: 5, depth: 25 }, color: 0xf39c12, lines: [{ id: 'recording', name: 'Document Recording', stations: 4 }, { id: 'transfer-tax', name: 'Transfer Tax', stations: 4 }, { id: 'public-records', name: 'Public Records', stations: 3 }, { id: 'technology-fund', name: 'Technology Fund', stations: 2 }], staffing: 15 },
    { id: 'register-of-wills', name: 'Register of Wills', position: { x: 80, y: 0, z: 60 }, dimensions: { width: 45, height: 6, depth: 30 }, color: 0x1abc9c, lines: [{ id: 'probate', name: 'Probate', stations: 4 }, { id: 'estate-admin', name: 'Estate Administration', stations: 5 }, { id: 'inheritance-tax', name: 'Inheritance Tax', stations: 4 }, { id: 'marriage-licenses', name: 'Marriage Licenses', stations: 4 }, { id: 'guardian-accounts', name: 'Guardian Accounts', stations: 3 }], staffing: 14 },
    { id: 'clerk-of-courts', name: 'Clerk of Courts', position: { x: 160, y: 0, z: 60 }, dimensions: { width: 45, height: 6, depth: 30 }, color: 0x3498db, lines: [{ id: 'criminal-filing', name: 'Criminal Cases', stations: 5 }, { id: 'fee-collection', name: 'Fee Collection', stations: 4 }, { id: 'records-management', name: 'Records Management', stations: 4 }, { id: 'bail-bond', name: 'Bail/Bond', stations: 3 }], staffing: 32 },
    { id: 'prothonotary', name: 'Prothonotary', position: { x: 240, y: 0, z: 60 }, dimensions: { width: 45, height: 6, depth: 30 }, color: 0xe67e22, lines: [{ id: 'civil-filing', name: 'Civil Filing', stations: 4 }, { id: 'judgments', name: 'Judgments', stations: 3 }, { id: 'liens', name: 'Lien Docket', stations: 4 }, { id: 'escrow', name: 'Escrow Accounts', stations: 3 }, { id: 'fees', name: 'Fee Collection', stations: 3 }], staffing: 18 }
  ],
  connections: [
    { from: 'sheriff', to: 'fiscal-affairs-revenue', label: 'Fees' }, { from: 'clerk-of-courts', to: 'fiscal-affairs-revenue', label: 'Fees' },
    { from: 'prothonotary', to: 'fiscal-affairs-revenue', label: 'Fees' }, { from: 'recorder-of-deeds', to: 'fiscal-affairs-revenue', label: 'Fees' },
    { from: 'register-of-wills', to: 'fiscal-affairs-revenue', label: 'Fees' }, { from: 'district-attorney', to: 'clerk-of-courts', label: 'Cases' },
    { from: 'prothonotary', to: 'sheriff', label: 'Writs' }, { from: 'coroner', to: 'district-attorney', label: 'Referrals' }
  ]
};

// Load staffing data from tags (optional enhancement)
async function loadStaffingFromTags() {
  if (typeof TagLoader === 'undefined') return;
  try {
    const tags = new TagLoader();
    const rowOfficers = await tags.load('row-officers');

    // Update staffing from tag data
    countyData.units.forEach(unit => {
      const officer = rowOfficers.officers.find(o => o.id === unit.id);
      if (officer) {
        unit.staffing = officer.staff;
      }
    });
    console.log('Digital twin staffing loaded from tags');
  } catch (err) {
    console.warn('Could not load staffing from tags:', err);
  }
}

let scene, camera, renderer;
let unitMeshes = new Map();
let simulationRunning = true;
let simulationTime = 0;
let selectedUnit = null;
let isTopView = false;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(150, 120, 200);
  camera.lookAt(120, 0, 30);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(100, 150, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  const pointLight = new THREE.PointLight(0x4fc3f7, 0.5, 500);
  pointLight.position.set(120, 50, 30);
  scene.add(pointLight);

  const groundGeometry = new THREE.PlaneGeometry(400, 200);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.8 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(120, -0.5, 30);
  ground.receiveShadow = true;
  scene.add(ground);

  const gridHelper = new THREE.GridHelper(400, 40, 0x333344, 0x222233);
  gridHelper.position.set(120, 0, 30);
  scene.add(gridHelper);

  createUnits();
  createConnections();
  populateUnitList();
  setupControls();
  setupRaycaster();
  window.addEventListener('resize', onWindowResize);
  document.getElementById('btn-play').addEventListener('click', toggleSimulation);
  document.getElementById('btn-reset').addEventListener('click', resetSimulation);
  document.getElementById('btn-workload').addEventListener('click', addWorkload);
  document.getElementById('btn-view').addEventListener('click', toggleView);
  animate();
}

function createUnits() {
  countyData.units.forEach(unit => {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(unit.dimensions.width, unit.dimensions.height, unit.dimensions.depth);
    const material = new THREE.MeshStandardMaterial({ color: unit.color, roughness: 0.6, metalness: 0.2 });
    const building = new THREE.Mesh(geometry, material);
    building.position.y = unit.dimensions.height / 2;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    const roofGeometry = new THREE.BoxGeometry(unit.dimensions.width * 0.9, 0.5, unit.dimensions.depth * 0.9);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = unit.dimensions.height + 0.25;
    group.add(roof);

    unit.lines.forEach((line, i) => {
      const lineGeometry = new THREE.BoxGeometry(8, 1.5, 4);
      const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x17a2b8, emissive: 0x17a2b8, emissiveIntensity: 0.3 });
      const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
      const offsetX = (i - (unit.lines.length - 1) / 2) * 12;
      lineMesh.position.set(offsetX, unit.dimensions.height + 1.5, 0);
      group.add(lineMesh);
    });

    group.position.set(unit.position.x, 0, unit.position.z);
    group.userData = { unitId: unit.id, unit: unit };
    scene.add(group);
    unitMeshes.set(unit.id, group);
  });
}

function createConnections() {
  const material = new THREE.LineBasicMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.3 });
  countyData.connections.forEach(conn => {
    const fromUnit = countyData.units.find(u => u.id === conn.from);
    const toUnit = countyData.units.find(u => u.id === conn.to);
    if (fromUnit && toUnit) {
      const points = [new THREE.Vector3(fromUnit.position.x, fromUnit.dimensions.height, fromUnit.position.z), new THREE.Vector3(toUnit.position.x, toUnit.dimensions.height, toUnit.position.z)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(geometry, material));
    }
  });
}

function setupControls() {
  let isDragging = false, previousMousePosition = { x: 0, y: 0 }, cameraRotation = { x: 0, y: 0 };
  renderer.domElement.addEventListener('mousedown', () => { isDragging = true; });
  renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    cameraRotation.x += (e.clientX - previousMousePosition.x) * 0.005;
    cameraRotation.y += (e.clientY - previousMousePosition.y) * 0.005;
    const radius = 250;
    camera.position.x = 120 + radius * Math.sin(cameraRotation.x) * Math.cos(cameraRotation.y);
    camera.position.y = 120 + radius * Math.sin(cameraRotation.y);
    camera.position.z = 30 + radius * Math.cos(cameraRotation.x) * Math.cos(cameraRotation.y);
    camera.lookAt(120, 0, 30);
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });
  renderer.domElement.addEventListener('mouseup', () => { isDragging = false; });
  renderer.domElement.addEventListener('wheel', (e) => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, -e.deltaY * 0.1);
  });
}

function setupRaycaster() {
  const raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();
  renderer.domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
      let obj = intersects[i].object;
      while (obj.parent && !obj.userData.unitId) obj = obj.parent;
      if (obj.userData.unitId) { selectUnit(obj.userData.unitId); return; }
    }
  });
}

function selectUnit(unitId) {
  selectedUnit = unitId;
  const unit = countyData.units.find(u => u.id === unitId);
  if (!unit) return;
  document.querySelectorAll('.unit-item').forEach(el => { el.classList.toggle('selected', el.dataset.unitId === unitId); });
  document.getElementById('detail-title').textContent = unit.name;
  document.getElementById('detail-content').innerHTML = `
    <div style="margin-bottom:15px"><div style="color:#888;font-size:0.8em">Authority</div><div>16 Pa.C.S. Article ${['XII', 'XIII', 'VII', 'VIII', 'X', 'XI', 'VI', 'IX'][countyData.units.indexOf(unit)]}</div></div>
    <div style="margin-bottom:15px"><div style="color:#888;font-size:0.8em">Staffing</div><div>${unit.staffing} FTE</div></div>
    <div style="color:#888;font-size:0.8em;margin-bottom:8px">Assembly Lines (${unit.lines.length})</div>
    ${unit.lines.map(line => `<div class="line-item"><div class="line-name">${line.name}</div><div class="stations-row">${Array(line.stations).fill(0).map((_, i) => `<div class="station-box station-${Math.random() > 0.3 ? 'idle' : 'execute'}" title="Station ${i + 1}">S${i + 1}</div>`).join('')}</div></div>`).join('')}`;
  document.getElementById('detail-panel').classList.add('visible');
  unitMeshes.forEach((mesh, id) => {
    const building = mesh.children[0];
    building.material.emissive = new THREE.Color(id === unitId ? 0x4fc3f7 : 0x000000);
    building.material.emissiveIntensity = id === unitId ? 0.3 : 0;
  });
}

function closeDetailPanel() {
  document.getElementById('detail-panel').classList.remove('visible');
  selectedUnit = null;
  unitMeshes.forEach(mesh => { mesh.children[0].material.emissive = new THREE.Color(0x000000); mesh.children[0].material.emissiveIntensity = 0; });
  document.querySelectorAll('.unit-item').forEach(el => { el.classList.remove('selected'); });
}

function populateUnitList() {
  document.getElementById('unit-list').innerHTML = countyData.units.map(unit => `<li class="unit-item" data-unit-id="${unit.id}" onclick="selectUnit('${unit.id}')"><div class="unit-name">${unit.name}</div><div class="unit-stats"><span>${unit.lines.length} lines</span><span>${unit.staffing} staff</span></div></li>`).join('');
}

function toggleSimulation() {
  simulationRunning = !simulationRunning;
  const btn = document.getElementById('btn-play');
  btn.textContent = simulationRunning ? 'Pause' : 'Run';
  btn.classList.toggle('active', simulationRunning);
}

function resetSimulation() { simulationTime = 0; updateSimulationTime(); }
function addWorkload() { document.getElementById('metric-active').textContent = parseInt(document.getElementById('metric-active').textContent) + Math.floor(Math.random() * 10 + 5); }

function toggleView() {
  isTopView = !isTopView;
  if (isTopView) { camera.position.set(120, 300, 30); document.getElementById('btn-view').textContent = 'Perspective'; }
  else { camera.position.set(150, 120, 200); document.getElementById('btn-view').textContent = 'Top View'; }
  camera.lookAt(120, 0, 30);
}

function updateSimulationTime() {
  const h = Math.floor(simulationTime / 3600), m = Math.floor((simulationTime % 3600) / 60), s = Math.floor(simulationTime % 60);
  document.getElementById('simulation-time').textContent = `Simulation Time: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function animate() {
  requestAnimationFrame(animate);
  if (simulationRunning) {
    simulationTime += 0.1;
    updateSimulationTime();
    unitMeshes.forEach(group => {
      const lines = group.children.slice(2);
      lines.forEach((line, i) => { line.material.emissiveIntensity = 0.2 + (Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5) * 0.3; });
    });
    if (Math.random() < 0.02) document.getElementById('metric-processed').textContent = parseInt(document.getElementById('metric-processed').textContent) + 1;
    if (Math.random() < 0.05) { const active = document.getElementById('metric-active'); active.textContent = Math.max(0, parseInt(active.textContent) + (Math.random() > 0.6 ? 1 : -1)); }
  }
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize with optional tag loading
(async function() {
  await loadStaffingFromTags();
  init();
})();
