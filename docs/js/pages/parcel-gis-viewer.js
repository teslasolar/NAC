// Parcel/GIS Viewer
const map = L.map('map', { center: [40.75, -75.30], zoom: 11, zoomControl: true });
const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB' });
darkLayer.addTo(map);

const layers = { parcels: L.layerGroup(), zoning: L.layerGroup(), flood: L.layerGroup(), municipalities: L.layerGroup(), schools: L.layerGroup() };

const sampleParcels = [
  { id: 'N8-1-1', coords: [[40.6237, -75.3742], [40.6247, -75.3742], [40.6247, -75.3722], [40.6237, -75.3722]], owner: 'City of Bethlehem', address: '10 E Church St', landUse: 'institutional', assessed: 2850000, acres: 1.2, municipality: 'Bethlehem' },
  { id: 'N8-1-2', coords: [[40.6207, -75.3780], [40.6217, -75.3780], [40.6217, -75.3760], [40.6207, -75.3760]], owner: 'Bethlehem Steel Redevelopment', address: '101 Founders Way', landUse: 'commercial', assessed: 12500000, acres: 5.8, municipality: 'Bethlehem' },
  { id: 'K5-2-1', coords: [[40.6910, -75.2070], [40.6920, -75.2070], [40.6920, -75.2050], [40.6910, -75.2050]], owner: 'Northampton County', address: '669 Washington St', landUse: 'institutional', assessed: 8500000, acres: 2.3, municipality: 'Easton' },
  { id: 'K5-2-2', coords: [[40.6880, -75.2100], [40.6890, -75.2100], [40.6890, -75.2080], [40.6880, -75.2080]], owner: 'Crayola Experience', address: '30 Centre Square', landUse: 'commercial', assessed: 4200000, acres: 0.8, municipality: 'Easton' },
  { id: 'K5-3-1', coords: [[40.6860, -75.2150], [40.6875, -75.2150], [40.6875, -75.2120], [40.6860, -75.2120]], owner: 'Lafayette College', address: '730 High St', landUse: 'institutional', assessed: 45000000, acres: 110, municipality: 'Easton' },
  { id: 'P3-5-1', coords: [[40.7000, -75.2600], [40.7020, -75.2600], [40.7020, -75.2550], [40.7000, -75.2550]], owner: 'Palmer Park Mall LLC', address: '3000 Palmer Park Mall', landUse: 'commercial', assessed: 35000000, acres: 42, municipality: 'Palmer Township' },
  { id: 'F7-8-1', coords: [[40.7400, -75.2200], [40.7450, -75.2200], [40.7450, -75.2100], [40.7400, -75.2100]], owner: 'FedEx Ground', address: '1000 Postal Road', landUse: 'industrial', assessed: 28000000, acres: 85, municipality: 'Forks Township' },
  { id: 'A2-4-1', coords: [[40.8000, -75.3500], [40.8100, -75.3500], [40.8100, -75.3300], [40.8000, -75.3300]], owner: 'Smith Family Farm', address: '1234 Rural Route 1', landUse: 'agricultural', assessed: 450000, acres: 125, municipality: 'Allen Township' },
  { id: 'B4-6-1', coords: [[40.8200, -75.2800], [40.8280, -75.2800], [40.8280, -75.2650], [40.8200, -75.2650]], owner: 'Bushkill Farms LLC', address: '567 Farm Lane', landUse: 'agricultural', assessed: 620000, acres: 180, municipality: 'Bushkill Township' },
  { id: 'R1-1-1', coords: [[40.6500, -75.3200], [40.6510, -75.3200], [40.6510, -75.3180], [40.6500, -75.3180]], owner: 'Jones, Robert & Mary', address: '123 Main St', landUse: 'residential', assessed: 285000, acres: 0.25, municipality: 'Bethlehem' },
  { id: 'R1-1-2', coords: [[40.6510, -75.3200], [40.6520, -75.3200], [40.6520, -75.3180], [40.6510, -75.3180]], owner: 'Williams, Sarah', address: '125 Main St', landUse: 'residential', assessed: 312000, acres: 0.28, municipality: 'Bethlehem' },
  { id: 'V3-2-1', coords: [[40.7100, -75.2900], [40.7130, -75.2900], [40.7130, -75.2850], [40.7100, -75.2850]], owner: 'Northampton Development Corp', address: 'Industrial Blvd (Vacant)', landUse: 'vacant', assessed: 850000, acres: 15, municipality: 'Hanover Township' }
];

