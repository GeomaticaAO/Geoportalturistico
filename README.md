# 🗺️ Geoportal Dalia

Plataforma web interactiva para visualizar y localizar todos los Puntos Dalia en un mapa interactivo, optimizada especialmente para dispositivos móviles.

## 📱 Características

- ✅ **Diseño responsive** - Optimizado para móviles, tablets y escritorio
- 🗺️ **Mapa interactivo** - Visualización de todos los puntos Dalia
- 📍 **Geolocalización** - Encuentra los puntos más cercanos a tu ubicación
- 🔄 **Actualización automática** - Se sincroniza automáticamente con Google Sheets
- 🔍 **Búsqueda y filtros** - Encuentra rápidamente el punto que necesitas
- 🎯 **Agrupación inteligente** - Los marcadores cercanos se agrupan para mejor visualización

## 🚀 Demo en Vivo

[Ver Demo](https://tu-usuario.github.io/geoportal-dalia)

## 📊 Fuente de Datos

Los datos se cargan automáticamente desde Google Sheets:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vRKAQcfj6fUWGt0H9phsiMs5TYWD8CquxOr-hAlfFPyM4tqMMJePNnSGYOUp5eb6g/pub?output=csv
```

### Estructura de Datos

El archivo CSV debe contener las siguientes columnas:
- **Punto Dalia** - Identificador del punto
- **Nombre del punto Dalia** - Nombre descriptivo
- **Horario de atención** - Horario de servicio
- **Tipo** - Categoría del punto
- **Dirección** - Dirección física
- **Colonia** - Colonia o barrio
- **Link de Google Maps** - Enlace directo a Google Maps
- **Contacto** - Información de contacto
- **Latitud** - Coordenada latitud
- **Longitud** - Coordenada longitud

## 🛠️ Tecnologías Utilizadas

- **Leaflet.js** - Biblioteca de mapas interactivos
- **Leaflet.markercluster** - Agrupación de marcadores
- **PapaParse** - Procesamiento de archivos CSV
- **Font Awesome** - Iconos
- **Vanilla JavaScript** - Sin dependencias de frameworks pesados

## 📥 Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/geoportal-dalia.git
   cd geoportal-dalia
   ```

2. **Abrir en un navegador**
   
   Opción 1: Abrir directamente el archivo `index.html`
   
   Opción 2: Usar un servidor local
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js (usando http-server)
   npx http-server
   ```

3. **Acceder a la aplicación**
   ```
   http://localhost:8000
   ```

## 🌐 Despliegue en GitHub Pages

### Paso 1: Crear repositorio en GitHub

1. Ir a [GitHub](https://github.com) y crear un nuevo repositorio
2. Nombrar el repositorio (ejemplo: `geoportal-dalia`)
3. Hacer el repositorio público

### Paso 2: Subir archivos

```bash
# Inicializar git en tu carpeta local
cd geoportal-dalia
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Geoportal Dalia"

# Conectar con el repositorio remoto
git remote add origin https://github.com/tu-usuario/geoportal-dalia.git

# Subir archivos
git branch -M main
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ir a tu repositorio en GitHub
2. Hacer clic en **Settings** (Configuración)
3. En el menú lateral, hacer clic en **Pages**
4. En **Source**, seleccionar la rama `main` y la carpeta `/ (root)`
5. Hacer clic en **Save**
6. Esperar unos minutos y tu sitio estará disponible en:
   ```
   https://tu-usuario.github.io/geoportal-dalia
   ```

## 🔄 Actualizar Datos

Para actualizar los puntos en el mapa:

1. Editar la hoja de cálculo de Google Sheets
2. Los cambios se reflejarán automáticamente en el mapa (puede tardar unos minutos)
3. No es necesario modificar ningún código

**Nota importante:** Asegúrate de que la hoja de cálculo esté configurada como "Publicar en la web" en formato CSV.

## 📱 Uso de la Aplicación

### En Móvil

1. **Abrir el mapa** - La aplicación se carga automáticamente
2. **Ver tu ubicación** - Toca el botón 📍 en la esquina inferior derecha
3. **Buscar puntos** - Toca el menú ☰ para abrir filtros y búsqueda
4. **Ver detalles** - Toca cualquier marcador para ver información completa
5. **Cómo llegar** - Toca "Cómo llegar" para abrir Google Maps

### Funcionalidades del Mapa

- **Zoom**: Usa dos dedos para acercar/alejar (pinch zoom)
- **Navegación**: Arrastra con un dedo para moverte por el mapa
- **Vista**: Cambia entre mapa normal y vista satelital
- **Clusters**: Los números en círculos rojos indican grupos de puntos cercanos

## 🔧 Configuración

### Cambiar la URL del CSV

Editar en `app.js`, línea 3:
```javascript
const CSV_URL = 'TU_URL_AQUI';
```

### Cambiar la ubicación inicial del mapa

Editar en `app.js`, función `initMap()`:
```javascript
map = L.map('map', {
    center: [LAT, LNG],  // Cambiar coordenadas
    zoom: 13             // Cambiar nivel de zoom
});
```

### Personalizar colores

Editar en `style.css`, sección `:root`:
```css
:root {
    --primary-color: #922B21;  /* Color principal */
    --primary-dark: #7a1f1a;   /* Color principal oscuro */
    /* ... */
}
```

## 📁 Estructura del Proyecto

```
geoportal-dalia/
├── index.html          # Página principal
├── style.css           # Estilos
├── app.js              # Lógica de la aplicación
├── README.md           # Documentación
└── .gitignore          # Archivos ignorados por Git
```

## 🐛 Solución de Problemas

### Los puntos no se cargan

1. Verificar que la URL del CSV sea correcta
2. Comprobar que la hoja de Google Sheets esté publicada como CSV
3. Revisar la consola del navegador (F12) para ver errores

### La geolocalización no funciona

1. Verificar que los permisos de ubicación estén habilitados
2. Usar HTTPS (requerido para geolocalización)
3. En dispositivos móviles, activar el GPS

### El mapa no se muestra

1. Verificar la conexión a Internet (se requiere para cargar el mapa)
2. Comprobar que las bibliotecas de Leaflet se carguen correctamente
3. Revisar la consola del navegador para errores

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📞 Soporte

Si tienes preguntas o problemas:
- Abrir un [Issue en GitHub](https://github.com/tu-usuario/geoportal-dalia/issues)
- Contactar al administrador del proyecto

## 🎯 Roadmap

- [ ] Modo offline con service workers
- [ ] Filtros por distancia
- [ ] Compartir ubicación de puntos específicos
- [ ] Modo oscuro
- [ ] Exportar lista de puntos filtrados
- [ ] Notificaciones de nuevos puntos cercanos

---

**Desarrollado con ❤️ para la comunidad**
