// ======================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ======================================
const PARQUES_URL = 'archivos/parques.geojson';

let map;
let markersLayer;
let allMarkers = [];
let filteredMarkers = []; // Marcadores actualmente visibles
let allData = [];
let userLocationMarker = null;
let userLocationCircle = null;
let limiteAlcaldiaLayer = null;
let ejesVialesData = null;
let rutaActual = null;

// ======================================
// INICIALIZACIÓN
// ======================================
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initEventListeners();
    loadData();
});

// ======================================
// LEER PARÁMETROS DE LA URL
// ======================================
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// ======================================
// ABRIR PARQUE ESPECÍFICO DESDE URL
// ======================================
function abrirParqueDesdeURL() {
    const nombreParque = getURLParameter('parque');
    if (!nombreParque) return;
    
    // Decodificar el nombre del parque (reemplazar guiones por espacios)
    const nombreBuscado = decodeURIComponent(nombreParque).replace(/-/g, ' ').toLowerCase();
    
    console.log('🔍 Buscando parque:', nombreBuscado);
    
    // Buscar el parque en los marcadores
    const parqueEncontrado = allMarkers.find(item => {
        const nombre = (item.data.properties.Name || '').toLowerCase();
        return nombre === nombreBuscado;
    });
    
    if (parqueEncontrado) {
        console.log('✅ Parque encontrado:', parqueEncontrado.data.properties.Name);
        
        // Primero cambiar el zoom sin animación para que sea inmediato
        map.setView([parqueEncontrado.lat, parqueEncontrado.lng], 18, {
            animate: true,
            duration: 1
        });
        
        // Abrir el popup después de que termine la animación
        setTimeout(() => {
            parqueEncontrado.marker.openPopup();
        }, 800);
    } else {
        console.warn('⚠️ No se encontró el parque:', nombreBuscado);
        console.log('Parques disponibles:', allMarkers.map(m => m.data.properties.Name));
    }
}

// ======================================
// INICIALIZACIÓN DEL MAPA
// ======================================
function initMap() {
    // Crear el mapa centrado en Ciudad de México
    map = L.map('map', {
        center: [19.344796609, -99.238588729],
        zoom: 13,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: true,
        tap: true,
        tapTolerance: 15
    });

    // Mover controles de zoom a la derecha
    map.zoomControl.setPosition('topright');

    // Capa base de OpenStreetMap
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    });

    // Capa satelital
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri',
        maxZoom: 19
    });

    // Agregar capa por defecto
    osmLayer.addTo(map);

    // Control de capas
    const baseMaps = {
        "Mapa": osmLayer,
        "Satélite": satelliteLayer
    };
    L.control.layers(baseMaps).addTo(map);

    // Inicializar capa de marcadores (sin agrupación)
    markersLayer = L.layerGroup().addTo(map);

    // Cargar límite de la alcaldía
    loadLimiteAlcaldia();
    
    // Cargar ejes viales
    loadEjesViales();
}

