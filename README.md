# 🎓 Sistema de Consulta Dual - UNAS + RENIEC

Sistema web moderno e intuitivo para consultar información de estudiantes de la Universidad Nacional Agraria de la Selva (UNAS) y datos de RENIEC mediante API.

## 🌟 Características

### Sistema Dual de Consulta
- **🎓 Base de Datos Local**: Consulta por código de estudiante (2337 registros)
- **🏛️ API RENIEC**: Consulta por DNI (8 dígitos) usando API de Factiliza

### Funcionalidades Principales
- **🤖 Agente Virtual Animado**: Bot interactivo con síntesis de voz en español
- **🔍 Búsqueda Inteligente**: Detecta automáticamente si es código o DNI
- **💡 Autocompletado**: Sugerencias en tiempo real mientras escribes
- **📸 Visualización de Fotos**: Muestra fotografías de estudiantes y RENIEC
- **📊 Estadísticas en Tiempo Real**: Total de estudiantes y fotos disponibles
- **💫 Interfaz Moderna**: Diseño glassmorphism con animaciones suaves
- **🔒 Seguridad Avanzada**: Encriptación de API, rate limiting, DevTools bloqueado
- **🎨 Tema Oscuro/Claro**: Alternancia de temas con preferencias guardadas
- **⚡ Resultados Instantáneos**: Búsqueda rápida con retroalimentación visual

## � Tipos de Búsqueda

### 1️⃣ Búsqueda por Código de Estudiante
```
Formato: 0020240001 (10 dígitos)
Fuente: Base de datos local (estudiantes.json)
Datos: Nombre, DNI, Email, Teléfono, Año de ingreso, Foto local
```

### 2️⃣ Búsqueda por DNI
```
Formato: 61020080 (8 dígitos)
Fuente: API de Factiliza/RENIEC
Datos: Nombre completo, Dirección, Ubigeo, Estado civil, Fecha de nacimiento
```

## �📁 Estructura del Proyecto

```
web_consulta/
├── server.py              # Backend Flask con integración RENIEC
├── index.html             # Página principal (interfaz)
├── static/
│   ├── styles.css         # Estilos y diseño responsivo
│   ├── app.js             # Lógica del frontend
│   └── musica.mp3         # Audio para efectos especiales
├── fotos/                 # Fotografías de estudiantes (1964 imágenes)
├── estudiantes.json       # Base de datos local (2337 registros)
├── requirements.txt       # Dependencias Python
├── vercel.json           # Configuración de deployment
├── .env                  # Variables de entorno (NO SUBIR A GIT)
├── .env.example          # Ejemplo de configuración
├── ENV_SETUP.md          # Guía de configuración de variables
└── README.md             # Esta documentación
```

## 🚀 Instalación y Uso

### 📋 Requisitos Previos

- Python 3.11+
- Pip (gestor de paquetes de Python)
- Token de API de Factiliza (para consultas de RENIEC)

### ⚙️ Configuración Inicial

#### 1. Clonar el repositorio
```bash
git clone https://github.com/MasterGateway/mastergateway.git
cd mastergateway/web_consulta
```

#### 2. Crear archivo .env
```bash
# Copiar el ejemplo
cp ../.env.example ../.env

# Editar .env y agregar tu token de Factiliza
# RENIEC_TOKEN=tu_token_aqui
```

#### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

#### 4. Ejecutar el servidor
```bash
python server.py
```

#### 5. Abrir en navegador
```
http://localhost:5000
```

### 🌐 Deployment en Vercel

#### Configuración de Variables de Entorno

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Agrega: `RENIEC_TOKEN` con tu token de Factiliza
4. Guarda y re-deploy

Ver más detalles en [ENV_SETUP.md](ENV_SETUP.md)

## 🔍 Cómo Buscar

### Búsqueda por Código de Estudiante
```
Ingresa: 0020240001
Sistema: Consulta base de datos local
Resultado: Datos del estudiante UNAS + foto
```

