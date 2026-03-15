# 🔄 Sistema de Consulta Dual - Implementación RENIEC

## 📅 Fecha de Implementación
**14 de Marzo de 2026**

## 🎯 Objetivo
Integrar API de Factiliza/RENIEC para consultas por DNI, manteniendo la funcionalidad existente de búsqueda por código de estudiante.

---

## ✅ Cambios Implementados

### 1. **Backend (server.py)**

#### Nuevas Dependencias
```python
import requests
from dotenv import load_dotenv
```

#### Carga de Variables de Entorno
```python
load_dotenv(BASE_DIR / '.env')
RENIEC_TOKEN = os.getenv('RENIEC_TOKEN')
```

#### Nuevo Endpoint: `/api/r4n8i2c` (Consulta RENIEC)
- **Método**: POST
- **Rate Limit**: 20 consultas/minuto por IP
- **Input**: `{"dni": "61020080"}`
- **Output**: Datos encriptados de RENIEC
- **Características**:
  - Validación de DNI (8 dígitos numéricos)
  - Consulta a API de Factiliza
  - Formateo de respuesta
  - Manejo de errores (404, 500, timeout)
  - Encriptación Base64 de respuesta

### 2. **Frontend (app.js)**

#### Función `performSearch()` - Detección Automática
```javascript
const isDNI = /^\d{8}$/.test(searchTerm);

if (isDNI) {
    buscarPorDNI(searchTerm);  // Consulta API RENIEC
} else {
    buscarEnBaseDatos(searchTerm);  // Consulta local
}
```

#### Nueva Función: `buscarPorDNI(dni)`
- Realiza POST a `/api/r4n8i2c`
- Desencripta respuesta con Base64
- Muestra resultado con `displayReniecResult()`
- Síntesis de voz: "Se encontró información de RENIEC..."

#### Nueva Función: `displayReniecResult(data)`
- Crea card especial con badge "🏛️ RENIEC"
- Muestra datos de RENIEC:
  - Nombre completo
  - DNI
  - Fecha de nacimiento
  - Sexo y estado civil
  - Dirección completa
  - Ubigeo
  - Foto (si está disponible)

### 3. **Estilos (styles.css)**

#### Nuevos Estilos
```css
.result-badge {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    /* ... */
}

.reniec-badge {
    background: linear-gradient(135deg, #10b981, #059669);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

### 4. **Configuración**

#### `requirements.txt`
```
flask==3.0.0
flask-cors==4.0.0
python-dotenv==1.0.0
requests==2.31.0
```

#### `.env` (web_consulta/.env)
```env
RENIEC_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
UNAS_INFO_API=https://pagos.unas.edu.pe/person/validate/alumno
UNAS_PHOTOS_BASE=https://academico.unas.edu.pe/resources/Photos/Students
UNAS_MPD_URL=https://sgd.unas.edu.pe/mpd/inicio.do
```

#### `.env.example`
```env
RENIEC_TOKEN=tu_token_aqui
# ... otros campos opcionales
```

#### `.gitignore`
```gitignore
.env
.env.local
```

### 5. **Documentación**

#### Archivos Creados
- `ENV_SETUP.md` - Guía completa de configuración de variables de entorno
- `.env.example` - Plantilla de configuración
- `README.md` - Actualizado con nueva funcionalidad dual

---

## 🔐 Seguridad Implementada

### Protección Multi-Capa

1. **Variables de Entorno**
   - Token almacenado en `.env` (no en código)
   - `.env` excluido de Git
   - Configuración de Vercel con variables de entorno

2. **Rate Limiting**
   - Búsqueda RENIEC: 20 requests/minuto
   - Búsqueda local: 30 requests/minuto
   - Sugerencias: 50 requests/minuto

3. **Encriptación de Datos**
   - Todas las respuestas API encriptadas con Base64
   - Desencriptación en frontend

4. **Validación de Input**
   - DNI: Exactamente 8 dígitos numéricos
   - Sanitización de datos antes de mostrar

5. **DevTools Bloqueado**
   - F12, Ctrl+Shift+I/J/K/C/U bloqueados
   - Right-click deshabilitado
   - Detección de apertura de DevTools

---

## 📊 Flujo de Búsqueda

```
Usuario ingresa búsqueda
        ↓
    ¿8 dígitos?
    ↙        ↘
  SÍ          NO
   ↓           ↓
RENIEC      Base Local
   ↓           ↓
API Call   estudiantes.json
   ↓           ↓
Factiliza  Búsqueda local
   ↓           ↓
Datos      Datos + Foto
RENIEC     + Email + Tel
   ↓           ↓
Badge      Badge normal
🏛️ RENIEC
   ↓           ↓
   └─────┬─────┘
         ↓
   Mostrar Card
         ↓
   Síntesis Voz
```

---

## 🧪 Casos de Prueba

### Búsqueda por DNI (RENIEC)
```
Input: 61020080
Esperado: 
  - Consulta a API Factiliza
  - Badge verde "🏛️ RENIEC"
  - Datos de RENIEC mostrados
  - Voz: "Se encontró información de RENIEC..."
```

### Búsqueda por Código
```
Input: 0020240001
Esperado:
  - Búsqueda en estudiantes.json
  - Badge normal (gradient)
  - Datos locales + foto
  - Voz: "¡Resultado encontrado!..."
```

### Código Especial (0020240244)
```
Input: 0020240244
Esperado:
  - Búsqueda local exitosa
  - Efectos especiales activados:
    ✨ Confetti de corazones
    💖 Tema rosa
    🎵 Música romántica
  - Mensaje personalizado
```

---

## 🌐 Deployment

### Local
```bash
cd web_consulta
python server.py
# Abrir: http://localhost:5000
```

### Vercel
1. **Configurar variables de entorno**:
   - Dashboard → Settings → Environment Variables
   - Agregar: `RENIEC_TOKEN`

2. **Push a GitHub**:
   ```bash
   git add .
   git commit -m "feat: Integración API RENIEC para consulta por DNI"
   git push origin main
   ```

3. **Auto-deploy**: Vercel detecta cambios y despliega automáticamente

---

## 📝 Notas Importantes

### ✅ Funcionalidad Preservada
- ✅ Búsqueda por código de estudiante
- ✅ Autocompletado de nombres
- ✅ Visualización de fotos locales
- ✅ Bot con síntesis de voz
- ✅ Efectos especiales (código 0020240244)
- ✅ DevTools bloqueado
- ✅ Tema oscuro/claro
- ✅ Encriptación de endpoints

### ⚠️ Limitaciones
- DNI debe tener exactamente 8 dígitos
- Rate limiting aplicado (20 consultas/min)
- Requiere token válido de Factiliza
- Consultas RENIEC dependen de disponibilidad de API externa

### 🔄 Próximas Mejoras Sugeridas
- [ ] Cache de consultas RENIEC (evitar llamadas repetidas)
- [ ] Fallback si API Factiliza falla
- [ ] Log de consultas para estadísticas
- [ ] Panel admin para gestionar tokens
- [ ] Búsqueda híbrida (local + RENIEC simultánea)

---

## 📞 Soporte

### Obtener Token de Factiliza
- Web: https://factiliza.com
- Documentación: https://api.factiliza.com/docs

### Issues
- GitHub: https://github.com/MasterGateway/mastergateway/issues

---

**✅ Implementación Completa y Funcional**  
**Versión**: 2.0  
**Autor**: MasterGateway Team  
**Fecha**: 14 de Marzo de 2026