// ======================================
// EVENT LISTENERS
// ======================================
function initEventListeners() {
    // Menú lateral
    const menuBtn = document.getElementById('menuBtn');
    const closePanel = document.getElementById('closePanel');
    const overlay = document.getElementById('overlay');
    const sidePanel = document.getElementById('sidePanel');

    menuBtn.addEventListener('click', openPanel);
    closePanel.addEventListener('click', closePanel_);
    overlay.addEventListener('click', closePanel_);

    function openPanel() {
        sidePanel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePanel_() {
        sidePanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Botón de ubicación
    const locationBtn = document.getElementById('locationBtn');
    locationBtn.addEventListener('click', getUserLocation);

    // Filtros
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', debounce(filterMarkers, 300));
}

// ======================================
// CARGA DEL LIMITE DE LA ALCALDIA
// ======================================
function loadLimiteAlcaldia() {
    console.log('Intentando cargar limite de alcaldia...');
    fetch('archivos/limite_alcaldia.geojson')
        .then(response => {
            console.log('Respuesta del archivo:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('GeoJSON cargado:', data);
            limiteAlcaldiaLayer = L.geoJSON(data, {
                style: {
                    color: '#922B21',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0,
                    dashArray: '0'
                },
                interactive: false,
                pane: 'overlayPane'
            }).addTo(map);
            
            // Ajustar vista al limite
            map.fitBounds(limiteAlcaldiaLayer.getBounds());
            
            console.log('Limite de alcaldia cargado y agregado al mapa');
        })
        .catch(error => {
            console.error('Error al cargar el limite de la alcaldia:', error);
        });
}

// ======================================
// CARGA DE EJES VIALES
// ======================================
function loadEjesViales() {
    console.log('Cargando ejes viales...');
    fetch('archivos/ejes_viales.geojson')
        .then(response => response.json())
        .then(data => {
            ejesVialesData = data;
            console.log('✅ Ejes viales cargados:', data.features.length, 'segmentos');
        })
        .catch(error => {
            console.warn('⚠️ No se pudieron cargar los ejes viales:', error);
        });
}

// ======================================
// CARGA DE DATOS
// ======================================
function loadData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.classList.add('active');

    fetch(PARQUES_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de parques');
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Datos cargados:', data.features.length, 'parques');
            allData = data.features;
            processData(data.features);
            loadingIndicator.classList.remove('active');
        })
        .catch(error => {
            console.error('❌ Error al cargar datos:', error);
            loadingIndicator.classList.remove('active');
            alert('Error al cargar los parques.\n\nPor favor, intenta recargar la página.');
        });
}

// Función alternativa con proxy CORS (ya no necesaria)
function loadDataWithProxy() {
    // Esta función ya no es necesaria para GeoJSON local
}

// ======================================
// PROCESAMIENTO DE DATOS
// ======================================
function processData(features) {
    features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const lng = coords[0];
        const lat = coords[1];
        
        if (isNaN(lat) || isNaN(lng)) {
            console.warn('Coordenadas inválidas:', feature);
            return;
        }

        // Crear marcador
        const marker = createMarker(feature, lat, lng);
        allMarkers.push({ marker, data: feature, lat, lng });
        markersLayer.addLayer(marker);
    });

    // Actualizar información
    updateInfo();
    
    // Verificar si hay un parque en la URL para abrirlo
    abrirParqueDesdeURL();
}

// ======================================
// CREACIÓN DE MARCADORES
// ======================================
function createMarker(feature, lat, lng) {
    // Icono personalizado para parques (árbol)
    const icon = L.divIcon({
        html: '<i class="fas fa-tree" style="color: #2E7D32; font-size: 28px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        className: 'tree-marker-icon'
    });

    const marker = L.marker([lat, lng], { icon });
    
    // Crear contenido del popup
    const popupContent = createPopupContent(feature);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });

    return marker;
}

// ======================================
// CONTENIDO DEL POPUP
// ======================================
function createPopupContent(feature) {
    const nombre = feature.properties.Name || 'Sin nombre';
    const coords = feature.geometry.coordinates;
    const lat = coords[1];
    const lng = coords[0];
    
    // Crear link de Google Maps
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    let content = `<div class="popup-content-custom">`;
    content += `<h3>${nombre}</h3>`;
    
    content += `<a href="${googleMapsLink}" target="_blank" class="popup-link"><i class="fas fa-route"></i> Cómo llegar</a>`;
    
    content += `</div>`;
    return content;
}

// ======================================
// FILTRADO DE MARCADORES
// ======================================
function filterMarkers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    markersLayer.clearLayers();

    const filtered = allMarkers.filter(item => {
        const nombre = (item.data.properties.Name || '').toLowerCase();
        return searchTerm === '' || nombre.includes(searchTerm);
    });

    filtered.forEach(item => {
        markersLayer.addLayer(item.marker);
    });
    
    // Actualizar marcadores filtrados para búsqueda
    filteredMarkers = filtered;

    updateInfo(filtered.length);
}


// ======================================
// ACTUALIZACIÓN DE INFORMACIÓN
// ======================================
function updateInfo(count) {
    const totalPuntos = document.getElementById('totalPuntos');
    const total = count !== undefined ? count : allMarkers.length;
    totalPuntos.innerHTML = `
        <strong>${total}</strong> parque${total !== 1 ? 's' : ''} ${count !== undefined ? 'encontrado' + (total !== 1 ? 's' : '') : 'disponible' + (total !== 1 ? 's' : '')}
    `;
}

