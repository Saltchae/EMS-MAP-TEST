mapboxgl.accessToken = MAPBOX_TOKEN;

// Engineer marker data with approximate coordinates
const engineers = [
  { name: '박엑셈 대리', coords: [126.72, 37.73], initial: '박', color: '#5B7A6E', profileType: 'initial' },
  { name: '최엑셈 차장', coords: [127.05, 37.66], emoji: '🐠', profileType: 'emoji' },
  { name: '김엑셈 과장', coords: [126.88, 37.56], profileImg: 'assets/profile-kim.png', profileType: 'image' },
  { name: '이엑셈 사원', coords: [127.01, 37.31], initial: '이', color: '#6E7A5B', profileType: 'initial' },
];

// Theme palettes — mono only, no blue
const themes = {
  dark: {
    style: 'mapbox://styles/mapbox/dark-v11',
    land: '#1e1e1e',
    water: '#161616',
    waterLine: '#1c1c1c',
    building: '#262626',
    landuse: '#222222',
    park: '#202020',
    road: '#2e2e2e',
    majorRoad: '#383838',
    roadCase: '#222222',
    admin: '#3e3e3e',
    label: '#909090',
    labelHalo: 'rgba(22, 22, 22, 0.8)',
    roadLabel: '#707070',
    poiLabel: '#7a7a7a',
    placeLabel: '#a8a8a8',
    markerLabel: '#ffffff',
    markerShadow: 'rgba(28, 28, 28, 0.8)',
    markerAccent: '#40e2ff',
    markerGlow: true,
    markerType: 'dot',
  },
  light: {
    style: 'mapbox://styles/exemexem/cmndwyzdw001701sger4rduoe',
    customStyle: true,
    markerLabel: '#222222',
    markerShadow: 'rgba(255, 255, 255, 0.8)',
    markerAccent: '#222222',
    markerGlow: false,
    markerType: 'dot',
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
  },
};

let currentTheme = 'dark';

// Initialize map
const map = new mapboxgl.Map({
  container: 'map',
  style: themes.dark.style,
  center: [126.9, 37.5],
  zoom: 9.2,
  projection: 'globe',
});

// Apply theme colors to map layers
function applyTheme(palette) {
  // Skip color overrides for custom Mapbox Studio styles
  if (palette.customStyle) {
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

function addMarkers() {
  // Remove existing markers
  document.querySelectorAll('.marker').forEach(el => el.remove());

  const palette = themes[currentTheme];
  const isProfile = palette.markerType === 'profile';

  engineers.forEach((engineer, index) => {
    const el = document.createElement('div');
    el.className = 'marker';

    if (isProfile) {
      if (engineer.profileType === 'image') {
        const avatar = document.createElement('div');
        avatar.className = 'marker-avatar';
        const img = document.createElement('img');
        img.src = engineer.profileImg;
        img.alt = engineer.name;
        avatar.appendChild(img);
        el.appendChild(avatar);
      } else if (engineer.profileType === 'emoji') {
        const avatar = document.createElement('div');
        avatar.className = 'marker-avatar marker-avatar-emoji';
        avatar.textContent = engineer.emoji;
        el.appendChild(avatar);
      } else {
        const avatar = document.createElement('div');
        avatar.className = 'marker-avatar';
        avatar.style.background = engineer.color;
        avatar.textContent = engineer.initial;
        el.appendChild(avatar);
      }
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

    new mapboxgl.Marker({ element: el, anchor: 'top' })
      .setLngLat(engineer.coords)
      .addTo(map);
  });
}

// Theme toggle
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    if (theme === currentTheme) return;
    currentTheme = theme;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    map.setStyle(themes[currentTheme].style);
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

document.getElementById('compass').addEventListener('click', () => {
  map.resetNorth({ duration: 300 });
});
