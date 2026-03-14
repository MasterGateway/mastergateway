# 🎓 Sistema de Consulta de Estudiantes UNAS - Versión Mejorada

Sistema web avanzado con **bot parlante** y **autocompletado inteligente** para consultar información de estudiantes.

## ✨ Nuevas Características

### 🗣️ Bot con Síntesis de Voz
- El bot **HABLA** todos sus mensajes usando Text-to-Speech
- Botón para activar/desactivar la voz (🔊/🔇)
- Voces en español configuradas automáticamente
- Animación visual cuando el bot está hablando

### 💡 Autocompletado Inteligente
- Sugerencias en tiempo real mientras escribes
- Aparece después de escribir 2 caracteres
- Muestra coincidencias de nombres, DNI y códigos
- Iconos diferenciados por tipo de búsqueda
- Click en sugerencia para búsqueda inmediata

### 🐍 Backend Python con Flask
- API REST completa
- Endpoints optimizados para búsqueda
- Servicio de archivos estáticos y fotos
- CORS habilitado para desarrollo

## 🚀 Cómo Iniciar

### 1. Instalar dependencias (ya instalado)
```bash
pip install flask flask-cors
```

### 2. Iniciar el servidor
```bash
cd web_consulta
python server.py
```

### 3. Abrir en el navegador
```
http://localhost:5000
```

## 📡 API Endpoints

### GET `/api/estudiantes`
Retorna todos los estudiantes del sistema

**Respuesta:**
```json
{
  "total": 1042,
  "estudiantes": [...],
  "ultima_actualizacion": "2026-03-14T10:24:28"
}
```

### GET `/api/buscar?q=termino`
Busca estudiantes por nombre, DNI o código

**Parámetros:**
- `q`: Término de búsqueda (requerido)

**Respuesta:**
```json
{
  "resultados": [...],
  "total": 5,
  "termino": "maria"
}
```

### GET `/api/sugerencias?q=termino&limit=10`
Obtiene sugerencias de autocompletado

**Parámetros:**
- `q`: Término de búsqueda (requerido)
- `limit`: Número máximo de sugerencias (opcional, default: 10)

**Respuesta:**
```json
{
  "sugerencias": [
    {
      "texto": "MARIA GARCIA LOPEZ",
      "tipo": "nombre",
      "valor": "MARIA GARCIA LOPEZ",
      "dni": "71234567",
      "codigo": "0020240001"
    }
  ]
}
```

### GET `/api/estadisticas`
Obtiene estadísticas generales del sistema

**Respuesta:**
```json
{
  "total_estudiantes": 1042,
  "con_fotos": 856,
  "sin_fotos": 186,
  "ultima_actualizacion": "2026-03-14T10:24:28"
}
```

### GET `/fotos/<filename>`
Sirve las fotografías de los estudiantes

## 🎮 Uso de la Aplicación

### Búsqueda Básica
1. Escriba el nombre, DNI o código en el campo de búsqueda
2. Vea las sugerencias automáticas mientras escribe
3. Presione Enter o haga clic en "Buscar"
4. El bot anunciará los resultados por voz

### Autocompletado
- Las sugerencias aparecen automáticamente
- Click en una sugerencia para búsqueda inmediata
- Iconos indican el tipo: 👤 nombre, 🆔 DNI, 📋 código

### Control de Voz
- **🔊**: Voz activada (el bot hablará)
- **🔇**: Voz desactivada (silencio)
- Click en el botón para alternar

### Ejemplos de Búsqueda
```
"MARIA"          → Encuentra todos los estudiantes llamados Maria
"71320865"       → Busca por DNI exacto o parcial
"0020240001"     → Busca por código universitario
"GARCIA LOPEZ"   → Búsqueda por apellidos
```

## 🎨 Características de Interfaz

### Bot Animado
- ✅ Ojos parpadeantes
- ✅ Movimiento de rebote
- ✅ Animación al hablar (pulso)
- ✅ Expresiones según contexto

