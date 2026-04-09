# Proyecta: Analysis & Growth

Proyecto desarrollado en el marco de **oportunidades de la Fundación Gloria Kriete**: aplicación web para visualizar **interés compuesto** y comparar supuestos de crecimiento.

**Qué hace:** a partir de capital inicial (V₀), tasa anual (r) y horizonte en años (t), calcula en paralelo escenarios **optimista (r + 5%)**, **realista (r)** y **pesimista (r − 5%, mín. 0%)**; muestra gráfico (exponencial vs. referencia lineal), KPIs (valor final, ROI, break-even), modo de estrés opcional y una **tabla año a año** (sin fórmula cerrada). **Chart.js** va en `proyecta/vendor/` (sin CDN).

**Estructura del repo:**

- `proyecta/` — sitio estático listo para abrir con un servidor local o Vercel (`index.html`, `css/`, `js/`, `vendor/`).
- Raíz — `package.json` solo para **regenerar** el bundle de Chart.js (opcional).

## Requisitos

| Para… | Necesitas |
|--------|-----------|
| Ejecutar la app | Navegador reciente + **Node.js** (incluye `npx`) |
| Solo ver la web en local | **No** hace falta `npm install` en la raíz |

## Ejecutar en local

La aplicación es una **página web con varios archivos**. El navegador necesita un **pequeño programa en segundo plano** (servidor local) que “sirva” esos archivos por una dirección tipo `http://localhost:…`. **No basta** con hacer doble clic en `index.html`: en muchos equipos el gráfico no cargará por seguridad del navegador.

### 1. Tener el código en tu computadora

- Si usas **Git**: clona el repo donde quieras (por ejemplo `Documentos`).
- Si **no** usas Git: en GitHub (o donde esté el repo) usa **Code → Download ZIP**, descomprime y recuerda **en qué carpeta** quedó (por ejemplo `Proyecta`).

Dentro verás una carpeta llamada **`proyecta`** (minúsculas). Ahí dentro deben existir archivos como `index.html`, carpetas `css`, `js` y `vendor`. **Esa** es la carpeta de la app.

### 2. Abrir la terminal en la carpeta correcta

- **Windows:** clic derecho en la carpeta `proyecta` → **“Abrir en Terminal”** o **“Abrir ventana de PowerShell aquí”**.  
  Si abres la terminal en otro sitio, llega a la carpeta con comandos (ajusta la ruta a la tuya):

  ```powershell
  cd "C:\Users\TU_USUARIO\Documentos\Proyecta\proyecta"
  ```

  Comprueba que estás en el sitio adecuado: al listar archivos deberías ver `index.html`:

  ```powershell
  dir
  ```

  En Mac o Linux, el equivalente suele ser `ls`.

### 3. Comprobar que tienes Node.js

En la misma terminal escribe:

```bash
node -v
```

Debería mostrarse algo como `v20.x.x` o `v22.x.x` (cualquier versión **LTS** reciente sirve).

Si dice que **no reconoce** el comando o no está instalado:

1. Descarga e instala Node desde [nodejs.org](https://nodejs.org/) (elige la versión **LTS**).
2. **Cierra y vuelve a abrir** la terminal (o reinicia el equipo si hace falta).
3. Repite `node -v` hasta que muestre una versión.

### 4. Arrancar el servidor con Node

Estando **dentro** de la carpeta `proyecta` (donde está `index.html`), ejecuta:

```bash
npx --yes serve .
```

- La primera vez puede tardar un poco mientras descarga la herramienta `serve`.
- En la terminal aparecerá una línea con una dirección, por ejemplo **`http://localhost:3000`** o **`http://127.0.0.1:3000`**.
- **Cópiala y pégala en la barra de direcciones del navegador** (Chrome, Edge, Firefox, etc.) y pulsa Enter.
- Para **detener** el servidor: en la terminal pulsa **Ctrl + C** y confirma si lo pide.

Si el **puerto por defecto está ocupado**, usa otro puerto (ejemplo con `5000`):

```bash
npx --yes serve -l 5000 .
```

Luego abre `http://localhost:5000` en el navegador.

### 5. Si algo no funciona

- **“No se reconoce node”:** Node no está instalado o la terminal no lo ve; reinstala desde [nodejs.org](https://nodejs.org/) (LTS), cierra la terminal, abre una nueva y vuelve al paso 3.
- **Página en blanco o errores en la consola del navegador (F12):** casi siempre es que **no** estás sirviendo desde la carpeta `proyecta` o abriste el archivo como `file://`. Vuelve al paso 2 y confirma que `index.html` está en la carpeta actual.
- **“El puerto está en uso”:** usa otro puerto con `npx --yes serve -l 5000 .` (o cambia `5000` por otro número) y abre la URL que indique la terminal.
- **Firewall de Windows:** si pregunta si permitir **Node.js** en la red, puedes permitir en **red privada** para trabajar con `localhost`.

## Despliegue en Vercel

1. Conecta el repositorio al proyecto en Vercel.
2. **Root Directory:** `proyecta`.
3. **Framework Preset:** Other (sin build obligatorio).

## Actualizar Chart.js (opcional, desde la raíz del repo)

```bash
npm install
```

Copia el archivo:

`node_modules/chart.js/dist/chart.umd.js` → `proyecta/vendor/chart.umd.js` (sustituyendo el existente).