const municipalities = [
  { name: 'Bethlehem', coords: [[40.58, -75.42], [40.58, -75.32], [40.66, -75.32], [40.66, -75.42]], color: '#4caf50' },
  { name: 'Easton', coords: [[40.67, -75.24], [40.67, -75.18], [40.72, -75.18], [40.72, -75.24]], color: '#2196f3' },
  { name: 'Palmer Township', coords: [[40.68, -75.30], [40.68, -75.22], [40.74, -75.22], [40.74, -75.30]], color: '#ff9800' },
  { name: 'Forks Township', coords: [[40.72, -75.26], [40.72, -75.18], [40.78, -75.18], [40.78, -75.26]], color: '#9c27b0' },
  { name: 'Allen Township', coords: [[40.78, -75.40], [40.78, -75.30], [40.85, -75.30], [40.85, -75.40]], color: '#00bcd4' },
  { name: 'Bushkill Township', coords: [[40.78, -75.32], [40.78, -75.22], [40.86, -75.22], [40.86, -75.32]], color: '#8bc34a' },
  { name: 'Hanover Township', coords: [[40.68, -75.36], [40.68, -75.28], [40.74, -75.28], [40.74, -75.36]], color: '#ff5722' },
  { name: 'Lower Nazareth Twp', coords: [[40.70, -75.36], [40.70, -75.28], [40.76, -75.28], [40.76, -75.36]], color: '#e91e63' }
];

const landUseColors = { residential: '#4caf50', commercial: '#2196f3', industrial: '#9c27b0', agricultural: '#ff9800', institutional: '#795548', vacant: '#607d8b' };

municipalities.forEach(muni => {
  const polygon = L.polygon(muni.coords, { color: muni.color, weight: 2, fillOpacity: 0.1, fillColor: muni.color }).bindPopup(`<strong>${muni.name}</strong>`);
  layers.municipalities.addLayer(polygon);
});

sampleParcels.forEach(parcel => {
  const polygon = L.polygon(parcel.coords, { color: landUseColors[parcel.landUse], weight: 1, fillOpacity: 0.5, fillColor: landUseColors[parcel.landUse] });
  polygon.on('click', () => selectParcel(parcel));
  polygon.bindPopup(createParcelPopup(parcel));
  polygon.parcelData = parcel;
  layers.parcels.addLayer(polygon);
});

layers.municipalities.addTo(map);
layers.parcels.addTo(map);

function createParcelPopup(parcel) {
  return `<div class="parcel-popup"><h4>Parcel ${parcel.id}</h4><div class="detail"><strong>Owner:</strong> ${parcel.owner}</div><div class="detail"><strong>Address:</strong> ${parcel.address}</div><div class="detail"><strong>Land Use:</strong> ${parcel.landUse}</div><div class="detail"><strong>Assessed:</strong> $${parcel.assessed.toLocaleString()}</div><div class="detail"><strong>Acres:</strong> ${parcel.acres}</div><div class="detail"><strong>Municipality:</strong> ${parcel.municipality}</div></div>`;
}

