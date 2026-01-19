# 🚀 Guía Rápida de Despliegue en GitHub Pages

## Paso 1: Preparar tu repositorio local

Abre PowerShell o Terminal y navega a la carpeta del proyecto:

```powershell
cd "c:\Users\Ing Fredy Flores\Desktop\PUNTOS DALIA\geoportal-dalia"
```

## Paso 2: Inicializar Git

```powershell
git init
git add .
git commit -m "Initial commit - Geoportal Dalia"
```

## Paso 3: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `geoportal-dalia`
3. Descripción: "Geoportal interactivo para localizar Puntos Dalia"
4. Selecciona **Público**
5. NO marques ninguna casilla de inicialización
6. Click en **Create repository**

## Paso 4: Conectar con GitHub

Copia tu nombre de usuario de GitHub y ejecuta:

```powershell
git remote add origin https://github.com/TU-USUARIO/geoportal-dalia.git
git branch -M main
git push -u origin main
```

Ejemplo:
```powershell
git remote add origin https://github.com/juanperez/geoportal-dalia.git
git branch -M main
git push -u origin main
```

## Paso 5: Activar GitHub Pages

1. Ve a tu repositorio: `https://github.com/TU-USUARIO/geoportal-dalia`
2. Click en **Settings** (⚙️)
3. En el menú lateral, click en **Pages**
4. En **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click en **Save**
6. ¡Espera 2-3 minutos!

## 🎉 ¡Listo!

Tu sitio estará disponible en:
```
https://TU-USUARIO.github.io/geoportal-dalia
```

## 🔄 Para actualizar el sitio en el futuro

Cuando hagas cambios en los archivos:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

Los cambios se verán en tu sitio en 1-2 minutos.

## ⚠️ Verificar que todo funciona

1. Abre tu sitio web
2. Verifica que el mapa se cargue
3. Prueba el botón de ubicación 📍
4. Abre el menú y prueba los filtros
5. Toca un marcador para ver los detalles

## 🐛 Si algo no funciona

**El sitio no carga:**
- Espera 5 minutos y refresca
- Verifica que GitHub Pages esté activado en Settings → Pages

**Los puntos no aparecen:**
- Abre la consola del navegador (F12)
- Verifica que la URL del CSV sea correcta
- Comprueba que la hoja de Google esté publicada

**Comandos útiles:**

Ver el estado de git:
```powershell
git status
```

Ver el repositorio remoto:
```powershell
git remote -v
```

Deshacer cambios no guardados:
```powershell
git restore .
```

## 📞 Necesitas ayuda?

- [Documentación GitHub Pages](https://docs.github.com/es/pages)
- [Tutorial Git Básico](https://git-scm.com/book/es/v2)
