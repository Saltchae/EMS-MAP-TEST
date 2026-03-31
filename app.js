// Token setup — uses config.js if available, otherwise uses encoded fallback
if (typeof MAPBOX_TOKEN !== 'undefined') {
  mapboxgl.accessToken = MAPBOX_TOKEN;
} else {
  mapboxgl.accessToken = atob('cGsuZXlKMUlqb2laWGhsYldWNFpXMGlMQ0poSWpvaVkyMXVaSGRyYWpFMk1Xd3haekp3YmpVMGNHeHVkamh0YWlKOS5lVGYxdEtOMmVHXzA0ZnBrTmcyajln');
}

// Engineer marker data — split by region
const engineersSeoul = [
  { name: '박엑셈 대리', coords: [126.72, 37.73], initial: '박', color: '#5B7A6E', profileType: 'initial' },
  { name: '최엑셈 차장', coords: [127.05, 37.66], emoji: '🐠', profileType: 'emoji' },
  { name: '김엑셈 과장', coords: [126.88, 37.56], profileImg: 'assets/profile-kim.png', profileType: 'image' },
  { name: '이엑셈 사원', coords: [127.01, 37.31], initial: '이', color: '#6E7A5B', profileType: 'initial' },
];
const engineersRegional = [
  { name: '채엑셈 대리', coords: [128.6014, 35.8714], initial: '채', color: '#E85D3A', profileType: 'initial' },
  { name: '탁엑셈 과장', coords: [127.1480, 35.8242], initial: '탁', color: '#3A7BE8', profileType: 'initial' },
  { name: '정엑셈 과장', coords: [126.8526, 35.1595], initial: '정', color: '#8B5CF6', profileType: 'initial' },
];
const engineers = [...engineersSeoul, ...engineersRegional];

// Corporate mode: engineers at client sites
const corporateSeoul = [
  { name: '박엑셈 대리', coords: [127.0145, 37.2388], profileImg: 'assets/logo-samsung.png', profileType: 'image' },
  { name: '김엑셈 과장', coords: [126.8903, 37.5257], profileImg: 'assets/logo-lgcns.png', profileType: 'image' },
  { name: '최엑셈 차장', coords: [127.0495, 37.5665], profileImg: 'assets/logo-hanwha.png', profileType: 'image' },
  { name: '이엑셈 사원', coords: [126.9802, 37.5710], profileImg: 'assets/logo-kyobo.png', profileType: 'image' },
];
const corporateRegional = [
  { name: '채엑셈 대리', coords: [128.6014, 35.8714], initial: '채', color: '#E85D3A', profileType: 'initial' },
  { name: '탁엑셈 과장', coords: [129.0756, 35.1796], initial: '탁', color: '#3A7BE8', profileType: 'initial' },
  { name: '정엑셈 과장', coords: [126.8526, 35.1595], initial: '정', color: '#8B5CF6', profileType: 'initial' },
];
const corporateEngineers = [...corporateSeoul, ...corporateRegional];

// HQ cluster members (마곡 본사)
const hqCoords = [126.8375, 37.5590];
const hqMembers = [
    { name: '남엑셈 대리', initial: '남', color: '#FF5A5A' },
  { name: '조엑셈 사원', initial: '조', color: '#7B61FF' },
  { name: '박엑셈 과장', initial: '박', color: '#00C48C' },
];
const HQ_EXPAND_ZOOM = 13;