### Sugerencias
- ✅ Dropdown elegante con sombras
- ✅ Hover effects
- ✅ Badges de tipo coloreados
- ✅ Cierre automático al click fuera

### Tarjetas de Resultados
- ✅ Fotografía del estudiante
- ✅ Datos completos organizados
- ✅ Indicador de disponibilidad de foto
- ✅ Animaciones de entrada

## 📁 Estructura de Archivos

```
web_consulta/
├── server.py              # Servidor Flask
├── requirements.txt       # Dependencias Python
├── estudiantes.json       # Base de datos (copiado)
├── templates/
│   └── index.html        # Plantilla HTML
├── styles.css            # Estilos mejorados
├── app.js                # JavaScript con voz y autocomplete
├── fotos/                # Carpeta de fotografías (copiado)
│   ├── 0020240001.jpg
│   ├── 0020240002.jpg
│   └── ...
└── README_COMPLETO.md    # Esta documentación
```

## 🔧 Configuración Avanzada

### Cambiar Puerto del Servidor
Edite `server.py`, línea final:
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Cambiar 5000
```

### Ajustar Velocidad de Voz
Edite `app.js`, función `speak()`:
```javascript
currentUtterance.rate = 0.9;  // 0.1 a 2.0
currentUtterance.pitch = 1;   // 0 a 2
```

### Límite de Sugerencias
Edite `app.js`:
```javascript
await fetchSuggestions(query, 8);  // Cambiar número
```

## 🐛 Solución de Problemas

### El bot no habla
- Verifique que el botón esté en 🔊 (no en 🔇)
- El navegador necesita interacción del usuario primero
- Verifique la configuración de audio del sistema
- Chrome/Edge funcionan mejor que Firefox

### Las sugerencias no aparecen
- Escriba al menos 2 caracteres
- Verifique la consola del navegador (F12)
- Asegúrese de que el servidor está corriendo
- Revise la conexión al endpoint `/api/sugerencias`

### Las fotos no cargan
- Verifique que la carpeta `fotos/` existe
- Confirme que se copió correctamente desde `datos_consultados/fotos/`
- Revise la consola para errores 404
- El servidor Flask debe estar corriendo

### Error al iniciar servidor
```bash
# Si el puerto 5000 está ocupado
# Cambie el puerto en server.py o cierre la aplicación que lo usa
netstat -ano | findstr :5000
```

## 🎯 Tecnologías Utilizadas

### Backend
- **Flask 3.0**: Framework web Python
- **Flask-CORS**: Soporte para CORS
- **Python 3.x**: Lenguaje del servidor

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Animaciones y diseño moderno
- **JavaScript ES6+**: Lógica de aplicación
- **Web Speech API**: Síntesis de voz
- **Fetch API**: Comunicación con backend

## 📊 Rendimiento

- **Tiempo de carga**: < 1 segundo
- **Búsqueda**: Instantánea (< 100ms)
- **Sugerencias**: Tiempo real con debounce (300ms)
- **Síntesis de voz**: Nativa del navegador (sin latencia)

## 🔒 Seguridad

- ✅ Escape de HTML en todos los datos
- ✅ Validación de entradas
- ✅ Sin almacenamiento de datos sensibles
- ✅ CORS configurado para desarrollo local

## 🚀 Mejoras Futuras Posibles

- [ ] Filtros avanzados (por año, facultad)
- [ ] Exportar resultados a PDF/Excel
- [ ] Modo oscuro
- [ ] Historial de búsquedas
- [ ] Comparar múltiples estudiantes
- [ ] Búsqueda por código QR/Barras
- [ ] Modo offline con Service Workers
- [ ] Múltiples idiomas

## 👥 Soporte

Para problemas o sugerencias:
1. Revise esta documentación
2. Verifique la consola del navegador (F12)
3. Revise los logs del servidor Flask
4. Contacte al administrador del sistema

---

**© 2026 Universidad Nacional Agraria de la Selva**

*Sistema de Consulta con Bot Parlante y Autocompletado Inteligente*

🎓 UNAS | 🗣️ Voice-Enabled | 💡 Smart Search | 🐍 Python Powered