// ======================================
// GEOLOCALIZACIÓN
// ======================================
function getUserLocation() {
    const locationBtn = document.getElementById('locationBtn');
    
    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización');
        return;
    }

    locationBtn.classList.add('loading');
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            console.log(`Ubicación obtenida: ${lat}, ${lng} (±${accuracy}m)`);

            // Remover marcadores anteriores
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }
            if (userLocationCircle) {
                map.removeLayer(userLocationCircle);
            }

            // Crear círculo de precisión
            userLocationCircle = L.circle([lat, lng], {
                radius: accuracy,
                color: '#4285F4',
                fillColor: '#4285F4',
                fillOpacity: 0.15,
                weight: 2
            }).addTo(map);

            // Crear marcador de ubicación
            const locationIcon = L.divIcon({
                html: '<div class="user-location-marker"></div>',
                className: 'user-location-icon',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            userLocationMarker = L.marker([lat, lng], { icon: locationIcon })
                .bindPopup('Tu ubicación actual')
                .addTo(map);

            // Centrar mapa
            map.setView([lat, lng], 15);

            locationBtn.classList.remove('loading');

            // Alertar si la precisión es baja
            if (accuracy > 1000) {
                alert(`⚠️ Precisión baja (±${Math.round(accuracy)}m). Para mejor precisión, activa el GPS y sal al exterior.`);
            }
        },
        (error) => {
            locationBtn.classList.remove('loading');
            
            let message = 'No se pudo obtener tu ubicación. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message += 'Permiso denegado. Por favor, permite el acceso a tu ubicación.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += 'Ubicación no disponible.';
                    break;
                case error.TIMEOUT:
                    message += 'Tiempo de espera agotado. Intenta de nuevo.';
                    break;
                default:
                    message += 'Error desconocido.';
            }
            alert(message);
            console.error('Error de geolocalización:', error);
        },
        options
    );
}

// ======================================
// UTILIDADES
// ======================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ======================================
// ESTILOS ADICIONALES PARA POPUPS
// ======================================
const popupStyles = document.createElement('style');
popupStyles.textContent = `
    .custom-popup .leaflet-popup-content {
        margin: 15px;
        line-height: 1.6;
    }
    .popup-content-custom h3 {
        color: #2E7D32;
        margin: 0 0 12px 0;
        font-size: 1.15rem;
        font-weight: 600;
    }
    .popup-content-custom p {
        margin: 8px 0;
        font-size: 0.9rem;
    }
    .popup-content-custom strong {
        color: #333;
    }
    .popup-content-custom i {
        margin-right: 5px;
        color: #2E7D32;
        width: 16px;
        display: inline-block;
    }
    .popup-link {
        display: inline-block;
        margin-top: 10px;
        padding: 10px 15px;
        background: #2E7D32;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-size: 0.9rem;
        transition: background 0.3s ease;
        font-weight: 500;
    }
    .popup-link:hover {
        background: #1B5E20;
        color: white !important;
    }
    .popup-link i {
        color: white !important;
        margin-right: 8px;
    }
    .custom-div-icon {
        background: none;
        border: none;
    }
    .user-location-icon {
        background: none;
        border: none;
    }
`;
document.head.appendChild(popupStyles);

console.log('🗺️ Geoportal Turístico cargado correctamente');