// Theme palettes — mono only, no blue
const themes = {
  dark: {
    style: 'mapbox://styles/exemexem/cmndy87jb001h01stbjkh7wdj',
    customStyle: true,
    layerOverrides: [
      { id: 'settlement-major-label', property: 'text-color', value: 'hsl(0, 0%, 50%)' },
    ],
    markerLabel: '#ffffff',
    markerShadow: 'rgba(28, 28, 28, 0.8)',
    markerAccent: '#40e2ff',
    markerGlow: true,
    markerType: 'dot',
    showHqCluster: true,
    darkMode: true,
  },
  light: {
    style: 'mapbox://styles/exemexem/cmndwyzdw001701sger4rduoe',
    customStyle: true,
    markerLabel: '#222222',
    markerShadow: 'rgba(255, 255, 255, 0.8)',
    markerAccent: '#222222',
    markerGlow: false,
    markerType: 'dot',
    showHqCluster: true,
  },
  corporate: {
    style: 'mapbox://styles/exemexem/cmndwyzdw001701sger4rduoe',
    customStyle: true,
    markerLabel: '#222222',
    markerShadow: 'rgba(255, 255, 255, 0.8)',
    markerAccent: '#222222',
    markerGlow: false,
    markerType: 'corporate',
    showHqCluster: true,
  },
  profile: {
    style: 'mapbox://styles/mapbox/light-v11',
    land: '#e8e8e8',
    water: '#cdd4d6',
    waterLine: '#c2cacd',
    building: '#dcdcdc',
    landuse: '#e0e0e0',
    park: '#d5d8cd',
    road: '#d4d4d4',
    majorRoad: '#c8c8c8',
    roadCase: '#e0e0e0',
    admin: '#c2c2c2',
    label: '#707070',
    labelHalo: 'rgba(240, 240, 240, 0.8)',
    roadLabel: '#909090',
    poiLabel: '#868686',
    placeLabel: '#585858',
    markerLabel: '#222222',
    markerShadow: 'rgba(255, 255, 255, 0.8)',
    markerAccent: '#222222',
    markerGlow: false,
    markerType: 'profile',
    showHqCluster: true,
  },
};

let currentTheme = 'corporate';

// Initialize map
const map = new mapboxgl.Map({
  container: 'map',
  style: themes.corporate.style,
  center: [127.8, 36.0],
  zoom: 6.5,
  projection: 'globe',
});