function selectParcel(parcel) {
  document.getElementById('parcelInfo').innerHTML = `<h3>Selected Parcel</h3>
    <div class="parcel-detail"><label>Parcel ID</label><value>${parcel.id}</value></div>
    <div class="parcel-detail"><label>Owner</label><value>${parcel.owner}</value></div>
    <div class="parcel-detail"><label>Address</label><value>${parcel.address}</value></div>
    <div class="parcel-detail"><label>Land Use</label><value style="text-transform:capitalize">${parcel.landUse}</value></div>
    <div class="parcel-detail"><label>Assessed Value</label><value>$${parcel.assessed.toLocaleString()}</value></div>
    <div class="parcel-detail"><label>Acreage</label><value>${parcel.acres} acres</value></div>
    <div class="parcel-detail"><label>Municipality</label><value>${parcel.municipality}</value></div>
    <div class="parcel-detail"><label>Assessment Level</label><div class="assessment-meter"><div class="fill" style="width:${Math.min(100, parcel.assessed / 500000 * 100)}%"></div></div></div>`;
}

function toggleLayer(layerName) {
  const checkbox = document.getElementById('layer' + layerName.charAt(0).toUpperCase() + layerName.slice(1));
  if (checkbox.checked) map.addLayer(layers[layerName]); else map.removeLayer(layers[layerName]);
  updateStats();
}

function applyFilters() {
  const landUseFilter = document.getElementById('filterLandUse').value;
  const assessmentFilter = document.getElementById('filterAssessment').value;
  const municipalityFilter = document.getElementById('filterMunicipality').value;
  layers.parcels.eachLayer(layer => {
    const parcel = layer.parcelData;
    let visible = true;
    if (landUseFilter !== 'all' && parcel.landUse !== landUseFilter) visible = false;
    if (assessmentFilter !== 'all') {
      const [min, max] = assessmentFilter.includes('+') ? [parseInt(assessmentFilter), Infinity] : assessmentFilter.split('-').map(Number);
      if (parcel.assessed < min || parcel.assessed > max) visible = false;
    }
    if (municipalityFilter !== 'all' && !parcel.municipality.toLowerCase().includes(municipalityFilter.replace(/-/g, ' '))) visible = false;
    layer.setStyle({ opacity: visible ? 1 : 0.1, fillOpacity: visible ? 0.5 : 0.05 });
  });
  updateStats();
}

function updateStats() {
  let visibleCount = 0, totalValue = 0, totalAcres = 0;
  layers.parcels.eachLayer(layer => {
    if (layer.options.opacity > 0.5) { visibleCount++; totalValue += layer.parcelData.assessed; totalAcres += layer.parcelData.acres; }
  });
  document.getElementById('statParcels').textContent = visibleCount.toLocaleString();
  document.getElementById('statValue').textContent = '$' + (totalValue / 1000000).toFixed(1) + 'M';
  document.getElementById('statAcres').textContent = totalAcres.toLocaleString();
  document.getElementById('statAvg').textContent = visibleCount > 0 ? '$' + Math.round(totalValue / visibleCount).toLocaleString() : '$0';
}

function searchParcel() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  let found = false;
  layers.parcels.eachLayer(layer => {
    const parcel = layer.parcelData;
    if (parcel.id.toLowerCase().includes(query) || parcel.owner.toLowerCase().includes(query) || parcel.address.toLowerCase().includes(query)) {
      map.fitBounds(layer.getBounds(), { maxZoom: 16 }); layer.openPopup(); selectParcel(parcel); found = true;
    }
  });
  if (!found) alert('No parcel found matching: ' + query);
}

function zoomToCounty() { map.setView([40.75, -75.30], 11); }

let measureMode = null;
function toggleMeasure(mode) {
  measureMode = measureMode === mode ? null : mode;
  document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
  if (measureMode) { event.target.classList.add('active'); alert('Measure mode: ' + mode + '\nClick on map to start measuring.'); }
}

function printMap() { window.print(); }

function exportData() {
  const data = [];
  layers.parcels.eachLayer(layer => data.push(layer.parcelData));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'northampton-parcels.json'; a.click();
}

updateStats();
document.getElementById('searchInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') searchParcel(); });