// ======================================
// ENCONTRAR PARQUE MÁS CERCANO
// ======================================
function findNearestPuntoDalia() {
    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización');
        return;
    }
    
    const btn = document.getElementById('nearestBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            console.log('📍 Ubicación del usuario:', userLat, userLng);
            
            // Usar marcadores filtrados si hay filtros activos, sino usar todos
            const marcadoresParaBuscar = filteredMarkers.length > 0 ? filteredMarkers : allMarkers;
            
            if (marcadoresParaBuscar.length === 0) {
                alert('No hay parques disponibles con los filtros actuales');
                btn.innerHTML = '<i class="fas fa-search"></i>';
                btn.disabled = false;
                return;
            }
            
            // Calcular distancias
            const distancias = marcadoresParaBuscar.map(item => {
                const distancia = calcularDistancia(userLat, userLng, item.lat, item.lng);
                
                return {
                    marker: item.marker,
                    data: item.data,
                    distancia: distancia,
                    tiempoMinutos: Math.round((distancia * 1000 / 4000) * 60),
                    lat: item.lat,
                    lng: item.lng,
                    metodo: 'línea recta'
                };
            });
            
            // Ordenar por distancia
            distancias.sort((a, b) => a.distancia - b.distancia);
            
            // Obtener el más cercano
            const masCercano = distancias[0];
            
            if (masCercano) {
                // Limpiar marcadores previos
                if (userLocationMarker) {
                    map.removeLayer(userLocationMarker);
                }
                if (userLocationCircle) {
                    map.removeLayer(userLocationCircle);
                }
                if (rutaActual) {
                    map.removeLayer(rutaActual);
                    rutaActual = null;
                }
                
                // Marcar ubicación del usuario
                userLocationMarker = L.marker([userLat, userLng], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(map);
                userLocationMarker.bindPopup('Tu ubicación');
                
                // Dibujar ruta
                rutaActual = L.polyline(
                    [[userLat, userLng], [masCercano.lat, masCercano.lng]],
                    {
                        color: '#2E7D32',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '10, 10'
                    }
                ).addTo(map);
                
                // Centrar el mapa en el parque encontrado
                setTimeout(() => {
                    map.setView([masCercano.lat, masCercano.lng], 17);
                    
                    setTimeout(() => {
                        masCercano.marker.openPopup();
                    }, 300);
                }, 100);
            }
            
            btn.innerHTML = '<i class="fas fa-search"></i>';
            btn.disabled = false;
        },
        (error) => {
            console.error('Error al obtener ubicación:', error);
            alert('No se pudo obtener tu ubicación. Por favor, activa los permisos de ubicación.');
            btn.innerHTML = '<i class="fas fa-search"></i>';
            btn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// ======================================
// CALCULAR DISTANCIA ENTRE DOS PUNTOS (Haversine)
// ======================================
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}


// ======================================
// CALCULAR DISTANCIAS CON EJES VIALES
// ======================================
function calcularDistanciasConEjesViales(userLat, userLng, markers) {
    // 1. Encontrar el eje vial más cercano a la ubicación del usuario
    const userEjeVial = encontrarEjeVialMasCercano(userLat, userLng);
    
    if (!userEjeVial) {
        console.warn('⚠️ Usuario muy lejos de ejes viales, usando distancia directa');
        // Fallback a distancia directa
        return markers.map(item => {
            const distancia = calcularDistancia(userLat, userLng, item.lat, item.lng);
            
            return {
                marker: item.marker,
                data: item.data,
                distancia: distancia,
                tiempoMinutos: Math.round((distancia * 1000 / 4000) * 60),
                lat: item.lat,
                lng: item.lng,
                metodo: 'línea recta'
            };
        });
    }
    
    console.log('✅ Usuario conectado a eje vial:', userEjeVial.distanciaAlEje.toFixed(0), 'metros');
    
    // 2. Para cada parque, calcular ruta aproximada
    return markers.map(item => {
        // Encontrar eje vial más cercano al punto
        const puntoEjeVial = encontrarEjeVialMasCercano(item.lat, item.lng);
        
        // Distancia en línea recta
        const distanciaDirecta = calcularDistancia(userLat, userLng, item.lat, item.lng);
        
        let tiempoMinutos, distanciaTotal, metodo;
        
        if (puntoEjeVial && puntoEjeVial.distanciaAlEje < 0.3) {
            // El punto está cerca de un eje vial (menos de 300 metros)
            // Calcular tiempo considerando ejes viales
            
            // Distancia desde usuario hasta su eje vial
            const distUserAEje = userEjeVial.distanciaAlEje / 1000;
            
            // Distancia desde el eje del punto hasta el punto
            const distEjeAPunto = puntoEjeVial.distanciaAlEje / 1000;
            
            // Distancia entre los dos ejes (aproximada)
            const distanciaEntreEjes = calcularDistancia(
                userEjeVial.punto.lat, 
                userEjeVial.punto.lng,
                puntoEjeVial.punto.lat,
                puntoEjeVial.punto.lng
            );
            
            // Distancia total ajustada (factor 1.3 para considerar que no es línea recta)
            distanciaTotal = (distUserAEje + distanciaEntreEjes * 1.3 + distEjeAPunto);
            
            // Tiempo basado en velocidad de caminata
            const tiempoCaminata = (distanciaTotal * 1000 / 4000) * 60; // 4 km/h
            
            tiempoMinutos = Math.round(tiempoCaminata);
            metodo = 'ejes viales';
        } else {
            // Punto muy lejos de ejes viales, usar distancia directa
            distanciaTotal = distanciaDirecta;
            tiempoMinutos = Math.round((distanciaDirecta * 1000 / 4000) * 60);
            metodo = 'línea recta';
        }
        
        return {
            marker: item.marker,
            data: item.data,
            distancia: distanciaTotal,
            tiempoMinutos: tiempoMinutos,
            lat: item.lat,
            lng: item.lng,
            metodo: metodo
        };
    });
}

// ======================================
// ENCONTRAR EJE VIAL MÁS CERCANO
// ======================================
function encontrarEjeVialMasCercano(lat, lng) {
    if (!ejesVialesData || !ejesVialesData.features) {
        return null;
    }
    
    let ejeVialMasCercano = null;
    let distanciaMinima = Infinity;
    let puntoMasCercano = null;
    
    // Buscar solo en un radio de 500 metros (0.5 km)
    const RADIO_BUSQUEDA = 0.5;
    
    ejesVialesData.features.forEach(feature => {
        if (feature.geometry.type === 'MultiLineString') {
            feature.geometry.coordinates.forEach(lineString => {
                // Para cada segmento del eje vial
                for (let i = 0; i < lineString.length - 1; i++) {
                    const p1 = { lng: lineString[i][0], lat: lineString[i][1] };
                    const p2 = { lng: lineString[i + 1][0], lat: lineString[i + 1][1] };
                    
                    // Distancia rápida al primer punto del segmento
                    const distP1 = calcularDistancia(lat, lng, p1.lat, p1.lng);
                    
                    // Solo procesar si está dentro del radio de búsqueda
                    if (distP1 < RADIO_BUSQUEDA) {
                        // Calcular punto más cercano en el segmento
                        const puntoEnSegmento = puntoMasCercanoEnSegmento(
                            { lat, lng },
                            p1,
                            p2
                        );
                        
                        const distancia = calcularDistancia(
                            lat, 
                            lng, 
                            puntoEnSegmento.lat, 
                            puntoEnSegmento.lng
                        );
                        
                        if (distancia < distanciaMinima) {
                            distanciaMinima = distancia;
                            ejeVialMasCercano = feature;
                            puntoMasCercano = puntoEnSegmento;
                        }
                    }
                }
            });
        }
    });
    
    if (ejeVialMasCercano) {
        return {
            eje: ejeVialMasCercano,
            punto: puntoMasCercano,
            distanciaAlEje: distanciaMinima * 1000 // en metros
        };
    }
    
    return null;
}

// ======================================
// PUNTO MÁS CERCANO EN UN SEGMENTO
// ======================================
function puntoMasCercanoEnSegmento(punto, p1, p2) {
    const A = punto.lng - p1.lng;
    const B = punto.lat - p1.lat;
    const C = p2.lng - p1.lng;
    const D = p2.lat - p1.lat;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
        param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
        xx = p1.lng;
        yy = p1.lat;
    } else if (param > 1) {
        xx = p2.lng;
        yy = p2.lat;
    } else {
        xx = p1.lng + param * C;
        yy = p1.lat + param * D;
    }
    
    return { lat: yy, lng: xx };
}