// Apply theme colors to map layers
function applyTheme(palette) {
  // Skip color overrides for custom Mapbox Studio styles
  if (palette.customStyle) {
    // Per-layer overrides for custom styles
    if (palette.layerOverrides) {
      palette.layerOverrides.forEach(({ id, property, value }) => {
        try { map.setPaintProperty(id, property, value); } catch (e) {}
      });
    }
    // Only update marker styles
    document.querySelectorAll('.marker-label').forEach(label => {
      label.style.color = palette.markerLabel;
      label.style.textShadow = `0 0 12px ${palette.markerShadow}, 0 0 24px ${palette.markerShadow}, 0 1px 3px ${palette.markerShadow}`;
    });
    document.querySelectorAll('.marker-dot').forEach(dot => {
      dot.style.background = palette.markerAccent;
      dot.style.setProperty('--accent', palette.markerAccent);
    });
    return;
  }

  const layers = map.getStyle().layers;

  layers.forEach(layer => {
    const id = layer.id;
    const type = layer.type;

    // Korean labels
    if (type === 'symbol') {
      try {
        const tf = map.getLayoutProperty(id, 'text-field');
        if (tf) {
          map.setLayoutProperty(id, 'text-field', [
            'coalesce',
            ['get', 'name_ko'],
            ['get', 'name'],
          ]);
        }
      } catch (e) {}
    }

    try {
      const src = layer['source-layer'] || '';
      const isNature = id.includes('park') || id.includes('green') || id.includes('landcover')
        || id.includes('national') || id.includes('forest') || id.includes('grass')
        || id.includes('wood') || id.includes('scrub') || id.includes('vegetation')
        || src === 'landcover' || src === 'landuse_overlay' || src === 'landuse';

      if (id === 'land' || id === 'land-structure-polygon') {
        map.setPaintProperty(id, 'background-color', palette.land);
      }
      if (id.includes('water') && type === 'fill') {
        map.setPaintProperty(id, 'fill-color', palette.water);
      }
      if (id.includes('water') && type === 'line') {
        map.setPaintProperty(id, 'line-color', palette.waterLine);
      }
      if (id.includes('building') && type === 'fill') {
        map.setPaintProperty(id, 'fill-color', palette.building);
      }
      if (id.includes('landuse') && type === 'fill' && !isNature) {
        map.setPaintProperty(id, 'fill-color', palette.landuse);
      }
      if (type === 'fill' && isNature) {
        map.setPaintProperty(id, 'fill-color', palette.park);
        console.log(`  → Applied park color to: "${id}" (source-layer: "${src}")`);
      }
      if (type === 'line' && (id.includes('road') || id.includes('street') || id.includes('link') || id.includes('path'))) {
        map.setPaintProperty(id, 'line-color', palette.road);
      }
      if (type === 'line' && (id.includes('trunk') || id.includes('motorway') || id.includes('primary') || id.includes('secondary'))) {
        map.setPaintProperty(id, 'line-color', palette.majorRoad);
      }
      if (type === 'line' && id.includes('case')) {
        map.setPaintProperty(id, 'line-color', palette.roadCase);
      }
      if (id.includes('admin') && type === 'line') {
        map.setPaintProperty(id, 'line-color', palette.admin);
      }
      if (type === 'symbol') {
        try { map.setPaintProperty(id, 'text-color', palette.label); } catch(e) {}
        try { map.setPaintProperty(id, 'text-halo-color', palette.labelHalo); } catch(e) {}
      }
      if (type === 'symbol' && id.includes('road')) {
        try { map.setPaintProperty(id, 'text-color', palette.roadLabel); } catch(e) {}
      }
      if (type === 'symbol' && id.includes('poi')) {
        try { map.setPaintProperty(id, 'text-color', palette.poiLabel); } catch(e) {}
      }
      if (type === 'symbol' && (id.includes('place') || id.includes('settlement'))) {
        try { map.setPaintProperty(id, 'text-color', palette.placeLabel); } catch(e) {}
      }
    } catch (e) {}
  });

  // Update marker styles
  document.querySelectorAll('.marker-label').forEach(label => {
    label.style.color = palette.markerLabel;
    label.style.textShadow = `0 0 12px ${palette.markerShadow}, 0 0 24px ${palette.markerShadow}, 0 1px 3px ${palette.markerShadow}`;
  });
  document.querySelectorAll('.marker-dot').forEach(dot => {
    dot.style.background = palette.markerAccent;
    dot.style.setProperty('--accent', palette.markerAccent);
  });
}

// Initial style load
map.on('style.load', () => {
  applyTheme(themes[currentTheme]);
  addMarkers();
});

// Store active markers for cleanup
let activeMarkers = [];
const SUMMARY_ZOOM = 8; // Below this: summary view, above: individual markers

function addMarkers() {
  // Remove existing markers
  activeMarkers.forEach(m => m.remove());
  activeMarkers = [];

  const palette = themes[currentTheme];
  const isCorporate = palette.markerType === 'corporate';
  const isProfile = palette.markerType === 'profile' || isCorporate;
  const zoom = map.getZoom();

  // Summary view at low zoom (all modes)
  if (zoom < SUMMARY_ZOOM) {
    addSummaryView(palette);
    return;
  }

  const markerData = isCorporate ? corporateEngineers : engineers;

  markerData.forEach((engineer) => {
    const el = document.createElement('div');
    el.className = 'marker';

    if (isProfile) {
      createAvatarElement(el, engineer);
    } else {
      const dot = document.createElement('div');
      dot.className = 'marker-dot' + (palette.markerGlow ? '' : ' no-glow');
      dot.style.background = palette.markerAccent;
      dot.style.setProperty('--accent', palette.markerAccent);
      el.appendChild(dot);
    }

    const label = document.createElement('div');
    label.className = 'marker-label';
    label.textContent = engineer.name;
    label.style.color = palette.markerLabel;
    label.style.textShadow = `0 0 12px ${palette.markerShadow}, 0 0 24px ${palette.markerShadow}, 0 1px 3px ${palette.markerShadow}`;
    el.appendChild(label);

    if (isProfile) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', ((coords) => (e) => {
        e.stopPropagation();
        map.flyTo({ center: coords, zoom: 12, duration: 800 });
      })(engineer.coords));
    }

    const marker = new mapboxgl.Marker({ element: el, anchor: 'top' })
      .setLngLat(engineer.coords)
      .addTo(map);
    activeMarkers.push(marker);
  });

  // Add HQ cluster if enabled and not in summary
  if (palette.showHqCluster) {
    addHqCluster();
  }
}