### Búsqueda por DNI (RENIEC)
```
Ingresa: 61020080
Sistema: Consulta API de Factiliza
Resultado: Datos de RENIEC (dirección, ubigeo, etc.)
```

### Búsqueda por Nombre
```
Ingresa: MARIA GARCIA
Sistema: Autocompletado con sugerencias
Resultado: Lista de coincidencias
```

## 🔍 Funcionalidades de Búsqueda

El sistema permite buscar estudiantes por:

1. **Código de estudiante completo**
   - Formato: 10 dígitos (Ej: 0020240001)
   - Fuente: Base de datos local

2. **DNI completo**
   - Formato: 8 dígitos (Ej: 61020080)
   - Fuente: API RENIEC/Factiliza

3. **Nombre completo o parcial**
   - Ejemplo: "MARIA", "GARCIA LOPEZ"
   - Ejemplo: "0020240001", "002024"

### Características de búsqueda:
- ✅ No distingue entre mayúsculas y minúsculas
- ✅ Búsqueda parcial (puede escribir solo parte del texto)
- ✅ Resultados múltiples cuando hay coincidencias
- ✅ Mensajes del bot personalizados según los resultados

## 📊 Información Mostrada

Para cada estudiante encontrado, se muestra:

- **Fotografía**: Si está disponible en la carpeta de fotos
- **Código Universitario**: Identificador único del estudiante
- **DNI**: Documento de identidad
- **Nombre Completo**: Nombres y apellidos
- **Email**: Correo electrónico (si está registrado)
- **Celular**: Número de teléfono (si está registrado)
- **Año de Ingreso**: Año en que ingresó a la universidad
- **Apellidos y Nombres**: Desglosados individualmente
- **Fecha de Consulta**: Cuándo se consultó la información

## 🎨 Características de la Interfaz

### Bot Virtual
- Animaciones suaves de rebote
- Ojos parpadeantes
- Mensajes contextuales según la acción del usuario
- Retroalimentación visual inmediata

### Diseño Responsive
- Se adapta a cualquier tamaño de pantalla
- Optimizado para móviles, tablets y escritorio
- Tarjetas de resultados elegantes
- Efectos hover y transiciones suaves

### Estadísticas
- Total de estudiantes en la base de datos
- Cantidad de estudiantes con fotografía
- Fecha de última actualización

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con gradientes, animaciones y grid
- **JavaScript Vanilla**: Sin dependencias externas
- **JSON**: Almacenamiento de datos

## 📝 Notas Técnicas

### Rutas de Archivos
El sistema espera encontrar los datos en:
```
../datos_consultados/estudiantes.json
../datos_consultados/fotos/[codigo].jpg
```

### Compatibilidad
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Requisitos
- Navegador web moderno (compatible con ES6+)
- Para cargar fotos locales, se recomienda usar un servidor local

## 🔧 Personalización

### Cambiar Colores
Edite las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --success-color: #10b981;
    /* ... más colores */
}
```

### Modificar Mensajes del Bot
Edite la función `updateBotMessage()` en `app.js`

### Ajustar Campos Mostrados
Modifique la función `createResultCard()` en `app.js`

## 🐛 Solución de Problemas

### Las fotos no se cargan
- Verifique que existe la carpeta `../datos_consultados/fotos/`
- Use un servidor local en lugar de abrir el HTML directamente
- Compruebe la consola del navegador para errores

### No se cargan los datos
- Verifique que existe el archivo `../datos_consultados/estudiantes.json`
- Revise la consola del navegador (F12) para errores
- Asegúrese de que el JSON tiene la estructura correcta

### La búsqueda no funciona
- Verifique que los datos se hayan cargado correctamente
- Limpie la caché del navegador
- Intente con diferentes términos de búsqueda

## 📄 Licencia

Este proyecto es de uso interno para la Universidad Nacional Agraria de la Selva (UNAS).

## 👥 Soporte

Para reportar problemas o sugerencias, contacte al administrador del sistema.

---

© 2026 Universidad Nacional Agraria de la Selva - Sistema de Consulta