// ======================================
// CALCULAR RUTA POR EJES VIALES
// ======================================
function calcularRutaPorEjesViales(origenLat, origenLng, destinoLat, destinoLng) {
    // Si no hay ejes viales, retornar línea recta simple
    if (!ejesVialesData || !ejesVialesData.features || ejesVialesData.features.length === 0) {
        return [[origenLat, origenLng], [destinoLat, destinoLng]];
    }
    
    // Encontrar ejes viales cercanos al origen y destino
    const ejeOrigen = encontrarEjeVialMasCercano(origenLat, origenLng);
    const ejeDestino = encontrarEjeVialMasCercano(destinoLat, destinoLng);
    
    // Si no se encuentran ejes cercanos, usar línea recta
    if (!ejeOrigen || !ejeDestino || ejeOrigen.distanciaAlEje > 500 || ejeDestino.distanciaAlEje > 500) {
        return [[origenLat, origenLng], [destinoLat, destinoLng]];
    }
    
    // Construir ruta simplificada (sin puntos intermedios complejos)
    const puntosRuta = [];
    
    // 1. Desde origen hasta eje vial más cercano
    puntosRuta.push([origenLat, origenLng]);
    
    // Si el origen está muy cerca del eje (menos de 50 metros), no mostrar el segmento
    if (ejeOrigen.distanciaAlEje > 50) {
        puntosRuta.push([ejeOrigen.punto.lat, ejeOrigen.punto.lng]);
    }
    
    // 2. Línea directa al eje del destino (representando el recorrido por calles)
    if (ejeDestino.distanciaAlEje > 50) {
        puntosRuta.push([ejeDestino.punto.lat, ejeDestino.punto.lng]);
    }
    
    // 3. Finalmente al destino
    puntosRuta.push([destinoLat, destinoLng]);
    
    return puntosRuta;
}