// Summary view for all modes
function addSummaryView(palette) {
  const isCorporate = palette.markerType === 'corporate';
  const isDark = palette.darkMode;
  const isProfile = palette.markerType === 'profile';
  const seoulCount = isCorporate ? corporateSeoul.length : engineersSeoul.length;
  const regional = isCorporate ? corporateRegional : engineersRegional;

  const el = document.createElement('div');
  el.className = 'marker marker-summary' + (isDark ? ' dark' : '');

  const card = document.createElement('div');
  card.className = 'summary-card';

  // Row 1: 본사 내근
  const row1 = document.createElement('div');
  row1.className = 'summary-row';
  const icon1 = document.createElement('div');
  icon1.className = 'summary-icon';
  const img1 = document.createElement('img');
  img1.src = 'assets/exemicon.svg';
  img1.width = 20;
  img1.height = 20;
  icon1.appendChild(img1);
  row1.appendChild(icon1);
  const text1 = document.createElement('span');
  text1.className = 'summary-text';
  text1.textContent = '본사 내근';
  row1.appendChild(text1);
  const badge1 = document.createElement('span');
  badge1.className = 'summary-badge';
  badge1.textContent = '+' + hqMembers.length;
  row1.appendChild(badge1);
  card.appendChild(row1);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'summary-divider';
  card.appendChild(divider);

  // Row 2: 외근
  const row2 = document.createElement('div');
  row2.className = 'summary-row';
  const icon2 = document.createElement('div');
  icon2.className = 'summary-icon summary-icon-office';
  icon2.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14V4h5v10"/><path d="M7 7h5v7h2V2H7"/><path d="M4 6.5h1M4 9h1M4 11.5h1M9 9.5h1M9 12h1"/></svg>';
  row2.appendChild(icon2);
  const text2 = document.createElement('span');
  text2.className = 'summary-text';
  text2.textContent = '외근';
  row2.appendChild(text2);
  const badge2 = document.createElement('span');
  badge2.className = 'summary-badge';
  badge2.textContent = '+' + seoulCount;
  row2.appendChild(badge2);
  card.appendChild(row2);

  el.appendChild(card);

  // Click to zoom in — defer marker swap until animation ends
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    isFlying = true;
    map.flyTo({ center: [127.0, 37.5], zoom: SUMMARY_ZOOM + 1, duration: 800 });
    map.once('moveend', () => {
      isFlying = false;
      wasSummary = false;
      addMarkers();
    });
  });

  const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
    .setLngLat([126.95, 37.50])
    .addTo(map);
  activeMarkers.push(marker);

  // Regional engineers: always show individually, click to zoom
  addRegionalMarkers(regional, palette);
}

function addRegionalMarkers(regional, palette) {
  const isDot = palette.markerType === 'dot';

  regional.forEach(engineer => {
    const indEl = document.createElement('div');
    indEl.className = 'marker';
    indEl.style.cursor = 'pointer';

    if (isDot) {
      const dot = document.createElement('div');
      dot.className = 'marker-dot' + (palette.markerGlow ? '' : ' no-glow');
      dot.style.background = palette.markerAccent;
      dot.style.setProperty('--accent', palette.markerAccent);
      indEl.appendChild(dot);
    } else {
      createAvatarElement(indEl, engineer);
    }

    const label = document.createElement('div');
    label.className = 'marker-label';
    label.textContent = engineer.name;
    label.style.color = palette.markerLabel;
    label.style.textShadow = `0 0 12px ${palette.markerShadow}, 0 0 24px ${palette.markerShadow}, 0 1px 3px ${palette.markerShadow}`;
    indEl.appendChild(label);

    indEl.addEventListener('click', ((coords) => (e) => {
      e.stopPropagation();
      isFlying = true;
      map.flyTo({ center: coords, zoom: 12, duration: 800 });
      map.once('moveend', () => { isFlying = false; });
    })(engineer.coords));

    const m = new mapboxgl.Marker({ element: indEl, anchor: 'top' })
      .setLngLat(engineer.coords)
      .addTo(map);
    activeMarkers.push(m);
  });
}

