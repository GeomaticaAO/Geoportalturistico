# 📊 Guía para Actualizar la Base de Datos

## Cómo editar los Puntos Dalia

### 1️⃣ Acceder a Google Sheets

Ve a tu hoja de cálculo:
```
https://docs.google.com/spreadsheets/d/TU-ID-DE-SHEET/edit
```

### 2️⃣ Formato de las Columnas

Tu hoja **DEBE** tener estas columnas en este orden:

| Columna | Nombre | Descripción | Ejemplo |
|---------|--------|-------------|---------|
| A | Punto Dalia | Identificador único | PD-001 |
| B | Nombre del punto Dalia | Nombre descriptivo | Centro Comunitario Sur |
| C | Horario de atención | Horario de servicio | Lun-Vie 9:00-18:00 |
| D | Tipo | Categoría del servicio | Centro de Desarrollo |
| E | Dirección | Dirección completa | Av. Principal 123 |
| F | Colonia | Nombre de la colonia | Santa Fe |
| G | Link de Google Maps | URL de Google Maps | https://goo.gl/maps/... |
| H | Contacto | Teléfono o correo | 55-1234-5678 |
| I | Latitud | Coordenada latitud | 19.344796 |
| J | Longitud | Coordenada longitud | -99.238588 |

### 3️⃣ Agregar un Nuevo Punto

1. Ir a la última fila con datos
2. Agregar una nueva fila debajo
3. Completar todos los campos
4. **Importante:** Obtener las coordenadas correctas

#### ¿Cómo obtener las coordenadas?

**Opción 1: Desde Google Maps**
1. Abre [Google Maps](https://maps.google.com)
2. Busca la dirección
3. Click derecho sobre el punto exacto
4. Click en las coordenadas que aparecen arriba
5. Se copian al portapapeles (formato: 19.344796, -99.238588)
6. Pega en Excel y separa en dos columnas

**Opción 2: Desde Google Maps (método alternativo)**
1. Busca la dirección en Google Maps
2. La URL mostrará algo como: `.../@19.344796,-99.238588,17z`
3. Los números después de `@` son: latitud, longitud
4. Copia esos números a tu hoja

### 4️⃣ Editar un Punto Existente

1. Busca el punto en la hoja
2. Modifica los campos necesarios
3. Los cambios se reflejarán automáticamente en el mapa

### 5️⃣ Eliminar un Punto

1. Selecciona toda la fila del punto
2. Click derecho → Eliminar fila
3. El punto desaparecerá del mapa automáticamente

### 6️⃣ Verificar que la Hoja esté Publicada

**IMPORTANTE:** La hoja debe estar publicada para que el mapa la lea.

1. En tu hoja de Google Sheets
2. Menú: **Archivo** → **Compartir** → **Publicar en la web**
3. En la primera lista, selecciona la hoja específica o "Todo el documento"
4. En la segunda lista, selecciona **"Valores separados por comas (.csv)"**
5. Click en **Publicar**
6. Copia la URL que te dan
7. Si es diferente a la que está en `app.js`, actualiza el archivo

### 7️⃣ Tiempo de Actualización

- **Cambios en Google Sheets:** Instantáneos
- **Reflejado en el mapa:** 1-5 minutos (puede variar)
- **Si no se actualiza:** Limpia la caché del navegador (Ctrl + F5)

## ⚠️ Errores Comunes

### ❌ Los puntos no aparecen

**Causa:** Coordenadas incorrectas

**Solución:** 
- Verifica que las coordenadas tengan el formato correcto
- Latitud: número entre -90 y 90
- Longitud: número entre -180 y 180
- Usa punto (.) no coma (,) para decimales

### ❌ Coordenadas invertidas

**Síntoma:** Los puntos aparecen en el lugar equivocado

**Solución:**
- Verifica el orden: primero Latitud, luego Longitud
- Latitud (Y) = qué tan al norte/sur
- Longitud (X) = qué tan al este/oeste

### ❌ El mapa no carga los datos

**Solución:**
1. Verifica que la hoja esté publicada como CSV
2. Verifica que la URL sea correcta
3. Prueba abrir la URL del CSV en el navegador
4. Debe mostrar texto separado por comas

## 📝 Plantilla para Nuevos Puntos

Copia y pega esto en tu hoja y completa los datos:

```
Punto Dalia: PD-XXX
Nombre: [Nombre del punto]
Horario: Lun-Vie 9:00-18:00
Tipo: [Centro de Desarrollo / Punto de Atención / etc.]
Dirección: [Calle y número]
Colonia: [Nombre de la colonia]
Link Google Maps: [URL completa]
Contacto: [Teléfono o email]
Latitud: [19.XXXXX]
Longitud: [-99.XXXXX]
```

## 🔍 Validar tus Datos

Antes de guardar, verifica:

- [ ] ✅ Todas las celdas obligatorias están llenas
- [ ] ✅ Las coordenadas son números válidos
- [ ] ✅ El horario está claro
- [ ] ✅ El link de Google Maps funciona
- [ ] ✅ El tipo está escrito correctamente (sin errores ortográficos)

## 🆘 Necesitas Ayuda?

Si tienes problemas:
1. Revisa que el formato de la hoja sea correcto
2. Verifica que esté publicada en la web
3. Limpia la caché del navegador
4. Espera unos minutos para que se propague

## 🎯 Tips Útiles

- **Mantén consistencia** en los nombres de tipos
- **Usa mayúsculas** de forma consistente
- **Verifica las coordenadas** antes de publicar
- **Haz respaldos** de tu hoja periódicamente
- **Documenta cambios** importantes en una columna de notas

---

**Recuerda:** Cualquier cambio que hagas en Google Sheets se reflejará automáticamente en el mapa. ¡No necesitas tocar ningún código! 🎉
