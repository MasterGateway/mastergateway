# 🎓 Sistema de Consulta de Estudiantes - UNAS

Sistema web moderno e intuitivo para consultar información de estudiantes de la Universidad Nacional Agraria de la Selva (UNAS).

## 🌟 Características

- **🤖 Agente Virtual Animado**: Bot interactivo que guía al usuario durante la búsqueda
- **🔍 Búsqueda Unificada**: Un solo campo de búsqueda para nombre, DNI o código universitario
- **📸 Visualización de Fotos**: Muestra las fotografías de los estudiantes cuando están disponibles
- **📊 Estadísticas en Tiempo Real**: Visualiza el total de estudiantes, fotos disponibles y última actualización
- **💫 Interfaz Moderna**: Diseño responsive con animaciones suaves y atractivas
- **⚡ Búsqueda Rápida**: Resultados instantáneos con retroalimentación visual

## 📁 Estructura del Proyecto

```
web_consulta/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── app.js             # Lógica de la aplicación
└── README.md          # Esta documentación
```

## 🚀 Cómo Usar

### Opción 1: Abrir directamente
1. Abra el archivo `index.html` en su navegador web favorito
2. Si las fotos no se cargan, use la Opción 2

### Opción 2: Servidor local (Recomendado)

#### Usando Python:
```bash
# Desde la carpeta web_consulta
python -m http.server 8000
```

Luego abra: http://localhost:8000

#### Usando Node.js (http-server):
```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# Desde la carpeta web_consulta
http-server -p 8000
```

Luego abra: http://localhost:8000

### Opción 3: Live Server en VS Code
1. Instale la extensión "Live Server" en VS Code
2. Haga clic derecho en `index.html`
3. Seleccione "Open with Live Server"

## 🔍 Funcionalidades de Búsqueda

El sistema permite buscar estudiantes por:

1. **Nombre completo o parcial**
   - Ejemplo: "MARIA", "GARCIA LOPEZ"

2. **DNI (completo o parcial)**
   - Ejemplo: "71320865", "7132"

3. **Código universitario (completo o parcial)**
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