function createAvatarElement(parent, engineer) {
  if (engineer.profileType === 'image') {
    const avatar = document.createElement('div');
    avatar.className = 'marker-avatar';
    const img = document.createElement('img');
    img.src = engineer.profileImg;
    img.alt = engineer.name;
    avatar.appendChild(img);
    parent.appendChild(avatar);
  } else if (engineer.profileType === 'emoji') {
    const avatar = document.createElement('div');
    avatar.className = 'marker-avatar marker-avatar-emoji';
    avatar.textContent = engineer.emoji;
    parent.appendChild(avatar);
  } else {
    const avatar = document.createElement('div');
    avatar.className = 'marker-avatar';
    avatar.style.background = engineer.color;
    avatar.textContent = engineer.initial;
    parent.appendChild(avatar);
  }
}

// HQ cluster marker + expand logic
let hqClusterMarker = null;
let hqIndividualMarkers = [];
let hqTooltipVisible = false;

function addHqCluster() {
  removeHqMarkers();
  const zoom = map.getZoom();
  hqWasExpanded = zoom >= HQ_EXPAND_ZOOM;
  const palette = themes[currentTheme];

  if (zoom < HQ_EXPAND_ZOOM) {
    // --- Cluster marker with range circle ---
    const el = document.createElement('div');
    el.className = 'marker marker-cluster' + (palette.darkMode ? ' dark' : '');

    const avatar = document.createElement('div');
    avatar.className = 'marker-avatar';

    const img = document.createElement('img');
    img.src = 'assets/exemicon.svg';
    img.alt = '본사';
    avatar.appendChild(img);

    const badge = document.createElement('div');
    badge.className = 'cluster-badge';
    badge.textContent = '+3';
    avatar.appendChild(badge);
    el.appendChild(avatar);

    const label = document.createElement('div');
    label.className = 'marker-label';
    label.textContent = '본사 내근';
    label.style.color = palette.markerLabel;
    label.style.textShadow = `0 0 12px ${palette.markerShadow}, 0 0 24px ${palette.markerShadow}, 0 1px 3px ${palette.markerShadow}`;
    el.appendChild(label);

    // --- Hover tooltip: member list ---
    const tooltip = document.createElement('div');
    tooltip.className = 'cluster-tooltip';
    hqMembers.forEach(member => {
      const row = document.createElement('div');
      row.className = 'cluster-tooltip-row';
      const dot = document.createElement('span');
      dot.className = 'cluster-tooltip-dot';
      dot.style.background = member.color;
      const name = document.createElement('span');
      name.textContent = member.name;
      row.appendChild(dot);
      row.appendChild(name);
      tooltip.appendChild(row);
    });
    el.appendChild(tooltip);

    // --- Click: zoom in, rebuild all markers after animation ends ---
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      isFlying = true;
      map.flyTo({ center: hqCoords, zoom: HQ_EXPAND_ZOOM + 1, duration: 800 });
      map.once('moveend', () => {
        isFlying = false;
        wasSummary = false;
        hqWasExpanded = true;
        addMarkers();
      });
    });

    hqClusterMarker = new mapboxgl.Marker({ element: el, anchor: 'top' })
      .setLngLat(hqCoords)
      .addTo(map);
    activeMarkers.push(hqClusterMarker);
  } else {
    // --- Expanded: stacked member card at HQ ---
    const el = document.createElement('div');
    el.className = 'marker marker-hq-expanded' + (palette.darkMode ? ' dark' : '');

    const card = document.createElement('div');
    card.className = 'hq-card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'hq-card-header';
    const hqIcon = document.createElement('img');
    hqIcon.src = 'assets/exemicon.svg';
    hqIcon.alt = '본사';
    hqIcon.width = 16;
    hqIcon.height = 16;
    cardHeader.appendChild(hqIcon);
    const hqTitle = document.createElement('span');
    hqTitle.textContent = '본사 내근';
    cardHeader.appendChild(hqTitle);
    card.appendChild(cardHeader);

    hqMembers.forEach(member => {
      const row = document.createElement('div');
      row.className = 'hq-card-row';

      const dot = document.createElement('span');
      dot.className = 'hq-card-dot';
      dot.style.background = member.color;
      dot.textContent = member.initial;
      row.appendChild(dot);

      const name = document.createElement('span');
      name.className = 'hq-card-name';
      name.textContent = member.name;
      row.appendChild(name);

      card.appendChild(row);
    });

    el.appendChild(card);

    const marker = new mapboxgl.Marker({ element: el, anchor: 'top' })
      .setLngLat(hqCoords)
      .addTo(map);
    hqIndividualMarkers.push(marker);
    activeMarkers.push(marker);
  }
}

function removeHqMarkers() {
  if (hqClusterMarker) {
    hqClusterMarker.remove();
    hqClusterMarker = null;
  }
  hqIndividualMarkers.forEach(m => m.remove());
  hqIndividualMarkers = [];
}

// Zoom-based transitions
let hqWasExpanded = false;
let isFlying = false;
let wasSummary = true; // track summary ↔ individual transition
let zoomDebounce = null;
map.on('zoom', () => {
  const palette = themes[currentTheme];
  if (isFlying) return;

  const zoom = map.getZoom();

  // Summary ↔ individual transition (all modes)
  const isSummary = zoom < SUMMARY_ZOOM;
  if (isSummary !== wasSummary) {
    wasSummary = isSummary;
    clearTimeout(zoomDebounce);
    zoomDebounce = setTimeout(() => addMarkers(), 100);
    return;
  }

  // HQ cluster expand/collapse
  if (!palette.showHqCluster) return;
  const isExpanded = zoom >= HQ_EXPAND_ZOOM;
  if (isExpanded !== hqWasExpanded) {
    hqWasExpanded = isExpanded;
    addHqCluster();
  }
});

// Theme toggle
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    if (theme === currentTheme) return;
    const prevStyle = themes[currentTheme].style;
    currentTheme = theme;
    wasSummary = map.getZoom() < SUMMARY_ZOOM;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (themes[currentTheme].style === prevStyle) {
      // Same map style — skip reload, just swap markers immediately
      applyTheme(themes[currentTheme]);
      addMarkers();
    } else {
      map.setStyle(themes[currentTheme].style);
    }
  });
});

// Side panel toggle
const mainEl = document.querySelector('.main');
const panelEl = document.querySelector('.side-panel');
document.querySelector('.panel-toggle').addEventListener('click', () => {
  mainEl.classList.toggle('panel-collapsed');
  panelEl.addEventListener('transitionend', () => map.resize(), { once: true });
});

// Custom zoom controls
document.getElementById('zoom-in').addEventListener('click', () => {
  map.zoomIn({ duration: 300 });
});

document.getElementById('zoom-out').addEventListener('click', () => {
  map.zoomOut({ duration: 300 });
});

document.getElementById('reset-view').addEventListener('click', () => {
  isFlying = true;
  map.flyTo({ center: [127.8, 36.0], zoom: 6.5, duration: 800, bearing: 0, pitch: 0 });
  map.once('moveend', () => {
    isFlying = false;
    wasSummary = true;
    addMarkers();
  });
});
